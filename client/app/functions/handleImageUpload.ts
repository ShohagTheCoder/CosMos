interface UploadResponse {
    success: boolean;
    message?: string; // Optional message in case of failure
}

// eslint-disable-next-line no-unused-vars
type ImageCallback = (file: File) => string | undefined; // The callback returns a new name or undefined if not changing

export default async function handleImageUpload(
    image: File,
    updateFileNameCallback?: ImageCallback
): Promise<boolean> {
    const formData = new FormData();

    // If a callback is provided and returns a new name, change the file name
    let fileName = image.name;
    if (updateFileNameCallback) {
        const updatedName = updateFileNameCallback(image);
        if (updatedName) {
            fileName = updatedName;
        }
    }

    // Use the updated or original file name
    const renamedImage = new File([image], fileName, { type: image.type });
    formData.append("image", renamedImage);

    try {
        const response = await fetch("/api/uploads/images/products", {
            method: "POST",
            body: formData,
        });

        const result: UploadResponse = await response.json();

        return result.success;
    } catch (error) {
        console.error("Error uploading image:", error);
        return false;
    }
}
