import React, { ChangeEvent, useState } from "react";

interface ImageInputProps {
    image: File | undefined;
    callback: (image: File) => void;
    className?: string;
    options?: {
        label?: string;
        inputClassName?: string;
        previewClassName?: string;
        labelClassName?: string;
        containerClassName?: string;
        renameCallback?: (file: File) => string; // Optional rename callback
    };
}

const ImageInput: React.FC<ImageInputProps> = ({
    image,
    callback,
    className = "",
    options = {},
}) => {
    const [preview, setPreview] = useState<File | undefined>(image);

    const {
        label = "Product image",
        inputClassName = "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
        previewClassName = "w-full h-full object-cover rounded-lg",
        labelClassName = "block mb-2 text-gray-400",
        containerClassName = "relative w-[160px] h-[160px] border-2 border-dashed border-gray-500 flex justify-center items-center rounded-lg cursor-pointer",
        renameCallback, // Get the rename callback from options
    } = options;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            let newFile = file;

            // Check if there's a rename callback provided
            if (renameCallback) {
                const newName = renameCallback(file);
                if (newName) {
                    // Create a new File with the updated name
                    newFile = new File([file], newName, { type: file.type });
                }
            }

            setPreview(newFile);
            callback(newFile);
        }
    };

    return (
        <div className={`product-image mb-2 ${className}`}>
            <label htmlFor="product-image" className={labelClassName}>
                {label}
            </label>
            <div className={containerClassName}>
                <input
                    type="file"
                    accept="image/*"
                    id="product-image"
                    onChange={handleFileChange}
                    className={inputClassName}
                />

                {preview ? (
                    <img
                        src={URL.createObjectURL(preview)}
                        alt="Image Preview"
                        className={previewClassName}
                    />
                ) : (
                    <span className="text-gray-400 text-4xl font-bold">+</span>
                )}
            </div>
        </div>
    );
};

export default ImageInput;
