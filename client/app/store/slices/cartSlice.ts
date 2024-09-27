import getMeasurementTo from "@/app/functions/getMeasurementTo";
import getProductNextUnit from "@/app/functions/getProductNextUnit";
import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import updateCart from "../functions/updateCart";

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
                    unit ? unit : undefined
                );
            } else {
                state.products[product._id] = getUpdatedProduct(
                    product,
                    quantity,
                    unit ? unit : product.measurements[0].unit
                );
            }
            state.activeProduct = product._id;
            return updateCart(state);
        },
        removeFromCart: (
            state: CartState,
            action: PayloadAction<string | undefined>
        ) => {
            let key = action.payload || state.activeProduct;
            if (key) {
                const removed = state.products[key];
                if (removed) {
                    // eslint-disable-next-line no-unused-vars
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

        setSalePrice: (
            state: CartState,
            action: PayloadAction<{ key: any; amount: number }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                let product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        { ...product, updatePrice: amount },
                        undefined,
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },
        resetSalePrice: (
            state: CartState,
            action: PayloadAction<string | undefined>
        ) => {
            let key = action.payload || state.activeProduct;
            if (key) {
                const product = state.products[key];
                if (product && product.updatePrice != 0) {
                    state.products[key] = getUpdatedProduct(
                        { ...product, updatePrice: 0 },
                        undefined,
                        undefined
                    );
                }
            }
        },

        incrementQuantity: (
            state: CartState,
            action: PayloadAction<string | undefined>
        ) => {
            let key = action.payload || state.activeProduct;
            if (key) {
                const product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        product.quantity + 1,
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },

        shiftUnitTo: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined;
                value: number;
            }>
        ) => {
            let { key = state.activeProduct, value } = action.payload;
            if (key) {
                const product = state.products[key];
                if (product) {
                    let unit = getProductNextUnit(value, product);

                    state.products[key] = getUpdatedProduct(
                        product,
                        undefined,
                        unit
                    );
                    return updateCart(state);
                }
            }
        },
        setPriceToWithDiscount: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined;
                amount: number;
            }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                const product = state.products[key];
                if (product && amount < product.price) {
                    if (amount < product.price / 2) {
                        product.discount = amount;
                        state.products[key] = getUpdatedProduct(
                            product,
                            undefined,
                            undefined
                        );
                    } else {
                        product.discount = product.price - amount;
                        state.products[key] = getUpdatedProduct(
                            product,
                            undefined,
                            undefined
                        );
                    }
                    return updateCart(state);
                }
            }
        },

        shiftMeasurementTo: (
            state: CartState,
            action: PayloadAction<number>
        ) => {
            const key = state.activeProduct;
            if (key) {
                const product = state.products[key];
                if (product) {
                    const measurement = getMeasurementTo(
                        product,
                        action.payload
                    );
                    state.products[key] = getUpdatedProduct(
                        product,
                        measurement.value,
                        measurement.unit
                    );

                    // Update related fields also
                    return updateCart(state);
                }
            }
        },

        updateCartState: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const {
    addToCartWith,
    removeFromCart,
    incrementQuantity,
    selectPreviousProduct,
    selectNexProduct,
    updateCartState,
    shiftMeasurementTo,
    resetSalePrice,
    setPriceToWithDiscount,
    setSalePrice,
    shiftUnitTo,
} = cartSlice.actions;
export default cartSlice.reducer;
