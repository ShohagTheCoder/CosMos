import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
    products: Record<string, ProductWithID>;
    totalPrice: number;
    customer?: CustomerWithId;
    activeProduct?: string;
    selectedProductIndex: number;
    due: number;
    paid: number;
    user?: any;
    customerAccount: any;
}

export const initialCartState: CartState = {
    selectedProductIndex: 0,
    products: {},
    totalPrice: 0,
    paid: 0,
    due: 0,
    customerAccount: {
        balance: 0,
    },
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        updateCartState: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateCartState } = cartSlice.actions;
export default cartSlice.reducer;
