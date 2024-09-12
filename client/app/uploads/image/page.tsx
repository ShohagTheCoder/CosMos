"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

export default function UploadImage() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    async function handleUpload(e: FormEvent) {
        e.preventDefault();
        if (!image) {
            setMessage("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.set("image", image);

        try {
            const response = await fetch("/api/uploads/", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Image uploaded successfully!");
                setImage(null); // Clear the image
                setPreview(null); // Clear the preview
            } else {
                setMessage("Failed to upload image.");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessage("An error occurred. Please try again.");
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <form
                onSubmit={handleUpload}
                className="max-w-lg mx-auto p-6 bg-white border rounded-lg shadow-md"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Upload Image:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                {/* Image Preview */}
                {preview && (
                    <div className="mb-4">
                        <p className="text-gray-700 mb-2">Image Preview:</p>
                        <img
                            src={preview}
                            alt="Image Preview"
                            className="w-full h-64 object-cover border rounded-lg"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Upload Image
                </button>

                {message && (
                    <p
                        className={`mt-4 text-center ${
                            message.includes("success")
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
