import { NotificationType } from "@/app/hooks/useNotifications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Notification state interface
export interface NotificationState {
    id?: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp?: string;
}

const initialState: NotificationState[] = [];

// Create notifications slice
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // Add notification to state
        addNotification: (
            state,
            action: PayloadAction<Omit<NotificationState, "id" | "timestamp">>
        ) => {
            const id = uuidv4();
            const newNotification = {
                ...action.payload,
                id,
                timestamp: new Date().toLocaleTimeString(),
            };
            state.push(newNotification);
        },
        // Remove notification from state
        removeNotification: (state, action: PayloadAction<string>) => {
            return state.filter((n) => n.id !== action.payload);
        },
        // Clear all notifications
        clearNotifications: () => {
            return [];
        },
    },
});

export const { addNotification, clearNotifications, removeNotification } =
    notificationsSlice.actions;
export default notificationsSlice.reducer;
