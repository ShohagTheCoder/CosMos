import React, { useState, useEffect } from "react";

interface SelectInputProps {
    value: string | number; // Allows for string or number values
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    options?: {
        validate?: (value: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        inputClassName?: string;
        options: Array<{ value: string | number; label: string }>; // Options for the select input
    };
}

function SelectInput({
    value,
    onChange,
    className,
    options = {
        options: [], // Provide a default empty array for options
    },
}: SelectInputProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Select an option...",
        validMessage,
        invalidMessage,
        inputClassName = "",
        options: selectOptions = [], // Options for the select element
    } = options;

    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false); // New state to track user interaction

    useEffect(() => {
        // Validate the initial value when the component mounts or value changes
        if (validate && hasInteracted) {
            setIsValid(validate(value.toString()));
        } else {
            setIsValid(null);
        }
    }, [value, validate, hasInteracted]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        onChange(e);

        // Validate the selected value if a validate function is provided
        if (validate) {
            setIsValid(validate(newValue));
        } else {
            setIsValid(null);
        }

        setHasInteracted(true); // Mark as interacted
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block mb-2 text-gray-400">{label}</label>
            )}
            <select
                value={value}
                onChange={handleChange}
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${inputClassName}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {validate &&
                isValid === false &&
                hasInteracted &&
                invalidMessage && (
                    <p className="mt-1 text-sm text-red-500">
                        {invalidMessage}
                    </p>
                )}
            {validate && isValid === true && hasInteracted && validMessage && (
                <p className="mt-1 text-sm text-green-500">{validMessage}</p>
            )}
        </div>
    );
}

export default SelectInput;
