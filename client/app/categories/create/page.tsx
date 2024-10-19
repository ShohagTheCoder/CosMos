"use client";
import TextArea from "@/app/elements/inputs/TextArea";
import TextInput from "@/app/elements/inputs/TextInput";
import NotificationList from "@/app/elements/notification/NotificationList";
import useNotifications from "@/app/hooks/useNotifications";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

function CreateCategory() {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const { notifications, notifyError, notifySuccess } = useNotifications();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await apiClient.post("/categories", {
                name: categoryName,
                description: categoryDescription,
            });

            notifySuccess("Category created successfully");
            console.log("Category created successfully:", response.data);
            // Optionally, handle successful response (e.g., redirect or show a success message)
        } catch (err: any) {
            // Show the error message using the notification hook
            notifyError(err, "Faild to create category");
            console.error("Error creating category:", e);
            // Optionally, handle error (e.g., show an error message to the user)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Create Category
                </h2>
                <div>
                    <div className="mb-4">
                        <TextInput
                            className="mb-3"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            options={{
                                label: "Category Name",
                                validate: (value) => value.length >= 3,
                                validMessage: "Category name looks good!",
                                invalidMessage:
                                    "Please enter a valid category name (min 3 chars)",
                                placeholder: "Ex: Electronics",
                            }}
                        />
                    </div>
                    <div className="mb-4">
                        <TextArea
                            value={categoryDescription}
                            onChange={(e) =>
                                setCategoryDescription(e.target.value)
                            }
                            options={{
                                label: "Category Description",
                                placeholder: "Enter category description",
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
                        Create Category
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;
