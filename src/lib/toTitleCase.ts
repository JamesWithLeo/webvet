/**
 * Converts a string to Title Case.
 *
 * Example:
 
           "hello world" -> "Hello World"

           "hellO_worLd" -> "Hello World"
 * @param {string} str The input string.
 * @returns {string} The Title Cased string.
 */
export function toTitleCase(str: string): string {
    return str
        .replace(/_/g, " ") // 1. Replace all underscores with spaces
        .toLowerCase() // 2. Convert everything to lowercase
        .replace(/\b\w/g, (char) => {
            // 3. Capitalize the first letter of each word
            return char.toUpperCase();
        });
}
