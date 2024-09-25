interface UploadResponse {
    success: boolean;
    message?: string; // Optional message in case of failure
}

type ImageCallback = (file: File) => string | undefined;

interface UploadOptions {
    url: string; // The API endpoint for uploading the image
    fieldName?: string; // The name of the form field for the image, default is 'image'
    updateFileNameCallback?: ImageCallback; // Optional callback to rename the image file
}

export default async function handleImageUpload(
    image: File,
    options: UploadOptions
): Promise<boolean> {
    const { url, fieldName = "image", updateFileNameCallback } = options;
    const formData = new FormData();

    // Determine the final file name (use the callback if provided)
    let fileName = image.name;
    if (updateFileNameCallback) {
        const updatedName = updateFileNameCallback(image);
        if (updatedName) {
            fileName = updatedName;
        }
    }

    // Create a new file with the updated or original name
    const renamedImage = new File([image], fileName, { type: image.type });
    formData.append(fieldName, renamedImage);

    try {
        const response = await fetch(url, {
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
