import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

// redux/store.ts
export type RootState = ReturnType<typeof store.getState>;
