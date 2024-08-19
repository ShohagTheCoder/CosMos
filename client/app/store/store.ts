import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        product: productReducer,
    },
});

// redux/store.ts
export type RootState = ReturnType<typeof store.getState>;
