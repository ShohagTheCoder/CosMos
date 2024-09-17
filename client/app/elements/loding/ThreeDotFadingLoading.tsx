import React from "react";

interface LoadingProps {
    size?: string; // TailwindCSS size class, e.g., 'w-6 h-6'
}

const ThreeDotFadingLoading: React.FC<LoadingProps> = ({
    size = "w-4 h-4",
}) => {
    return (
        <div className="flex items-center justify-center h-full space-x-2">
            <div
                className={`${size} bg-blue-500 rounded-full animate-pulse`}
            ></div>
            <div
                className={`${size} bg-blue-500 rounded-full animate-pulse delay-150`}
            ></div>
            <div
                className={`${size} bg-blue-500 rounded-full animate-pulse delay-300`}
            ></div>
        </div>
    );
};

export default ThreeDotFadingLoading;
