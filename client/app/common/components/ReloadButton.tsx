"use client";
import React from "react";

export default function ReloadButton({ text }: { text: string }) {
    return (
        <div>
            <button
                onClick={() => window.location.reload()}
                className="py-2 px-4 bg-gray-700 hover:bg-green-700 rounded-full"
            >
                {text}
            </button>
        </div>
    );
}
