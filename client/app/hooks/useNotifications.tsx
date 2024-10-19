import { useState, useCallback, useRef } from "react";
import { ERROR, SUCCESS } from "../utils/constants/message";

// Define NotificationType as before
export type NotificationType = "none" | "success" | "error" | "warn" | "info";

export interface NotificationProps {
    id: number; // Unique ID for each notification
    type: NotificationType; // Type of the notification (success, error, etc.)
    title?: string; // Optional title
    message: string; // The message for the notification
    clearNotification: (id: number) => void; // Function to clear notification by ID
}

export default function useNotifications() {
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const timeoutRefs = useRef<{ [key: number]: number | null }>({}); // Changed to `number` for browser
    const idRef = useRef(0); // To generate unique IDs for notifications

    const notifySuccess = useCallback(
        (message: string, timeout: number = 3000) => {
            const id = idRef.current++;
            setNotifications((prev) => [
                ...prev,
                {
                    id,
                    type: SUCCESS,
                    message,
                    clearNotification: () => clearNotification(id),
                },
            ]);
            clearAfterTimeout(id, timeout);
        },
        []
    );

    const notifyError = useCallback(
        (
            errorMessage: any,
            defaultMessage: string = "An unexpected error occurred",
            timeout: number = 3000
        ) => {
            const message =
                typeof errorMessage === "string"
                    ? errorMessage
                    : errorMessage?.response?.data?.message ||
                      errorMessage?.message ||
                      defaultMessage;

            const id = idRef.current++;
            setNotifications((prev) => [
                ...prev,
                {
                    id,
                    type: ERROR,
                    message,
                    clearNotification: () => clearNotification(id),
                },
            ]);
            clearAfterTimeout(id, timeout);
        },
        []
    );

    const clearNotification = useCallback((id: number) => {
        if (timeoutRefs.current[id]) {
            clearTimeout(timeoutRefs.current[id]!);
            delete timeoutRefs.current[id];
        }
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        Object.keys(timeoutRefs.current).forEach((id) => {
            if (timeoutRefs.current[Number(id)]) {
                clearTimeout(timeoutRefs.current[Number(id)]!);
            }
        });
        timeoutRefs.current = {};
        setNotifications([]);
    }, []);

    const clearAfterTimeout = useCallback(
        (id: number, timeout: number) => {
            if (timeoutRefs.current[id]) {
                clearTimeout(timeoutRefs.current[id]!);
            }

            timeoutRefs.current[id] = window.setTimeout(() => {
                clearNotification(id);
                delete timeoutRefs.current[id]; // Clean up the timeout reference
            }, timeout);
        },
        [clearNotification]
    );

    return {
        notifications, // Now an array of notifications
        notifySuccess,
        notifyError,
        clearNotification,
        clearAllNotifications,
    };
}
