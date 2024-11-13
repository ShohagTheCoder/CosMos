import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
    [x: string]: any;
    products: Record<string, ProductWithID>;
    totalPrice: number;
    customer?: CustomerWithId;
    activeProduct?: string;
    selectedProductIndex: number;
    due: number;
    paid: number;
    greeting: string | undefined;
    customerAccount: any;
    cartOnly: boolean;
    totalOnly: boolean;
}

export const initialCartState: CartState = {
    selectedProductIndex: 0,
    products: {},
    customer: undefined,
    greeting: undefined,
    totalPrice: 0,
    paid: 0,
    due: 0,
    customerAccount: {
        balance: 0,
    },
    cartOnly: false,
    totalOnly: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        updateCartState: (state, action) => {
            return action.payload;
        },
    },
});

export const { updateCartState } = cartSlice.actions;
export default cartSlice.reducer;
