import React, { useState } from "react";

interface TextInputProps {
    value: string;
    // eslint-disable-next-line no-unused-vars
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    options?: {
        // eslint-disable-next-line no-unused-vars
        validate?: (value: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        inputClassName?: string; // Add inputClassName here
    };
}

function TextInput({
    value,
    onChange,
    className,
    options = {},
}: TextInputProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Enter text...",
        validMessage = "Valid input!",
        invalidMessage = "Invalid input!",
        inputClassName = "", // Default to an empty string if not provided
    } = options;

    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(e);
        if (validate) {
            setIsValid(validate(newValue));
        } else {
            setIsValid(null);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block mb-2 text-gray-400">{label}</label>
            )}
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${inputClassName}`} // Add inputClassName here
                placeholder={placeholder}
            />
            {validate && isValid === false && (
                <p className="mt-1 text-sm text-red-500">{invalidMessage}</p>
            )}
            {validate && isValid === true && value && (
                <p className="mt-1 text-sm text-green-500">{validMessage}</p>
            )}
        </div>
    );
}

export default TextInput;
