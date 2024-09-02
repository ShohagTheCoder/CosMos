import React from "react";

interface Option {
    label: string;
    value: string;
}

interface SingleSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    label: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
    value,
    onChange,
    options,
    label,
}) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-200 font-medium mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SingleSelect;
