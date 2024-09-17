import React, { useState } from "react";

interface TextAreaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    options?: {
        validate?: (value: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        textAreaClassName?: string; // Add textAreaClassName here
        rows?: number; // Optionally allow rows for textarea
    };
}

function TextArea({ value, onChange, className, options = {} }: TextAreaProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Enter text...",
        validMessage = "Valid input!",
        invalidMessage = "Invalid input!",
        textAreaClassName = "", // Default to an empty string if not provided
        rows = 4, // Default to 4 rows if not specified
    } = options;

    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            <textarea
                value={value}
                onChange={handleChange}
                rows={rows}
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${textAreaClassName}`} // Add textAreaClassName here
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

export default TextArea;
