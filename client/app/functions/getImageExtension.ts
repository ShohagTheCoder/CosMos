export default function getImageExtension(base64Str: string): string | null {
    // Regular expression to extract the mime type from the Base64 string
    const match = base64Str.match(/^data:image\/([a-zA-Z0-9+-.]+);base64,/);

    if (match && match[1]) {
        // Return the file extension based on the mime type
        const mimeType = match[1];
        const extensionMap: Record<string, string> = {
            jpeg: "jpg",
            jpg: "jpg",
            png: "png",
            gif: "gif",
            webp: "webp",
            bmp: "bmp",
            "svg+xml": "svg",
        };

        return extensionMap[mimeType] || null; // Default to null if extension is not found
    }

    return null; // Return null if no match is found
}
