import { useState, useCallback, useRef } from "react";
import { ERROR, NONE, SUCCESS } from "../utils/constants/message";

export interface NotificationProps {
    type: string;
    message: string;
}

const useNotification = () => {
    const [notification, setNotification] = useState<NotificationProps>({
        type: NONE,
        message: "",
    });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const notifySuccess = useCallback(
        (message: string, timeout: number = 3000) => {
            setNotification({ type: SUCCESS, message });
            clearAfterTimeout(timeout);
        },
        []
    );

    const notifyError = useCallback(
        (
            errorMessage: any,
            defaultMessage: string = "An unexpected error occurred",
            timeout: number = 3000
        ) => {
            // Simplified error message extraction
            const message =
                typeof errorMessage === "string"
                    ? errorMessage
                    : errorMessage?.response?.data?.message ||
                      errorMessage?.message ||
                      defaultMessage;

            setNotification({ type: ERROR, message });
            clearAfterTimeout(timeout);
        },
        []
    );

    const clearNotifications = useCallback(() => {
        setNotification({ type: NONE, message: "" });
    }, []);

    const clearAfterTimeout = useCallback(
        (timeout: number) => {
            // Clear any existing timeout to prevent multiple timeouts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                clearNotifications();
            }, timeout);
        },
        [clearNotifications]
    );

    return { notification, notifySuccess, notifyError, clearNotifications };
};

export default useNotification;
