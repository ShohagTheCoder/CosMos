"use client";

import React from "react";

interface ButtonProps {
    onClick?: () => void;
    onDoubleClick?: () => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "tertiary";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "medium",
    disabled = false,
    className = "",
    onClick,
    onDoubleClick,
}) => {
    const baseStyles = "rounded-lg font-medium focus:outline-none";
    const variantStyles = {
        primary:
            "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400",
        secondary:
            "bg-gray-700 text-white hover:bg-gray-800 disabled:bg-gray-600",
        tertiary:
            "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400",
    };
    const sizeStyles = {
        small: "py-1 px-2 text-sm",
        medium: "py-2 px-4 text-base",
        large: "py-3 px-6 text-lg",
    };

    return (
        <button
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            className={`${baseStyles} ${variantStyles[variant]} ${
                sizeStyles[size]
            } ${disabled ? "cursor-not-allowed" : ""} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
