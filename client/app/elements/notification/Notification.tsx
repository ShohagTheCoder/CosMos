import { NotificationProps } from "@/app/hooks/useNotifications";
import React from "react";

const notificationStyles: Record<string, string> = {
    success: "bg-green-600 text-white border-green-700",
    error: "bg-red-600 text-white border-red-700",
    info: "bg-blue-600 text-white border-blue-700",
    warn: "bg-yellow-600 text-white border-yellow-700",
    none: "hidden",
};

// Single notification component to render individual notifications
const Notification: React.FC<NotificationProps> = ({
    id,
    type = "none",
    title = "", // Default title if not provided
    message = "", // Default message if not provided
    clearNotification,
}) => {
    const style = notificationStyles[type] || "";

    return (
        <div className={`fixed p-4 top-0 left-0 w-screen rounded-md`}>
            <div
                className={`${style} flex justify-between items-center w-[400px] mx-auto bg-gray-600 p-3 rounded-md`}
            >
                <div className="flex">
                    <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {type === "success" && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        )}
                        {type === "error" && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        )}
                        {type === "info" && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m0-4h2v2h-2m-1 8h4v2H6v-2h2zm4 0h4v2h-4v-2z"
                            />
                        )}
                        {type === "warn" && (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v4m0 4h.01M5.05 4.95l13.9 13.9M19.95 4.95L6.05 18.85"
                            />
                        )}
                    </svg>
                    <div>
                        {title && <strong>{title}</strong>}
                        {message && <p>{message}</p>}
                    </div>
                </div>
                <button
                    className="ml-4 text-white px-2 py-1 rounded-md hover:bg-red-800"
                    onClick={() => clearNotification(id)}
                >
                    x
                </button>
            </div>
        </div>
    );
};

export default Notification;
