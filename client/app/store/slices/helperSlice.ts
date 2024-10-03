import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartState } from "./cartSlice";
import { StockState } from "./stockSlice";

interface HelperState {
    cartStates: Record<string, CartState>;
    stockStates: Record<string, StockState>;
}

const initialState: HelperState = {
    cartStates: {}, // Correct spelling and typing
    stockStates: {}, // Correct spelling and typing
};

const helperSlice = createSlice({
    initialState,
    name: "helper",
    reducers: {
        updateHelperField: (
            state: HelperState, // Use HelperState type here
            action: PayloadAction<{
                field: keyof HelperState;
                value: any;
            }>
        ) => {
            const { field, value } = action.payload;
            if (field in state) {
                (state as any)[field] = value; // You may not need 'as any' anymore since state is typed correctly
            }
        },
    },
});

export const { updateHelperField } = helperSlice.actions;

export default helperSlice.reducer;
