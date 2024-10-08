import Notification from "@/app/elements/notification/Notification";
import useNotification from "@/app/hooks/useNotification";
import apiClient from "@/app/utils/apiClient";
import Switch from "@/app/elements/switch/Switch"; // Adjust the import path as needed
import React, { FormEvent, useState } from "react";

export default function Permissions({ handleCheckboxChange, form }: any) {
    const [loading, setLoading] = useState(false);
    const { notification, notifyError, notifySuccess } = useNotification();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        apiClient
            .post("/users", form)
            .then((res) => {
                notifySuccess(res.data.message);
            })
            .catch((error) => {
                console.log(error);
                notifyError(error.message);
            })
            .finally(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            });
    };

    return (
        <div className="space-y-2 flex-grow flex flex-col justify-between">
            <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-lg">Permissions</h2>
                {Object.keys(form.permissions).map((permission) => (
                    <div
                        key={permission}
                        className="flex items-center justify-between"
                    >
                        <Switch
                            checked={form.permissions[permission]}
                            onChange={(checked) =>
                                handleCheckboxChange(permission, checked)
                            }
                            className="w-full bg-slate-900 py-3 flex justify-between items-center"
                            label={permission}
                        />
                    </div>
                ))}
                <Notification
                    message={notification.message}
                    type={notification.type}
                />
            </div>
            <button
                onDoubleClick={handleSubmit}
                disabled={loading}
                className="mt-auto w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                {loading ? "Creating..." : "Create User"}
            </button>
        </div>
    );
}
