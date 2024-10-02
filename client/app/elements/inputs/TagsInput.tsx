import React, { useState } from "react";

interface TagsInputProps {
    value: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (tags: string[]) => void;
    className?: string;
    options?: {
        // eslint-disable-next-line no-unused-vars
        validate?: (tag: string) => boolean;
        label?: string;
        placeholder?: string;
        validMessage?: string;
        invalidMessage?: string;
        duplicateMessage?: string;
        inputClassName?: string;
    };
}

const TagsInput: React.FC<TagsInputProps> = ({
    value,
    onChange,
    className,
    options = {},
}) => {
    const {
        validate,
        label = "Keywords",
        placeholder = "Add a keyword...",
        validMessage,
        invalidMessage,
        duplicateMessage = "Tag already exists!",
        inputClassName = "",
    } = options;

    const [inputValue, setInputValue] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue) {
            const newTag = inputValue.trim();

            if (value.includes(newTag)) {
                setIsDuplicate(true); // Show duplicate error
                return;
            } else {
                setIsDuplicate(false);
            }

            if (validate) {
                const isValidTag = validate(newTag);
                setIsValid(isValidTag);
                if (!isValidTag) return;
            }

            onChange([...value, newTag]); // Add new tag to the array
            setInputValue(""); // Clear input
        } else if (e.key === "Backspace" && !inputValue && value.length) {
            onChange(value.slice(0, value.length - 1)); // Remove the last tag
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={`relative mb-3 ${className}`}>
            {label && (
                <label className="block mb-2 text-gray-400">{label}</label>
            )}
            <div className="flex flex-wrap items-center px-2 py-2 bg-gray-800 border rounded-md border-gray-600 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                {value.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center px-2 py-1 m-1 text-sm text-gray-200 bg-indigo-500 rounded-md"
                    >
                        <p className="text-lg">{tag}</p>
                        <button
                            type="button"
                            className="ml-2 text-white hover:text-gray-300 text-lg"
                            onClick={() => removeTag(index)}
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 px-2 py-1 text-gray-100 bg-gray-800 border-none focus:outline-none ${inputClassName}`}
                    placeholder={placeholder}
                />
            </div>
            {validate && isValid === false && invalidMessage && (
                <p className="mt-1 text-sm text-red-500">{invalidMessage}</p>
            )}
            {validate && isValid === true && validMessage && (
                <p className="mt-1 text-sm text-green-500">{validMessage}</p>
            )}
            {isDuplicate && duplicateMessage && (
                <p className="mt-1 text-sm text-red-500">{duplicateMessage}</p>
            )}
            {value.length === 0 && (
                <p className="mt-2 text-sm text-gray-400">
                    Press Enter to add keywords.
                </p>
            )}
        </div>
    );
};

export default TagsInput;
