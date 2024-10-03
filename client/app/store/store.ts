import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import stockReducer from "./slices/stockSlice";
import notificationsReducer from "./slices/notificationsSlice";
import helperReducer from "./slices/helperSlice";

export const store = configureStore({
    reducer: {
        product: productReducer,
        cart: cartReducer,
        stock: stockReducer,
        notifications: notificationsReducer,
        helper: helperReducer,
    },
});

// redux/store.ts
export type RootState = ReturnType<typeof store.getState>;
