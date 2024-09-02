"use client";
import React, { useState } from "react";

interface Settings {
    darkTheme: boolean;
    enableDue: boolean;
    enableReturn: boolean;
    enableAccounts: boolean;
}

function Settings() {
    const [settings, setSettings] = useState<Settings>({
        darkTheme: getSavedBool("darkTheme"),
        enableReturn: getSavedBool("enableReturn"),
        enableAccounts: getSavedBool("enableAccounts"),
        enableDue: getSavedBool("enableDue"),
    });

    // Get saved from localStorage
    function getSavedBool(key: keyof Settings) {
        return localStorage.getItem(key) == "true" ? true : false;
    }

    function handleBooleanChange(key: keyof Settings) {
        const updated = {
            ...settings,
            [key]: !settings[key],
        };
        setSettings(updated);
        let value = settings[key] ? "false" : "true";
        localStorage.setItem(key, value);
    }

    return (
        <main>
            <div className="max-w-[600px] mx-auto my-5 pt-5 ps-6 pe-6 pb-1 bg-slate-800 rounded">
                <p className="text-center text-xl">Settings</p>
                <div className="my-4 border-b-2 border-dashed border-slate-600"></div>
                <div className="flex justify-between mb-4">
                    <p>Dark Theme :</p>
                    <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.darkTheme}
                                onChange={() =>
                                    handleBooleanChange("darkTheme")
                                }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <p>Enable Due :</p>
                    <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.enableDue}
                                onChange={() =>
                                    handleBooleanChange("enableDue")
                                }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <p>Enable Return :</p>
                    <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.enableReturn}
                                onChange={() =>
                                    handleBooleanChange("enableReturn")
                                }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <p>Enable Accounts :</p>
                    <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.enableAccounts}
                                onChange={() =>
                                    handleBooleanChange("enableAccounts")
                                }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Settings;
