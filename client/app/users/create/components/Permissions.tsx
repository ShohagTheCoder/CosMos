import apiCall from "@/app/common/apiCall";
import Notification from "@/app/elements/notification/Notification";
import useNotification from "@/app/hooks/useNotification";
import apiClient from "@/app/utils/apiClient";
import React, { FormEvent, useState } from "react";

export default function Permissions({
    handleCheckboxChange,
    form,
    setForm,
}: any) {
    const [loading, setLoading] = useState(false);
    const { notification, notifyError, notifySuccess, clearNotifications } =
        useNotification();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        apiCall
            .post("/users", form)
            .success((data, message) => {
                notifySuccess(message);
            })
            .error((error) => {
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
                    <div key={permission} className="flex items-center">
                        <input
                            type="checkbox"
                            id={permission}
                            checked={form.permissions[permission]}
                            onChange={(e) =>
                                handleCheckboxChange(
                                    permission,
                                    e.target.checked
                                )
                            }
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label
                            htmlFor={permission}
                            className="ml-2 text-sm capitalize"
                        >
                            {permission}
                        </label>
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
