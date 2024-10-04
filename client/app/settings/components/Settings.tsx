"use client";
import React, { useState } from "react";
import apiClient from "../../utils/apiClient";

// eslint-disable-next-line no-unused-vars
interface Settings {
    _id: string;
    darkMode: boolean;
    enableDue: boolean;
    enableReturn: boolean;
    enableAccounts: boolean;
}

export default function Settings({
    settings: initialSettings,
}: {
    settings: Settings;
}) {
    const [settings, setSettings] = useState<Settings>(initialSettings);

    async function handleUpdateSettings(field: any) {
        try {
            const { data } = await apiClient.patch(
                `settings/${settings._id}`,
                field
            );
            if (initialSettings.darkMode != data.darkMode) {
                window.location.reload();
            }
            setSettings(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-[600px] mx-auto">
            <div className="p-4 mt-10 bg-slate-800 rounded flex flex-col gap-3">
                <p className="text-white text-xl">Settings</p>
                <hr className="border-gray-600 my-2" />
                {/* Theme Selector with Page-Like Preview */}
                <div className="flex justify-between">
                    <p className="me-3">Choose Theme</p>
                    {/* Light Theme Preview Box */}
                    <div className="w-[380px] flex gap-3">
                        <div
                            className={`flex-1 cursor-pointer rounded-lg border-4 transition-all ${
                                !settings.darkMode
                                    ? "border-blue-500"
                                    : "border-transparent"
                            }`}
                            onClick={() =>
                                handleUpdateSettings({ darkMode: false })
                            }
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full bg-gray-200 rounded-md p-3">
                                    <div className="flex justify-between">
                                        <div className="w-10 h-10 bg-gray-400 rounded-lg"></div>
                                        <div className="w-10 h-10 bg-gray-400 rounded-lg"></div>
                                        <div className="w-10 h-10 bg-gray-400 rounded-lg"></div>
                                    </div>
                                    <div className="mt-3 mx-auto h-8 bg-gray-400 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Dark Theme Preview Box */}
                        <div
                            className={`flex-1 cursor-pointer rounded-lg border-4 transition-all ${
                                settings.darkMode
                                    ? "border-blue-500"
                                    : "border-transparent"
                            }`}
                            onClick={() =>
                                handleUpdateSettings({ darkMode: true })
                            }
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-full bg-gray-900 rounded-md p-3">
                                    <div className="flex justify-between">
                                        <div className="w-10 h-10 bg-gray-500 rounded-lg"></div>
                                        <div className="w-10 h-10 bg-gray-500 rounded-lg"></div>
                                        <div className="w-10 h-10 bg-gray-500 rounded-lg"></div>
                                    </div>
                                    <div className="mt-3 mx-auto h-8 bg-gray-500 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
