interface UploadResponse {
    success: boolean;
    message?: string; // Optional message in case of failure
}

export default async function handleImageUpload(
    image: any,
    name: string
): Promise<boolean> {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("imageName", name);

    try {
        const response = await fetch("/api/uploads/images/products", {
            method: "POST",
            body: formData,
        });

        const result: UploadResponse = await response.json();

        if (result.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        // You might want to handle the error appropriately, e.g., sending it to an error tracking service
        return false;
    }
}
