import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import purchaseReducer from "./slices/purchaseSlice";
import notificationsReducer from "./slices/notificationsSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        product: productReducer,
        purchase: purchaseReducer,
        notifications: notificationsReducer,
    },
});

// redux/store.ts
export type RootState = ReturnType<typeof store.getState>;
