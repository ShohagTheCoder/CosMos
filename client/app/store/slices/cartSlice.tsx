import { getUserInServer } from "@/app/actions/sell/functions/apiHandlers";
import getCartProductsTotalPrice from "@/app/functions/getCartProductsTotalPrice";
import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getProductCount from "@/app/functions/getProductCount";
import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { Customer, CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cookies } from "next/headers";

export enum CartActionTypes {
    sell = "sell",
    purchase = "purchase",
    return = "return",
}

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
    action: CartActionTypes;
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
    action: CartActionTypes.sell,
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
                    1,
                    null
                );
            } else {
                product = getUpdatedProduct(
                    product,
                    product.measurements[0].value - 1,
                    product.measurements[0].unit
                );
                state.products = { ...state.products, [product._id]: product };
                state.activeProduct = product._id;
            }

            state.totalPrice += product.subTotal;
            state.due = state.totalPrice - state.paid;
        },
        removeFromCart: (state, action) => {
            let productId = action.payload;
            if (productId == null) productId = state.activeProduct;
            const removedProduct = state.products[productId];

            if (removedProduct) {
                const { [productId]: removed, ...rest } = state.products;
                state.products = rest;
                state.totalPrice -= removedProduct.subTotal;
                state.activeProduct = Object.keys(state.products)[
                    Object.keys(state.products).length - 1
                ];
            }

            state.due = state.totalPrice - state.paid;
        },

        selectNexProduct: (state, action) => {
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

        updateQuantity: (
            state,
            action: PayloadAction<{ key: string; quantity: number }>
        ) => {
            let { key, quantity } = action.payload;
            if (!quantity) quantity = 0;
            if (quantity > 1000) return;
            const product = state.products[key];

            if (product && product.quantity >= 0) {
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
                state.due = state.totalPrice - state.paid;
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
                state.due = state.totalPrice - state.paid;
            }
        },
        decrementQuantity: (state, action) => {
            let productId = action.payload;
            if (!productId) {
                productId = state.activeProduct;
            }
            const product = state.products[productId];

            if (product && product.quantity > 0) {
                const updatedProduct = getUpdatedProduct(product, -1, null);
                state.products = {
                    ...state.products,
                    [productId]: updatedProduct,
                };
                state.totalPrice = getCartProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
                state.due = state.totalPrice - state.paid;
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
                state.due = state.totalPrice - state.paid;
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
                state.due = state.totalPrice - state.paid;
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
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedProduct(
                {
                    ...state.products[key],
                    discount: amount,
                },
                null,
                null
            );
            state.products[key] = updatedProduct;
            state.totalPrice = getCartProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
        },
        addExtraDiscount: (
            state: CartState,
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedProduct(
                {
                    ...state.products[key],
                    extraDiscount: amount,
                },
                null,
                null
            );
            state.products[key] = updatedProduct;
            state.totalPrice = getCartProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
        },
        changeAction: (
            state: CartState,
            action: PayloadAction<CartActionTypes>
        ) => {
            state.action = action.payload;
        },
        setUser: (state: CartState, action) => {
            if (action.payload._id) {
                state.user = action.payload;
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updatePaid,
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
    addCustomerAccount,
    shiftMeasurementTo,
    addDiscount,
    addExtraDiscount,
    changeAction,
    setUser,
} = cartSlice.actions;
export default cartSlice.reducer;
