import React from "react";

// Define NotificationType as before
export type NotificationType = "none" | "success" | "error" | "warn" | "info";

export interface NotificationProps {
    type: string; // Required field
    id?: string; // Optional
    title?: string; // Optional
    message: string; // Optional
    timestamp?: number; // Optional
    className?: string; // Optional
}

const notificationStyles: Record<string, string> = {
    success: "bg-green-600 text-white border-green-700",
    error: "bg-red-600 text-white border-red-700",
    info: "bg-blue-600 text-white border-blue-700",
    warn: "bg-yellow-600 text-white border-yellow-700",
    none: "hidden",
};

const Notification: React.FC<NotificationProps> = ({
    type = "none",
    title = "", // Default to empty string if title is not provided
    message = "", // Default to empty string if message is not provided
    timestamp,
    className = "",
}) => {
    const style = notificationStyles[type] || "";

    // Format timestamp if provided, otherwise show an empty string
    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString()
        : "";

    return (
        <div
            className={`flex items-center mt-4 p-4 border rounded-md ${style} ${className}`}
        >
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
                {formattedTime && (
                    <span className="text-sm text-gray-400">
                        {formattedTime}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Notification;
