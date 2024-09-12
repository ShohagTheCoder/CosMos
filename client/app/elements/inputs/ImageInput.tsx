import React, { ChangeEvent, useState, useEffect } from "react";

interface ImageInputProps {
    localTempName: string;
    src: string | null | undefined;
    callback: (image: File) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({
    localTempName = "cosmos-image",
    src = null,
    callback,
}) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (src == null) {
            const storedImage = localStorage.getItem(localTempName);
            if (storedImage) {
                setPreview(storedImage);
            }
        } else {
            setPreview(src);
        }
    }, [localTempName, src]);

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
            setPreview(URL.createObjectURL(file)); // Create a preview URL
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
