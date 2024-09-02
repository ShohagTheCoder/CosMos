import React, { useState, useEffect } from "react";

interface NumberInputProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    options?: {
        validate?: (value: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        inputClassName?: string;
    };
}

function NumberInput({
    value,
    onChange,
    className,
    options = {},
}: NumberInputProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Enter number...",
        validMessage,
        invalidMessage,
        inputClassName = "",
    } = options;

    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [displayValue, setDisplayValue] = useState<string>(value.toString());

    useEffect(() => {
        setDisplayValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Update the display value and call the onChange handler
        setDisplayValue(newValue);
        onChange(e);

        // Validate the input value if a validate function is provided
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
                type="number"
                value={displayValue}
                onChange={handleChange}
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${inputClassName}`}
                placeholder={placeholder}
            />
            {validate && isValid === false && invalidMessage && (
                <p className="mt-1 text-sm text-red-500">{invalidMessage}</p>
            )}
            {validate &&
                isValid === true &&
                value !== undefined &&
                validMessage && (
                    <p className="mt-1 text-sm text-green-500">
                        {validMessage}
                    </p>
                )}
        </div>
    );
}

export default NumberInput;
