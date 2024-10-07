import React from "react";
import ReloadButton from "./ReloadButton";

interface ErrorResponseProps {
    message?: any;
}

const ErrorResponse: React.FC<ErrorResponseProps> = ({ message }) => {
    return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen">
            <p className="text-center text-white">
                {message || "Something went wrong"}
            </p>
            <ReloadButton text="Retry" />
        </div>
    );
};

export default ErrorResponse;
