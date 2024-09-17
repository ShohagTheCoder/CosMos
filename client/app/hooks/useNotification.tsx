import { useState, useCallback } from "react";
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

    const success = useCallback((message: string, timeout: number = 3000) => {
        setNotification({ type: SUCCESS, message });
        clearAfterTimeout(timeout);
    }, []);

    const error = useCallback((message: string, timeout: number = 3000) => {
        setNotification({ type: ERROR, message });
        clearAfterTimeout(timeout);
    }, []);

    const clear = useCallback(() => {
        setNotification({ type: NONE, message: "" });
    }, []);

    const clearAfterTimeout = useCallback(
        (timeout: number) => {
            setTimeout(() => {
                clear();
            }, timeout);
        },
        [clear]
    );

    return { notification, success, error, clear };
};

export default useNotification;
