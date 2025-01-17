"use client";
import React, { useState } from "react";
import apiClient from "../../utils/apiClient";
import TextInput from "@/app/elements/inputs/TextInput";
import Switch from "@/app/elements/switch/Switch";
import TextArea from "@/app/elements/inputs/TextArea";
import { title } from "process";

// eslint-disable-next-line no-unused-vars
interface Settings {
    _id: string;
    darkMode: boolean;
    enableDue: boolean;
    enableReturn: boolean;
    enableAccounts: boolean;
}

// eslint-disable-next-line no-unused-vars
interface PrintSetting {
    name: string;
    title: string;
    phone: string;
    address: string;
    message: string;
    discount: boolean;
}

export default function Settings({
    settings: initialSettings,
    printSetting: initialPrintSetting,
}: {
    settings: Settings;
    printSetting: PrintSetting;
}) {
    const [settings, setSettings] = useState<Settings>(initialSettings);
    const [printSetting, setPrintSetting] =
        useState<PrintSetting>(initialPrintSetting);

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

    async function handleUpdatePrintSetting() {
        try {
            const { data } = await apiClient.patch(
                `businesses/settings/print`,
                printSetting
            );
            // setPrintSetting(data);
            console.log(data);
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
                <p className="text-white text-xl">Print Settings</p>
                <hr className="border-gray-600 my-2" />
                {/* Theme Selector with Page-Like Preview */}
                {/* Light Theme Preview Box */}
                <div>
                    <TextInput
                        value={printSetting.name}
                        className="flex gap-4 justify-between"
                        options={{
                            label: "Name",
                            inputClassName: "max-w-[300px]",
                        }}
                        onChange={(e) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <TextInput
                        value={printSetting.title}
                        className="flex gap-4 justify-between"
                        options={{
                            label: "Title",
                            inputClassName: "max-w-[300px]",
                        }}
                        onChange={(e) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <TextInput
                        value={printSetting.phone}
                        className="flex gap-4 justify-between"
                        options={{
                            label: "Phone",
                            inputClassName: "max-w-[300px]",
                        }}
                        onChange={(e) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                phone: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <TextInput
                        value={printSetting.address}
                        className="flex gap-4 justify-between"
                        options={{
                            label: "Address",
                            inputClassName: "max-w-[300px]",
                        }}
                        onChange={(e) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                address: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <Switch
                        label="Show Discount"
                        className="m-0 !px-0"
                        checked={printSetting.discount}
                        onChange={(checked) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                discount: checked,
                            }))
                        }
                    />
                </div>
                <div>
                    <TextArea
                        value={printSetting.message}
                        options={{ label: "Message" }}
                        onChange={(e) =>
                            setPrintSetting((prev) => ({
                                ...prev,
                                message: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        onDoubleClick={handleUpdatePrintSetting}
                        className="bg-blue-700 hover:bg-green-800 text-white py-3 px-4 rounded-md"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}
