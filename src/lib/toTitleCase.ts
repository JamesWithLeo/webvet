/**
 * Converts a string to Title Case.
 * Example: "hello world" -> "Hello World"
 * @param {string} str The input string.
 * @returns {string} The Title Cased string.
 */
export function toTitleCase(str: string): string {
    const lowerStr = str.toLowerCase();
    return lowerStr.replace(/\b\w/g, (char) => {
        return char.toUpperCase();
    });
}
