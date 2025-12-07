import bcrypt from "bcrypt";

/**
 * Hashes a password using bcrypt
 * @param password Plain text password
 * @param saltRounds Number of salt rounds (default: 12)
 * @returns Hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Verifies a password against a hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Boolean indicating if password matches hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error(`Password verification failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
