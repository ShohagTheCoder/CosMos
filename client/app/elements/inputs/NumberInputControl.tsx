import React from "react";

interface NumberInputControlProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    buttonClassName?: string;
    inputClassName?: string;
}

const NumberInputControl: React.FC<NumberInputControlProps> = ({
    value,
    onChange,
    className = "",
    buttonClassName = "",
    inputClassName = "",
}) => {
    const handleDecrement = () => {
        onChange(value - 1);
    };

    const handleIncrement = () => {
        onChange(value + 1);
    };

    return (
        <div className={`flex items-center ${className}`}>
            <button
                className={`bg-gray-700 text-white rounded-l w-8 h-8 ${buttonClassName}`}
                onClick={handleDecrement}
            >
                -
            </button>
            <input
                type="number"
                step="any" // Allows decimal input
                className={`h-8 bg-black w-10 text-white text-center outline-none border-none no-spin ${inputClassName}`}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            />
            <button
                className={`bg-gray-700 text-white rounded-r w-8 h-8 ${buttonClassName}`}
                onClick={handleIncrement}
            >
                +
            </button>
        </div>
    );
};

export default NumberInputControl;
