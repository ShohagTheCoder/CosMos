import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { removeNotification } from "@/app/store/slices/notificationsSlice";
export type NotificationType = "none" | "success" | "error" | "warn" | "info";

export interface NotificationProps {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    timestamp?: number;
    className?: string;
}

const notificationStyles: Record<NotificationType, string> = {
    success: "bg-green-600 text-white border-green-700",
    error: "bg-red-600 text-white border-red-700",
    info: "bg-blue-600 text-white border-blue-700",
    warn: "bg-yellow-600 text-white border-yellow-700",
    none: "hidden",
};

export default function Notifications() {
    const dispatch = useDispatch();
    const notifications = useSelector(
        (state: RootState) => state.notifications
    );

    return (
        <div className="">
            {notifications.map(({ id, type, title, message, timestamp }) => {
                const style = notificationStyles[type] || "";

                return (
                    <div
                        key={id}
                        className={`mt-3 flex items-center justify-between p-4 mb-4 border rounded-md ${style}`}
                    >
                        <div className="flex items-center">
                            {/* Icon */}
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

                            {/* Notification Content */}
                            <div>
                                {title && <strong>{title}</strong>}
                                {message && <p>{message}</p>}
                                {timestamp && (
                                    <span className="text-sm text-white">
                                        {timestamp}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            className="ml-4 text-white"
                            onClick={() => dispatch(removeNotification(id!))}
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
