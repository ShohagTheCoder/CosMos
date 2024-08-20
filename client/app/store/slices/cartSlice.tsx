import getCartProductsTotalPrice from "@/app/functions/getCartProductsTotalPrice";
import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getProductSubTotalPrice from "@/app/functions/getProductSubTotalPrice";
import getProductPrice from "@/app/functions/getProductSubTotalPrice";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { Customer } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
    products: Record<string, ProductWithID>;
    totalPrice: number;
    customer?: Customer;
    activeProduct?: string;
    selectedProductIndex: number;
}

const initialState: CartState = {
    products: {},
    totalPrice: 0,
    selectedProductIndex: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state: CartState, action: PayloadAction<ProductWithID>) => {
            let product = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                let existingQuantity = existingProduct.quantity || 0;
                const updatedProduct = {
                    ...existingProduct,
                    quantity: existingQuantity + product.quantity,
                };
                state.products = {
                    ...state.products,
                    [product._id]: updatedProduct,
                };
            } else {
                product.unit = product.measurements[0].unit;
                product.quantity = product.measurements[0].value;
                state.products = { ...state.products, [product._id]: product };
                state.activeProduct = product._id;
            }

            state.totalPrice += product.subTotal;
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            const removedProduct = state.products[productId];

            if (removedProduct) {
                const { [productId]: removed, ...rest } = state.products;
                state.products = rest;
                state.totalPrice -= removedProduct.subTotal;
                state.activeProduct = Object.keys(state.products)[
                    Object.keys(state.products).length - 1
                ];
            }
        },

        selectNexProduct: (state, action) => {
            if (state.selectedProductIndex == action.payload) {
                state.selectedProductIndex = 0;
            } else {
                state.selectedProductIndex += 1;
            }
        },

        selectPreviousProduct: (state, action) => {
            if (state.selectedProductIndex == 0) {
                state.selectedProductIndex = action.payload;
            } else {
                state.selectedProductIndex -= 1;
            }
        },

        resetSelectedProductIndex: (state) => {
            state.selectedProductIndex = 0;
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ key: string; quantity: number }>
        ) => {
            let { key, quantity } = action.payload;
            if (!quantity) quantity = 1;
            if (quantity > 1000) return;
            const product = state.products[key];

            if (product) {
                const updatedProduct = getUpdatedProduct(
                    product,
                    quantity - product.quantity,
                    null
                );
                state.products = {
                    ...state.products,
                    [key]: updatedProduct,
                };
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },
        incrementQuantity: (state: CartState, action) => {
            let productId = action.payload;
            if (!productId) {
                productId = state.activeProduct;
            }
            const product = state.products[productId];

            if (product) {
                const updatedProduct = getUpdatedProduct(product, 1, null);
                state.products[productId] = updatedProduct;
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },
        decrementQuantity: (state, action) => {
            let productId = action.payload;
            if (!productId) {
                productId = state.activeProduct;
            }
            const product = state.products[productId];

            if (product && product.quantity > 1) {
                const updatedProduct = getUpdatedProduct(product, -1, null);
                state.products = {
                    ...state.products,
                    [productId]: updatedProduct,
                };
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },

        updateUnit: (
            state: CartState,
            action: PayloadAction<{ key: string; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            const product = state.products[key];

            if (product) {
                const updatedProduct = getUpdatedProduct(product, null, unit);
                state.products = {
                    ...state.products,
                    [key]: updatedProduct,
                };
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },

        shiftMeasurementTo: (
            state: CartState,
            action: PayloadAction<number>
        ) => {
            const id =
                state.activeProduct || Object.values(state.products)[0]._id;
            const product = state.products[id];

            if (product) {
                const measurements = product.measurements;
                const length = product.measurements.length;

                let currentMeasurementIndex = getCurrentMeasurement(product);
                let measurement;
                if (length <= currentMeasurementIndex + action.payload) {
                    measurement = measurements[0];
                } else if (currentMeasurementIndex + action.payload < 0) {
                    measurement = measurements[length - 1];
                } else {
                    measurement =
                        measurements[currentMeasurementIndex + action.payload];
                }
                const updatedProduct = getUpdatedProduct(
                    product,
                    measurement.value - product.quantity,
                    measurement.unit
                );

                state.products = {
                    ...state.products,
                    [id]: updatedProduct,
                };
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },

        clearCart: (state) => {
            state.products = {};
            state.totalPrice = 0;
        },

        addCustomer: (state, action) => {
            state.customer = action.payload;
        },

        changeActiveProduct: (state, action) => {
            state.activeProduct = action.payload;
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
    changeActiveProduct,
    selectPreviousProduct,
    selectNexProduct,
    resetSelectedProductIndex,
    updateUnit,
    shiftMeasurementTo,
} = cartSlice.actions;
export default cartSlice.reducer;
