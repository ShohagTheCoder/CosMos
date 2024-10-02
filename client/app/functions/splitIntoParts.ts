export default function splitIntoParts(
    str: string,
    delimiter: string,
    numParts: number
): [string, string] | string[] {
    if (numParts <= 1) return [str]; // If parts is 1 or less, return the full string as a single part.

    const parts: string[] = [];
    let remaining = str;

    for (let i = 1; i < numParts; i++) {
        const index = remaining.indexOf(delimiter);
        if (index === -1) break; // If no more delimiters, exit the loop.

        // Add the part before the delimiter to `parts` array.
        parts.push(remaining.slice(0, index));
        // Update `remaining` to exclude the part before the current delimiter.
        remaining = remaining.slice(index + delimiter.length);
    }

    parts.push(remaining); // Add the remaining string as the last part.
    return parts;
}
