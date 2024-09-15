"use client";
import React, { useEffect, useRef } from "react";

const ExamplePage: React.FC = () => {
    // Initialize the ref with HTMLInputElement type
    const command = useRef<HTMLInputElement | null>(null);
    console.log("Render");

    useEffect(() => {
        // Access the value of the input when the component mounts
        console.log(command.current?.value);
    }, []); // Empty dependency array ensures it runs once on mount

    return (
        <div className="flex justify-center items-center h-screen">
            <div>
                <input ref={command} className="bg-gray-800" />
            </div>
            <button
                onClick={() => {
                    console.log(command.current?.value);
                }}
            >
                Click
            </button>
        </div>
    );
};

export default ExamplePage;
