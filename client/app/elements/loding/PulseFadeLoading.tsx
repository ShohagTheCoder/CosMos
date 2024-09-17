import React from "react";

interface LoadingProps {
    size?: string; // TailwindCSS size class, e.g., 'w-16 h-16'
}

const PulseFadeLoading: React.FC<LoadingProps> = ({ size = "w-16 h-16" }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative flex justify-center items-center">
                {/* Outer animated pulse */}
                <div
                    className={`absolute rounded-full ${size} border-4 border-dashed border-blue-400 animate-ping`}
                ></div>
                {/* Inner static circle */}
                <div
                    className={`absolute rounded-full ${size} border-4 border-blue-500`}
                    style={{ width: "75%", height: "75%" }} // Scale down for the inner circle
                ></div>
            </div>
        </div>
    );
};

export default PulseFadeLoading;
