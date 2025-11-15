const DEFAULT_STATE = Object.freeze({
    version: 1,
    lastUpdated: null,
    entries: []
});

const DEFAULT_MAX_ENTRIES = 200;
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const DEFAULT_STALE_AFTER_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const MAX_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year cap

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const clamp = (value, min, max) => {
    if (Number.isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
};

const cloneState = (state) => {
    if (typeof structuredClone === 'function') {
        return structuredClone(state);
    }
    return JSON.parse(JSON.stringify(state));
};

const createDefaultState = () => cloneState(DEFAULT_STATE);

const detectLocalStorage = () => {
    try {
        if (typeof globalThis !== 'undefined' && isPlainObject(globalThis)) {
            const { localStorage } = globalThis;
            if (localStorage && typeof localStorage.getItem === 'function' && typeof localStorage.setItem === 'function') {
                const probeKey = '__codex_memory_probe__';
                localStorage.setItem(probeKey, '1');
                localStorage.removeItem(probeKey);
                return localStorage;
            }
        }
    } catch (error) {
        console.warn('MemoryBank: Falling back to in-memory storage because localStorage is unavailable.', error);
    }
    return null;
};

const parseState = (raw) => {
    if (!raw) {
        return createDefaultState();
    }

    let parsed;

    if (typeof raw === 'string') {
        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            console.warn('MemoryBank: Failed to parse stored state. Resetting.', error);
            return createDefaultState();
        }
    } else if (isPlainObject(raw)) {
        parsed = raw;
    } else {
        return createDefaultState();
    }

    if (!Array.isArray(parsed.entries)) {
        parsed.entries = [];
    }

    return {
        version: typeof parsed.version === 'number' ? parsed.version : 1,
        lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : null,
        entries: parsed.entries
            .filter((entry) => isPlainObject(entry) && typeof entry.content === 'string')
            .map((entry) => ({
                ...entry,
                tags: Array.isArray(entry.tags) ? entry.tags.filter((tag) => typeof tag === 'string') : [],
                metadata: isPlainObject(entry.metadata) ? { ...entry.metadata } : {},
                importance: typeof entry.importance === 'number' ? clamp(entry.importance, 0, 1) : 0.5,
                createdAt: typeof entry.createdAt === 'number' ? entry.createdAt : Date.now(),
                lastAccessed: typeof entry.lastAccessed === 'number' ? entry.lastAccessed : Date.now(),
                expiresAt:
                    typeof entry.expiresAt === 'number'
                        ? entry.expiresAt
                        : Date.now() + DEFAULT_TTL_MS
            }))
    };
};

const createStorageAdapter = (storageKey, storageInstance) => {
    if (
        storageInstance &&
        typeof storageInstance.getItem === 'function' &&
        typeof storageInstance.setItem === 'function'
    ) {
        return {
            load: () => parseState(storageInstance.getItem(storageKey)),
            save: (state) => {
                storageInstance.setItem(storageKey, JSON.stringify(state));
            }
        };
    }

    const detectedStorage = detectLocalStorage();
    if (detectedStorage) {
        return createStorageAdapter(storageKey, detectedStorage);
    }

    let state = createDefaultState();
    return {
        load: () => cloneState(state),
        save: (nextState) => {
            state = cloneState(nextState);
        }
    };
};

const sanitizeTags = (tags) => {
    if (!Array.isArray(tags)) return [];
    return tags.filter((tag) => typeof tag === 'string' && tag.trim().length > 0).map((tag) => tag.trim());
};

const sanitizeMetadata = (metadata) => {
    if (!isPlainObject(metadata)) return {};
    return Object.entries(metadata).reduce((acc, [key, value]) => {
        if (typeof key !== 'string' || !key.trim()) return acc;
        if (['string', 'number', 'boolean'].includes(typeof value)) {
            acc[key.trim()] = value;
        }
        return acc;
    }, {});
};

const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `mem_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
};

class MemoryBank {
    constructor(config = {}) {
        const {
            storageKey = 'codex.memory.bank',
            storageAdapter,
            storage,
            maxEntries = DEFAULT_MAX_ENTRIES,
            defaultTtlMs = DEFAULT_TTL_MS,
            staleAfterMs = DEFAULT_STALE_AFTER_MS,
            minImportanceForRetention = 0.4,
            nowProvider
        } = config;

        this.now = typeof nowProvider === 'function' ? nowProvider : () => Date.now();
        this.storageKey = storageKey;
        this.storage = storageAdapter || createStorageAdapter(storageKey, storage);
        this.maxEntries = Math.max(1, Math.trunc(maxEntries));
        this.defaultTtlMs = clamp(defaultTtlMs, 60_000, MAX_TTL_MS);
        this.staleAfterMs = clamp(staleAfterMs, 60_000, MAX_TTL_MS);
        this.minImportanceForRetention = clamp(minImportanceForRetention, 0, 1);
        this.version = 1;

        const initialState = this.storage.load();
        this.entries = Array.isArray(initialState.entries) ? initialState.entries.map((entry) => ({ ...entry })) : [];
        this.lastUpdated = initialState.lastUpdated ?? null;
        this.version = initialState.version ?? this.version;

        this.maintain();
    }

    static createInMemoryStorageAdapter(initialState = createDefaultState()) {
        let state = cloneState(initialState);
        return {
            load: () => cloneState(state),
            save: (nextState) => {
                state = cloneState(nextState);
            }
        };
    }

    addMemory({
        content,
        category = 'general',
        tags = [],
        importance = 0.5,
        ttlMs,
        metadata,
        createdAt
    }) {
        const sanitizedContent = typeof content === 'string' ? content.trim() : '';
        if (!sanitizedContent) {
            throw new Error('MemoryBank.addMemory requires non-empty string content.');
        }

        if (category && typeof category !== 'string') {
            throw new Error('MemoryBank.addMemory category must be a string.');
        }

        const now = this.now();
        const baseCreatedAt = typeof createdAt === 'number' && Number.isFinite(createdAt) ? createdAt : now;
        const safeCreatedAt = baseCreatedAt > now ? now : baseCreatedAt;
        const safeImportance = clamp(typeof importance === 'number' ? importance : 0.5, 0, 1);
        const safeTtl = clamp(typeof ttlMs === 'number' && ttlMs > 0 ? ttlMs : this.defaultTtlMs, 60_000, MAX_TTL_MS);
        const expiresAt = safeCreatedAt + safeTtl;

        const entry = {
            id: generateId(),
            content: sanitizedContent,
            category: category || 'general',
            tags: sanitizeTags(tags),
            importance: safeImportance,
            createdAt: safeCreatedAt,
            lastAccessed: now,
            expiresAt,
            metadata: sanitizeMetadata(metadata)
        };

        this.entries.push(entry);
        this.maintain();
        this.persist();
        return { ...entry, metadata: { ...entry.metadata } };
    }

    updateMemory(id, updates = {}) {
        if (!id || typeof id !== 'string') {
            throw new Error('MemoryBank.updateMemory requires a string id.');
        }
        const entry = this.entries.find((item) => item.id === id);
        if (!entry) {
            return null;
        }

        let mutated = false;

        if (typeof updates.content === 'string') {
            const trimmed = updates.content.trim();
            if (trimmed) {
                entry.content = trimmed;
                mutated = true;
            }
        }

        if (typeof updates.category === 'string' && updates.category.trim()) {
            entry.category = updates.category.trim();
            mutated = true;
        }

        if (Array.isArray(updates.tags)) {
            entry.tags = sanitizeTags(updates.tags);
            mutated = true;
        }

        if (typeof updates.importance === 'number') {
            entry.importance = clamp(updates.importance, 0, 1);
            mutated = true;
        }

        if (typeof updates.ttlMs === 'number' && updates.ttlMs > 0) {
            const safeTtl = clamp(updates.ttlMs, 60_000, MAX_TTL_MS);
            entry.expiresAt = this.now() + safeTtl;
            mutated = true;
        }

        if (isPlainObject(updates.metadata)) {
            entry.metadata = {
                ...entry.metadata,
                ...sanitizeMetadata(updates.metadata)
            };
            mutated = true;
        }

        if (mutated) {
            entry.lastAccessed = this.now();
            this.maintain();
            this.persist();
        }

        return { ...entry, metadata: { ...entry.metadata } };
    }

    removeMemory(id) {
        if (!id || typeof id !== 'string') {
            return false;
        }
        const originalLength = this.entries.length;
        this.entries = this.entries.filter((entry) => entry.id !== id);
        const removed = this.entries.length !== originalLength;
        if (removed) {
            this.persist();
        }
        return removed;
    }

    getMemories(options = {}) {
        const {
            category,
            tags,
            limit,
            includeExpired = false,
            minImportance = 0,
            sortBy = 'importance'
        } = options;

        const now = this.now();
        this.maintain(now);

        let results = this.entries.slice();

        if (!includeExpired) {
            results = results.filter((entry) => entry.expiresAt > now);
        }

        if (category) {
            results = results.filter((entry) => entry.category === category);
        }

        if (Array.isArray(tags) && tags.length > 0) {
            results = results.filter((entry) => tags.every((tag) => entry.tags.includes(tag)));
        }

        const thresholdImportance = clamp(minImportance, 0, 1);
        results = results.filter((entry) => entry.importance >= thresholdImportance);

        const sorter = this.createSorter(sortBy);
        results.sort(sorter);

        const safeLimit = typeof limit === 'number' && limit > 0 ? Math.floor(limit) : null;
        if (safeLimit) {
            results = results.slice(0, safeLimit);
        }

        return results.map((entry) => ({ ...entry, metadata: { ...entry.metadata } }));
    }

    recordAccess(id) {
        if (!id || typeof id !== 'string') {
            return false;
        }
        const entry = this.entries.find((item) => item.id === id);
        if (!entry) {
            return false;
        }
        const now = this.now();
        entry.lastAccessed = now;
        if (entry.importance < this.minImportanceForRetention) {
            entry.importance = clamp(entry.importance + 0.05, 0, 1);
        }
        this.persist();
        return true;
    }

    maintain(referenceTime = this.now()) {
        const removedExpired = this.removeExpired(referenceTime);
        const removedIrrelevant = this.removeIrrelevant(referenceTime);
        const trimmedForLimit = this.enforceLimits();

        if (removedExpired || removedIrrelevant || trimmedForLimit) {
            this.persist();
        }

        return {
            removedExpired,
            removedIrrelevant,
            trimmedForLimit
        };
    }

    createSorter(sortBy) {
        switch (sortBy) {
            case 'createdAt':
                return (a, b) => a.createdAt - b.createdAt;
            case 'recency':
                return (a, b) => b.lastAccessed - a.lastAccessed;
            default:
                return (a, b) => {
                    if (b.importance !== a.importance) {
                        return b.importance - a.importance;
                    }
                    if (b.lastAccessed !== a.lastAccessed) {
                        return b.lastAccessed - a.lastAccessed;
                    }
                    return b.createdAt - a.createdAt;
                };
        }
    }

    removeExpired(referenceTime) {
        const originalLength = this.entries.length;
        this.entries = this.entries.filter((entry) => entry.expiresAt > referenceTime);
        return originalLength - this.entries.length;
    }

    removeIrrelevant(referenceTime) {
        const thresholdTime = referenceTime - this.staleAfterMs;
        const originalLength = this.entries.length;
        this.entries = this.entries.filter((entry) => {
            if (entry.importance >= this.minImportanceForRetention) {
                return true;
            }
            const recentInteraction = entry.lastAccessed >= thresholdTime || entry.createdAt >= thresholdTime;
            return recentInteraction;
        });
        return originalLength - this.entries.length;
    }

    enforceLimits() {
        if (this.entries.length <= this.maxEntries) {
            return 0;
        }
        this.entries.sort((a, b) => {
            if (b.importance !== a.importance) {
                return b.importance - a.importance;
            }
            if (b.lastAccessed !== a.lastAccessed) {
                return b.lastAccessed - a.lastAccessed;
            }
            return b.createdAt - a.createdAt;
        });
        const removed = this.entries.length - this.maxEntries;
        this.entries.length = this.maxEntries;
        return removed;
    }

    persist() {
        this.lastUpdated = this.now();
        const state = {
            version: this.version,
            lastUpdated: this.lastUpdated,
            entries: this.entries.map((entry) => ({
                ...entry,
                metadata: { ...entry.metadata },
                tags: [...entry.tags]
            }))
        };
        this.storage.save(state);
    }
}

export { MemoryBank as default, createStorageAdapter };
export { createStorageAdapter as createBrowserStorageAdapter };
