import { NotificationType } from "@/app/elements/notification/Notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

export interface NotificationState {
    id: string; // Unique identifier for each notification
    title: string; // Notification title
    message: string; // Notification message
    type: NotificationType; // Notification type
    timestamp: number; // Timestamp for when the notification was created
}

const initialState: NotificationState[] = [];

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        addNotification: (
            state,
            action: PayloadAction<Omit<NotificationState, "id" | "timestamp">>
        ) => {
            state.push({
                ...action.payload,
                id: uuidv4(), // Automatically generate a unique ID
                timestamp: Date.now(), // Automatically add the current timestamp
            });
        },
        clearNotifications: () => {
            return [];
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            return state.filter((n) => n.id !== action.payload);
        },
    },
});

export const { addNotification, clearNotifications, removeNotification } =
    notificationsSlice.actions;
export default notificationsSlice.reducer;
