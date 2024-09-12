import React, { ChangeEvent, useState, useEffect } from "react";

interface ImageInputProps {
    localTempName: string;
    src: string | undefined;
    callback: (image: File) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({
    localTempName = "cosmos-image",
    src = undefined,
    callback,
}) => {
    const [preview, setPreview] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (src == "updated") {
            const storedImage = localStorage.getItem(localTempName);
            if (storedImage) {
                setPreview(storedImage);
            }
        } else {
            setPreview(src);
        }
    }, [localTempName, src]);

    let previewUrl: string | null = null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    localStorage.setItem(
                        localTempName,
                        reader.result as string
                    );
                }
            };
            reader.readAsDataURL(file);

            // Revoke the previous object URL if it exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            // Create a new preview URL and store it
            previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl); // Create a preview URL

            callback(file);
        }
    };

    return (
        <div className="product-image mb-2">
            <label htmlFor="product-image" className="block mb-2 text-gray-400">
                Product image
            </label>
            <div className="relative w-[160px] h-[160px] border-2 border-dashed border-gray-500 flex justify-center items-center rounded-lg cursor-pointer">
                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*"
                    id="product-image"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {/* Image Preview */}
                {preview ? (
                    <img
                        src={preview}
                        alt="Image Preview"
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <span className="text-gray-400 text-4xl font-bold">+</span>
                )}
            </div>
        </div>
    );
};

export default ImageInput;
