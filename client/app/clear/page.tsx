"use client";
import React, { useState } from "react";
import apiCall from "../common/apiCall";
import useNotification from "../hooks/useNotification";
import Notification from "../elements/notification/Notification";

export default function ClearPage() {
    const [password, setPassword] = useState("");
    const { notification, notifyError, notifySuccess } = useNotification();

    function handleClear() {
        if (password === "clear") {
            apiCall
                .get("/clear")
                .success((data, message) => {
                    notifySuccess(message);
                })
                .error((error) => {
                    notifyError(error.message);
                });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="p-6 rounded-lg shadow-lg bg-gray-800 w-full max-w-sm">
                <Notification
                    message={notification.message}
                    type={notification.type}
                    className="mb-3"
                />
                <h1 className="text-xl font-semibold mb-4 text-gray-200">
                    Clear Data
                </h1>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to proceed"
                        className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onDoubleClick={handleClear}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}