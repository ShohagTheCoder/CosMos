import React, { useState, useEffect, useRef } from "react";

interface SearchableSelectInputProps {
    value: string | number;
    onChange: (value: string | number | undefined) => void; // Accept undefined if no selection
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

function SearchableSelectInput({
    value,
    onChange,
    className,
    options = {
        options: [],
    },
}: SearchableSelectInputProps) {
    const {
        validate,
        label = "Label",
        placeholder = "Search or select...",
        validMessage,
        invalidMessage,
        inputClassName = "",
        options: selectOptions = [],
    } = options;

    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>(""); // For search input
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // For controlling dropdown visibility
    const [filteredOptions, setFilteredOptions] = useState(selectOptions);

    const inputRef = useRef<HTMLDivElement>(null);

    // Effect to filter options based on the search term
    useEffect(() => {
        setFilteredOptions(
            selectOptions.filter((option) =>
                option.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, selectOptions]);

    // Effect to handle outside click and close dropdown
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Handle pressing "Enter" key
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (filteredOptions.length > 0) {
                // Select the first option if available
                handleSelectOption(filteredOptions[0].value);
            } else {
                // If no options are available, pass undefined
                onChange(undefined);
            }
            setIsDropdownOpen(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };

    const handleSelectOption = (optionValue: string | number) => {
        setSearchTerm(
            selectOptions.find((opt) => opt.value === optionValue)?.label || ""
        );
        onChange(optionValue);
        setIsDropdownOpen(false);
        setHasInteracted(true);

        // Validate if a validation function is provided
        if (validate) {
            setIsValid(validate(optionValue.toString()));
        } else {
            setIsValid(null);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <div className={`relative ${className}`} ref={inputRef}>
            {label && (
                <label className="block mb-2 text-gray-400">{label}</label>
            )}

            {/* Input field (search and selected value) */}
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onClick={toggleDropdown}
                onKeyDown={handleKeyPress} // Listen for Enter key
                placeholder={placeholder}
                className={`block w-full px-4 py-2 text-gray-100 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    isValid === false ? "border-red-600" : "border-gray-600"
                } ${inputClassName}`}
            />

            {/* Dropdown list */}
            {isDropdownOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-md max-h-48 overflow-y-auto mt-1">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelectOption(option.value)}
                            className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}

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

export default SearchableSelectInput;
