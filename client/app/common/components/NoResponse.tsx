"use client";
import React from "react";
// import ReloadButton from "./ReloadButton";

interface NoResponseProps {
    message?: string;
}

const NoResponse: React.FC<NoResponseProps> = ({
    message = "Something went wrong!",
}) => {
    return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen">
            <p className="text-center text-white">
                Server is not running <br /> or something went wrong! {message}
            </p>
            {/* <ReloadButton text="Retry" /> */}
            <div>
                <button
                    onClick={() => window.location.reload()}
                    className="py-2 px-4 bg-gray-700 hover:bg-green-700 rounded-full"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};

export default NoResponse;
