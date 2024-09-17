import React from "react";

interface LoadingProps {
    size?: string; // TailwindCSS size class, e.g., 'w-16 h-16'
}

const SpinningCircleLoading: React.FC<LoadingProps> = ({
    size = "w-16 h-16",
}) => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative">
                <div
                    className={`absolute ${size} border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin`}
                ></div>
                <div
                    className={`absolute ${size} border-4 border-transparent border-t-blue-500 border-solid rounded-full animate-spin`}
                    style={{ animationDelay: "-0.5s" }}
                ></div>
            </div>
        </div>
    );
};

export default SpinningCircleLoading;
