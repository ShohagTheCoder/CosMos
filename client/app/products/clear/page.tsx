"use client";
import NotificationList from "@/app/elements/notification/NotificationList";
import Notification from "@/app/elements/notification/NotificationList";
import useNotifications from "@/app/hooks/useNotifications";
import useNotification from "@/app/hooks/useNotifications";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

export default function ClearProductsPage() {
    const [password, setPassword] = useState("");
    const { notifications, notifyError, notifySuccess } = useNotifications();

    function handleClear() {
        if (password === "clear") {
            apiClient
                .delete("/products/clearAll")
                .then((res) => {
                    notifySuccess(res.data.message);
                })
                .catch((error) => {
                    notifyError(error.message);
                });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="p-6 rounded-lg shadow-lg bg-gray-800 w-full max-w-sm">
                <NotificationList notifications={notifications} />
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
