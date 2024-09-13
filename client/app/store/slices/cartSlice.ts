import getProductsTotalPrice from "@/app/functions/getProductsTotalPrice";
import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import getMeasurementTo from "@/app/functions/getMeasurementTo";
import updateCart from "../functions/updateCart";

export interface CartState {
    [x: string]: any;
    products: Record<string, ProductWithID>;
    totalPrice: number;
    customer?: CustomerWithId;
    activeProduct?: string;
    selectedProductIndex: number;
    due: number;
    paid: number;
    customerAccount: any;
}

const initialState: CartState = {
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
    initialState,
    reducers: {
        addToCart: (state: CartState, action: PayloadAction<ProductWithID>) => {
            let product = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                state.products[product._id] = getUpdatedProduct(
                    existingProduct,
                    existingProduct.quantity + 1,
                    null
                );
            } else {
                state.products[product._id] = getUpdatedProduct(
                    product,
                    product.measurements[0].value,
                    product.measurements[0].unit
                );
            }
            state.activeProduct = product._id;
            return updateCart(state);
        },
        addToCartWith: (
            state: CartState,
            action: PayloadAction<{
                product: ProductWithID;
                quantity: number;
                unit?: string;
            }>
        ) => {
            let { product, quantity, unit } = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                state.products[product._id] = getUpdatedProduct(
                    existingProduct,
                    quantity,
                    unit !== undefined ? unit : null
                );
            } else {
                state.products[product._id] = getUpdatedProduct(
                    product,
                    quantity,
                    unit !== undefined ? unit : product.measurements[0].unit
                );
            }
            state.activeProduct = product._id;
            return updateCart(state);
        },
        removeFromCart: (
            state: CartState,
            action: PayloadAction<string | null>
        ) => {
            let key = action.payload || state.activeProduct;
            if (key) {
                const removed = state.products[key];
                if (removed) {
                    const { [key]: kick, ...rest } = state.products;
                    state.products = rest;
                    state.activeProduct = Object.keys(state.products)[
                        Object.keys(state.products).length - 1
                    ];
                    return updateCart(state);
                }
            }
        },

        selectNexProduct: (state: CartState, action: PayloadAction<number>) => {
            if (state.selectedProductIndex == action.payload) {
                state.selectedProductIndex = 0;
            } else {
                state.selectedProductIndex += 1;
            }
        },

        addCustomerAccount: (
            state: CartState,
            action: PayloadAction<object>
        ) => {
            state.customerAccount = action.payload;
        },

        selectPreviousProduct: (
            state: CartState,
            action: PayloadAction<number>
        ) => {
            if (state.selectedProductIndex == 0) {
                state.selectedProductIndex = action.payload;
            } else {
                state.selectedProductIndex -= 1;
            }
        },

        resetSelectedProductIndex: (state: CartState) => {
            state.selectedProductIndex = 0;
        },

        updatePaid: (state: CartState, action: PayloadAction<number>) => {
            let paid = action.payload;
            if (!paid) {
                paid = 0;
            }
            if (paid < 100000) {
                state.paid = paid;
                state.due = state.totalPrice - paid;
            }
        },
        updateSalePrice: (
            state: CartState,
            action: PayloadAction<{ key: any; amount: number }>
        ) => {
            let { key, amount } = action.payload;
            if (key == null) {
                key = state.activeProduct;
            }
            const product = state.products[key];

            if (product) {
                product.decreasePrice += amount;
                state.products[key] = getUpdatedProduct(product, null, null);
            }
        },
        resetSalePrice: (state: CartState, action: PayloadAction<any>) => {
            let key = action.payload;
            if (key == null) {
                key = state.activeProduct;
            }
            const product = state.products[key];

            if (product && product.decreasePrice != 0) {
                product.decreasePrice = 0;
                state.products[key] = getUpdatedProduct(product, null, null);
            }
        },
        updateQuantity: (
            state: CartState,
            action: PayloadAction<{ key: any; quantity: number }>
        ) => {
            let { key, quantity } = action.payload;
            if (key == null) {
                key = state.activeProduct;
            }
            const product = state.products[key];

            if (product && product.quantity >= 0) {
                state.products[key] = getUpdatedProduct(
                    product,
                    quantity,
                    null
                );

                return updateCart(state);
            }
        },
        incrementQuantity: (
            state: CartState,
            action: PayloadAction<string | null>
        ) => {
            let key = action.payload || state.activeProduct;
            if (key) {
                const product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        product.quantity + 1,
                        null
                    );
                    return updateCart(state);
                }
            }
        },
        decrementQuantity: (
            state: CartState,
            action: PayloadAction<string | null>
        ) => {
            const key = action.payload || state.activeProduct;
            if (key) {
                // Find the product
                const product = state.products[key];

                // If product exist
                if (product && product.quantity > 0) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        product.quantity - 1,
                        null
                    );
                    return updateCart(state);
                }
            }
        },

        updateUnit: (
            state: CartState,
            action: PayloadAction<{
                key: string | null | undefined;
                unit: string;
            }>
        ) => {
            let { key, unit } = action.payload;
            if (!key) key = state.activeProduct;
            if (key) {
                const product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        null,
                        unit
                    );
                    return updateCart(state);
                }
            }
        },

        shiftMeasurementTo: (
            state: CartState,
            action: PayloadAction<number>
        ) => {
            if (!state.activeProduct) return state;
            const key = state.activeProduct;
            const product = state.products[key];

            if (product) {
                const measurement = getMeasurementTo(product, action.payload);
                state.products[key] = getUpdatedProduct(
                    product,
                    measurement.value,
                    measurement.unit
                );

                // Update related fields also
                return updateCart(state);
            }
        },

        clearCart: (state) => {
            state.products = {};
            state.totalPrice = 0;
            state.due = state.totalPrice - state.paid;
        },

        addCustomer: (state, action) => {
            state.customer = action.payload;
            state.paid = state.totalPrice;
        },

        changeActiveProduct: (state, action) => {
            state.activeProduct = action.payload;
        },

        addDiscount: (
            state: CartState,
            action: PayloadAction<{
                key: any;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (!key) key = state.activeProduct;
            if (key && state.products[key]) {
                state.products[key] = getUpdatedProduct(
                    {
                        ...state.products[key],
                        discount: amount,
                    },
                    null,
                    null
                );
                return updateCart(state);
            }
        },
        updateDiscountAmount: (
            state: CartState,
            action: PayloadAction<{
                key: string | null | undefined;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (!key) key = state.activeProduct;

            if (key) {
                let product = state.products[key];
                if (product) {
                    product.discount += amount;
                    state.products[key] = getUpdatedProduct(
                        product,
                        null,
                        null
                    );
                    return updateCart(state);
                }
            }
        },
        addExtraDiscount: (
            state: CartState,
            action: PayloadAction<{
                key: string | null | undefined;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (!key) key = state.activeProduct;

            if (key && state.products[key]) {
                state.products[key] = getUpdatedProduct(
                    {
                        ...state.products[key],
                        extraDiscount: amount,
                    },
                    null,
                    null
                );
                return updateCart(state);
            }
        },
        updateExtraDiscountAmount: (
            state: CartState,
            action: PayloadAction<{
                key: string | null | undefined;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (!key) key = state.activeProduct;

            if (key) {
                let product = state.products[key];
                if (product) {
                    product.extraDiscount += amount;
                    state.products[key] = getUpdatedProduct(
                        product,
                        null,
                        null
                    );
                    return updateCart(state);
                }
            }
        },
        setUser: (state: CartState, action: PayloadAction<any>) => {
            if (action.payload._id) {
                state.user = action.payload;
            }
        },
    },
});

export const {
    addToCart,
    addToCartWith,
    removeFromCart,
    updatePaid,
    updateQuantity,
    updateDiscountAmount,
    updateExtraDiscountAmount,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    addCustomer,
    changeActiveProduct,
    selectPreviousProduct,
    selectNexProduct,
    resetSelectedProductIndex,
    updateUnit,
    addCustomerAccount,
    shiftMeasurementTo,
    addDiscount,
    addExtraDiscount,
    setUser,
    updateSalePrice,
    resetSalePrice,
} = cartSlice.actions;
export default cartSlice.reducer;
