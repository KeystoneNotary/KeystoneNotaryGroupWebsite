#!/usr/bin/env npx ts-node
/**
 * Password Hashing Utility
 *
 * Generates a bcrypt hash for the admin password.
 * Usage: npm run hash-password
 *
 * The generated hash should be added to your .env file as:
 * ADMIN_PASSWORD_HASH=<generated_hash>
 */

import bcrypt from "bcrypt";
import readline from "readline";

const SALT_ROUNDS = 12;

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n========================================");
  console.log("  Keystone Notary Group Password Hasher");
  console.log("========================================\n");

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    const password = await question("Enter the admin password to hash: ");

    if (!password || password.length < 8) {
      console.error("\nError: Password must be at least 8 characters long.");
      process.exit(1);
    }

    console.log("\nGenerating hash with", SALT_ROUNDS, "salt rounds...");

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    console.log("\n========================================");
    console.log("  Generated Hash:");
    console.log("========================================\n");
    console.log(hash);
    console.log("\n========================================");
    console.log("  Add to your .env file:");
    console.log("========================================\n");
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log("\n");
  } catch (error) {
    console.error("\nError generating hash:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
