import React, { useState } from "react";

interface TextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    options?: {
        validate?: (value: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        textareaClassName?: string; // Add textareaClassName here
        rows?: number; // Add rows field here
        cols?: number; // Add cols field here
    };
}

function Textarea({ value, onChange, className, options = {} }: TextareaProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Enter text...",
        validMessage,
        invalidMessage,
        textareaClassName = "", // Default to an empty string if not provided
        rows = 4, // Default rows value
        cols = 50, // Default cols value
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
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${textareaClassName}`} // Add textareaClassName here
                placeholder={placeholder}
                rows={rows} // Apply rows
                cols={cols} // Apply cols
            />
            {validate && isValid === false && invalidMessage && (
                <p className="mt-1 text-sm text-red-500">{invalidMessage}</p>
            )}
            {validate && isValid === true && value && validMessage && (
                <p className="mt-1 text-sm text-green-500">{validMessage}</p>
            )}
        </div>
    );
}

export default Textarea;
