import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    className?: string; // Optional prop for additional custom classes
}

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    label,
    className,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <div
            className={`flex items-center justify-between gap-3 mb-3 py-2 px-4 ${className}`}
        >
            {label ? <p className="inline-block">{label}</p> : ""}
            <div className="h-full flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={checked}
                        onChange={handleChange}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
    );
};

export default Switch;
