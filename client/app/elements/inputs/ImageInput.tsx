import React, { ChangeEvent, useEffect, useState } from "react";

interface ImageInputProps {
    image: File | null; // Current image file
    previewImageUrl?: string | null; // Preview image URL to show if image is not set
    // eslint-disable-next-line no-unused-vars
    callback: (image: File) => void; // Callback function for file changes
    className?: string; // For outermost container
    options?: {
        label?: string; // Label for the input
        // eslint-disable-next-line no-unused-vars
        renameCallback?: (file: File) => string; // Optional rename callback
        inputClassName?: string; // Custom class for the input
        previewClassName?: string; // Custom class for the preview image
        labelClassName?: string; // Custom class for the label
        containerClassName?: string; // Custom class for the container
    };
}

const ImageInput: React.FC<ImageInputProps> = ({
    image,
    previewImageUrl = null, // Default to null if not provided
    callback,
    className = "",
    options = {},
}) => {
    const [preview, setPreview] = useState<string | null>(null);

    const {
        label = "Product image",
        renameCallback,
        inputClassName = "",
        previewClassName = "",
        labelClassName = "",
        containerClassName = "",
    } = options;

    useEffect(() => {
        // Set initial preview based on the image prop or the previewImageUrl
        if (image) {
            const objectUrl = URL.createObjectURL(image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl); // Cleanup on unmount
        } else if (previewImageUrl) {
            setPreview(previewImageUrl); // Set preview from prop if no image
        } else {
            setPreview(null); // Reset preview if no image and no URL
        }
    }, [image, previewImageUrl]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            let newFile = file;

            if (renameCallback) {
                const newName = renameCallback(file);
                if (newName) {
                    newFile = new File([file], newName, { type: file.type });
                }
            }

            // Revoke the old object URL if it exists
            if (preview) {
                URL.revokeObjectURL(preview);
            }

            const newObjectUrl = URL.createObjectURL(newFile);
            setPreview(newObjectUrl);
            callback(newFile);

            // Cleanup when the preview changes
            return () => {
                URL.revokeObjectURL(newObjectUrl);
            };
        }
    };

    return (
        <div className={`product-image mb-2 ${className}`}>
            <label
                htmlFor="product-image"
                className={`block mb-2 text-gray-400 ${labelClassName}`}
            >
                {label}
            </label>
            <div
                className={`relative w-[160px] h-[160px] border-2 border-dashed border-gray-500 flex justify-center items-center rounded-lg ${containerClassName}`}
            >
                <input
                    type="file"
                    accept="image/*"
                    id="product-image"
                    onChange={handleFileChange}
                    className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer ${inputClassName}`} // Append custom input classes
                    aria-label="Upload product image"
                />

                {preview === null ? ( // Show the plus icon when preview is null
                    <span className="text-gray-400 text-4xl font-bold">+</span>
                ) : (
                    <img
                        src={preview}
                        alt="Image Preview"
                        className={`w-full p-2 h-full object-contain rounded-lg ${previewClassName}`}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageInput;
