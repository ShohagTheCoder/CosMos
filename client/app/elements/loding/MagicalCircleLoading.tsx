import React from "react";

interface LoadingProps {
    size?: string; // TailwindCSS size class, e.g., 'w-16 h-16'
}

const MagicalCircleLoading: React.FC<LoadingProps> = ({
    size = "w-16 h-16",
}) => {
    return (
        <div className="flex items-center justify-center h-full">
            <div
                className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-blue-500`}
            ></div>
        </div>
    );
};

export default MagicalCircleLoading;
