import { Customer } from "@/app/interfaces/customer.inerface";
import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CartState {
    items: Record<string, CartItem>;
    totalQuantity: number;
    totalPrice: number;
    customer?: Customer;
    activeItem?: string;
}

const initialState: CartState = {
    items: {},
    totalQuantity: 0,
    totalPrice: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items[item._id];

            if (existingItem) {
                const updatedItem = {
                    ...existingItem,
                    quantity: existingItem.quantity + item.quantity,
                };
                state.items = { ...state.items, [item._id]: updatedItem };
            } else {
                state.items = { ...state.items, [item._id]: item };
                state.activeItem = item._id;
            }

            state.totalPrice += item.price * item.quantity;
            state.totalQuantity += item.quantity;
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload;
            const removedItem = state.items[itemId];

            if (removedItem) {
                const { [itemId]: removed, ...rest } = state.items;
                state.items = rest;
                state.totalPrice -= removedItem.price * removedItem.quantity;
                state.totalQuantity -= removedItem.quantity;
                state.activeItem = Object.keys(state.items)[0];
            }
        },
        updateQuantity: (state, action) => {
            const { itemId, newQuantity } = action.payload;
            const item = state.items[itemId];

            if (item) {
                const updatedItem = { ...item, quantity: newQuantity };
                const quantityDifference = newQuantity - item.quantity;
                state.items = { ...state.items, [itemId]: updatedItem };
                state.totalPrice += item.price * quantityDifference;
                state.totalQuantity += quantityDifference;
            }
        },
        incrementQuantity: (state, action) => {
            let itemId = action.payload;
            if (!itemId) {
                itemId = state.activeItem;
            }
            const item = state.items[itemId];

            if (item) {
                const updatedItem = { ...item, quantity: item.quantity + 1 };
                state.items = { ...state.items, [itemId]: updatedItem };
                state.totalPrice += item.price;
                state.totalQuantity++;
            }
        },
        decrementQuantity: (state, action) => {
            let itemId = action.payload;
            if (!itemId) {
                itemId = state.activeItem;
            }
            const item = state.items[itemId];

            if (item && item.quantity > 1) {
                const updatedItem = { ...item, quantity: item.quantity - 1 };
                state.items = { ...state.items, [itemId]: updatedItem };
                state.totalPrice -= item.price;
                state.totalQuantity--;
            }
        },
        clearCart: (state) => {
            state.items = {};
            state.totalQuantity = 0;
            state.totalPrice = 0;
        },

        addCustomer: (state, action) => {
            state.customer = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    addCustomer,
} = cartSlice.actions;
export default cartSlice.reducer;
