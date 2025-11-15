import { describe, expect, it, beforeEach } from 'vitest';
import MemoryBank from '../src/js/modules/memory/memory-bank.js';

const DAY = 1000 * 60 * 60 * 24;

describe('MemoryBank', () => {
    let currentTime;
    let nowProvider;
    let storageAdapter;
    let bank;

    beforeEach(() => {
        currentTime = 1_700_000_000_000;
        nowProvider = () => currentTime;
        storageAdapter = MemoryBank.createInMemoryStorageAdapter();
        bank = new MemoryBank({
            storageAdapter,
            nowProvider,
            maxEntries: 3,
            defaultTtlMs: DAY,
            staleAfterMs: DAY / 2,
            minImportanceForRetention: 0.4
        });
    });

    it('adds memory entries and retrieves them in chronological order', () => {
        const first = bank.addMemory({
            content: 'Client asked about mobile notary availability.',
            category: 'chat',
            importance: 0.6
        });

        currentTime += 1_000;
        const second = bank.addMemory({
            content: 'Assistant confirmed availability and provided phone number.',
            category: 'chat',
            importance: 0.5
        });

        const memories = bank.getMemories({ category: 'chat', sortBy: 'createdAt' });
        expect(memories).toHaveLength(2);
        expect(memories[0].id).toBe(first.id);
        expect(memories[1].id).toBe(second.id);
    });

    it('prunes expired memories automatically', () => {
        bank.addMemory({
            content: 'Temporary booking note.',
            category: 'chat',
            ttlMs: 65_000,
            importance: 0.7
        });

        currentTime += 70_000;
        bank.maintain();

        const memories = bank.getMemories({ category: 'chat' });
        expect(memories).toHaveLength(0);
    });

    it('removes stale low-importance memories but keeps high-value ones', () => {
        const oldCreatedAt = currentTime - DAY * 4;

        const important = bank.addMemory({
            content: 'Long-term signing instructions.',
            category: 'chat',
            importance: 0.9,
            createdAt: oldCreatedAt,
            ttlMs: DAY * 10
        });

        bank.addMemory({
            content: 'Casual greeting from bot.',
            category: 'chat',
            importance: 0.2,
            createdAt: oldCreatedAt,
            ttlMs: DAY * 10
        });

        currentTime += DAY * 2;
        bank.maintain();

        const memories = bank.getMemories({ category: 'chat', sortBy: 'importance' });
        expect(memories).toHaveLength(1);
        expect(memories[0].id).toBe(important.id);
    });

    it('enforces max entries while keeping the most important memories', () => {
        bank.addMemory({ content: 'Low priority note.', category: 'chat', importance: 0.3, ttlMs: DAY * 4 });
        const mid = bank.addMemory({ content: 'Medium priority update.', category: 'chat', importance: 0.5, ttlMs: DAY * 4 });
        const high = bank.addMemory({ content: 'High priority notarization task.', category: 'chat', importance: 0.8, ttlMs: DAY * 4 });

        const critical = bank.addMemory({
            content: 'Critical estate document reminder.',
            category: 'chat',
            importance: 0.95,
            ttlMs: DAY * 4
        });

        const memories = bank.getMemories({ category: 'chat', sortBy: 'importance' });
        expect(memories).toHaveLength(3);
        expect(memories.map((entry) => entry.id)).toEqual([critical.id, high.id, mid.id]);
    });

    it('updates metadata and extends ttl through updateMemory', () => {
        const entry = bank.addMemory({
            content: 'Client requested apostille services.',
            category: 'chat',
            importance: 0.6,
            ttlMs: DAY
        });

        currentTime += 500;
        const updated = bank.updateMemory(entry.id, {
            metadata: { client: 'Acme Corp', urgent: true },
            ttlMs: DAY * 3,
            importance: 0.75
        });

        expect(updated.metadata).toMatchObject({ client: 'Acme Corp', urgent: true });
        expect(updated.importance).toBeCloseTo(0.75);
        expect(updated.expiresAt).toBe(entry.createdAt + DAY * 3);
    });

    it('records access and boosts importance for low priority items', () => {
        const entry = bank.addMemory({
            content: 'General FAQ response.',
            category: 'chat',
            importance: 0.25,
            ttlMs: DAY * 2
        });

        const before = bank.getMemories({ category: 'chat', sortBy: 'createdAt' })[0];
        expect(before.importance).toBeCloseTo(0.25, 5);

        const result = bank.recordAccess(entry.id);
        expect(result).toBe(true);

        const after = bank.getMemories({ category: 'chat', sortBy: 'createdAt' })[0];
        expect(after.importance).toBeGreaterThan(before.importance);
        expect(after.lastAccessed).toBe(currentTime);
    });

    it('sanitizes metadata and prevents prototype pollution in add/update flows', () => {
        const entry = bank.addMemory({
            content: 'Potentially malicious metadata payload.',
            category: '__proto__',
            tags: ['user', '__proto__'],
            metadata: {
                __proto__: { polluted: true },
                constructor: 'ignored',
                safe: 'value'
            },
            importance: 0.7,
            ttlMs: DAY * 3
        });

        expect(entry.category).toBe('general');
        expect(entry.tags).toEqual(['user']);
        expect(entry.metadata).toEqual({ safe: 'value' });
        expect(Object.prototype.polluted).toBeUndefined();

        const stored = bank.getMemories({ category: 'general', sortBy: 'createdAt' })[0];
        expect(stored.metadata).toEqual({ safe: 'value' });
        expect(stored.tags).toEqual(['user']);

        const updated = bank.updateMemory(entry.id, {
            metadata: { __proto__: { polluted: true }, verified: true },
            category: 'verified',
            tags: ['assistant', 'verified', '__proto__']
        });

        expect(updated.category).toBe('verified');
        expect(updated.tags).toEqual(['assistant', 'verified']);
        expect(updated.metadata).toEqual({ safe: 'value', verified: true });
        expect(Object.prototype.polluted).toBeUndefined();
    });

    it('sanitizes persisted state loaded from storage adapters', () => {
        const maliciousState = {
            version: 1,
            lastUpdated: currentTime,
            entries: [
                {
                    id: 'malicious',
                    content: 'Persisted entry with polluted metadata.',
                    category: '__proto__',
                    tags: ['assistant', '__proto__'],
                    importance: 0.9,
                    createdAt: currentTime,
                    lastAccessed: currentTime,
                    expiresAt: currentTime + DAY,
                    metadata: {
                        __proto__: { hacked: true },
                        safe: 'ok'
                    }
                }
            ]
        };

        const maliciousAdapter = MemoryBank.createInMemoryStorageAdapter(maliciousState);
        const reloaded = new MemoryBank({
            storageAdapter: maliciousAdapter,
            nowProvider,
            maxEntries: 3,
            defaultTtlMs: DAY,
            staleAfterMs: DAY / 2,
            minImportanceForRetention: 0.4
        });

        const memories = reloaded.getMemories({ sortBy: 'createdAt' });
        expect(memories).toHaveLength(1);
        expect(memories[0].category).toBe('general');
        expect(memories[0].metadata).toEqual({ safe: 'ok' });
        expect(memories[0].tags).toEqual(['assistant']);
        expect(Object.prototype.hacked).toBeUndefined();
    });
});
