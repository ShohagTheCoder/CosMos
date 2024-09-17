"use client";
import React, { useState } from "react";
import TextInput from "../elements/inputs/TextInput";
import apiClient from "../utils/apiClient";
import Notification from "../elements/notification/Notification";
import useNotification from "../hooks/useNotification";
import TextArea from "../elements/inputs/TextArea";

function Brands() {
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const { notification, success, error } = useNotification();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/brands", {
                name: brandName,
                description: brandDescription,
            });

            success("Brand created successfully");
            console.log("Brand created successfully:", response.data);
            // Optionally, handle successful response (e.g., redirect or show a success message)
        } catch (e) {
            error("Faild to create brand");
            console.error("Error creating brand:", e);
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
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        className="justify-center"
                    />
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

export default Brands;
