import React from "react";

interface LoadingProps {
    size?: string; // Size as a TailwindCSS class, e.g., 'w-8 h-8'
}

export default function PulseLoading({ size = "w-5 h-5" }) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative flex items-center justify-center">
                <div
                    className={`absolute ${size} bg-blue-500 rounded-full animate-ping`}
                ></div>
                <div
                    className={`absolute ${size} bg-blue-500 rounded-full`}
                ></div>
            </div>
        </div>
    );
}
