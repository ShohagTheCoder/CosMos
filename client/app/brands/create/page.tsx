"use client";
import TextArea from "@/app/elements/inputs/TextArea";
import TextInput from "@/app/elements/inputs/TextInput";
import NotificationList from "@/app/elements/notification/NotificationList";
import useNotifications from "@/app/hooks/useNotifications";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

export default function CreateBrand() {
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const { notifications, notifySuccess, notifyError } = useNotifications();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/brands", {
                name: brandName,
                description: brandDescription,
            });

            notifySuccess("Brand created successfully");
            console.log("Brand created successfully : ", response.data);
            // Optionally, handle successful response (e.g., redirect or show a success message)
        } catch (error) {
            notifyError(error, "Faild to create brand");
            console.error("Error creating brand : ", e);
            // Optionally, handle error (e.g., show an error message to the user)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Create Brand
                </h2>
                <div>
                    <div className="mb-4">
                        <TextInput
                            className="mb-3"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            options={{
                                label: "Brand Name",
                                validate: (value) => value.length >= 6,
                                validMessage: "Brand name looks good!",
                                invalidMessage:
                                    "Please enter a valid brand name (min 6 chars)",
                                placeholder: "Ex: Nike",
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <TextArea
                            value={brandDescription}
                            onChange={(e) =>
                                setBrandDescription(e.target.value)
                            }
                            options={{
                                label: "Brand Description",
                                placeholder: "Enter brand description",
                                validate: (value) => value.length >= 10,
                                validMessage: "Description looks good!",
                                invalidMessage:
                                    "Please enter a valid description (min 10 chars)",
                                rows: 2,
                                textAreaClassName: "resize-none",
                            }}
                            className="mb-4"
                        />
                    </div>

                    <NotificationList notifications={notifications} />

                    <button
                        onDoubleClick={handleSubmit}
                        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    >
                        Create Brand
                    </button>
                </div>
            </div>
        </div>
    );
}
