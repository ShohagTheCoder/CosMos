import React from "react";
import Notification from "./Notification"; // Import the Notification component
import { NotificationProps } from "@/app/hooks/useNotifications";

interface NotificationListProps {
    notifications: NotificationProps[]; // Array of notifications received from useNotification hook
    className?: string; // Optional className for styling the list
}

const NotificationList: React.FC<NotificationListProps> = ({
    notifications,
    className = "", // Default to an empty string if not provided
}) => {
    return (
        <div className={className}>
            {notifications.map((notification) => (
                <Notification key={notification.id} {...notification} />
            ))}
        </div>
    );
};

export default NotificationList;
