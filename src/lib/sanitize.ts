/**
 * Shared sanitization utilities for secure data handling
 * Used by email templates and calendar event creation
 */

/**
 * Escapes HTML special characters to prevent XSS
 * @param text - Raw text input
 * @returns HTML-safe escaped string
 */
export const escapeHtml = (text: string): string =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#x27;",
      }[char] || char)
  );

/**
 * Removes control characters from text
 * Useful for sanitizing text that will be displayed in plain text contexts
 * @param text - Raw text input
 * @returns Text with control characters removed
 */
export const sanitizeForText = (text: string): string =>
  text.replace(/[\x00-\x1F\x7F]/g, "");

/**
 * Escapes a value for safe HTML output
 * Handles null/undefined values gracefully
 * @param value - Value to escape (string, number, null, or undefined)
 * @returns HTML-safe escaped string
 */
export const escapeValue = (value: string | number | null | undefined): string =>
  escapeHtml(String(value ?? ""));

/**
 * Sanitizes text for use in plain text contexts (emails, calendar descriptions)
 * Removes control characters and normalizes whitespace
 * @param text - Raw text input
 * @returns Sanitized plain text
 */
export const sanitizeText = (text: string | null | undefined): string => {
  if (!text) return "";
  return sanitizeForText(String(text)).trim();
};

/**
 * Formats a price value safely
 * @param price - Price as number
 * @returns Formatted price string or "N/A" if invalid
 */
export const formatPrice = (price: number): string => {
  if (!Number.isFinite(price) || price < 0) {
    return "N/A";
  }
  return price.toFixed(2);
};
