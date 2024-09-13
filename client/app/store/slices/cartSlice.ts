import getProductsTotalPrice from "@/app/functions/getProductsTotalPrice";
import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
                product = getUpdatedProduct(
                    product,
                    product.measurements[0].value,
                    product.measurements[0].unit
                );
                state.products[product._id] = product;
                state.activeProduct = product._id;
            }

            state.totalPrice += product.subTotal;
            state.due = state.totalPrice - state.paid;
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
                state.totalPrice = getProductsTotalPrice(state.products);
            } else {
                product = getUpdatedProduct(
                    product,
                    quantity,
                    unit !== undefined ? unit : product.measurements[0].unit
                );
                state.products[product._id] = product;
                state.totalPrice += product.subTotal;
            }

            state.activeProduct = product._id;
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
            state,
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

                state.totalPrice = getProductsTotalPrice(state.products);
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
                const updatedProduct = getUpdatedProduct(
                    product,
                    product.quantity + 1,
                    null
                );
                state.products[productId] = updatedProduct;
                state.totalPrice = getProductsTotalPrice({
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
                const updatedProduct = getUpdatedProduct(
                    product,
                    product.quantity - 1,
                    null
                );
                state.products = {
                    ...state.products,
                    [productId]: updatedProduct,
                };
                state.totalPrice = getProductsTotalPrice({
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
                state.totalPrice = getProductsTotalPrice({
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
                state.totalPrice = getProductsTotalPrice({
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
            action: PayloadAction<{
                key: any;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (key == null && state.activeProduct) {
                key = state.activeProduct;
            }
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
            state.totalPrice = getProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
        },
        updateDiscountAmount: (
            state: CartState,
            action: PayloadAction<{
                key: any;
                amount: number;
            }>
        ) => {
            let { key, amount } = action.payload;
            if (key == null && state.activeProduct) {
                key = state.activeProduct;
            }
            if (!state.products[key]) return;
            let product = state.products[key];
            product.discount += amount;
            const updatedProduct = getUpdatedProduct(product, null, null);
            state.products[key] = updatedProduct;
            state.totalPrice = getProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
        },
        addExtraDiscount: (
            state: CartState,
            action: PayloadAction<{ key: any; amount: number }>
        ) => {
            let { key, amount } = action.payload;
            if (key == null && state.activeProduct) {
                key = state.activeProduct;
            }
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
            state.totalPrice = getProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
        },
        updateExtraDiscountAmount: (
            state: CartState,
            action: PayloadAction<{ key: any; amount: number }>
        ) => {
            let { key, amount } = action.payload;
            if (key == null && state.activeProduct) {
                key = state.activeProduct;
            }
            if (!state.products[key]) return;
            let product = state.products[key];
            product.extraDiscount += amount;
            const updatedProduct = getUpdatedProduct(product, null, null);
            state.products[key] = updatedProduct;
            state.totalPrice = getProductsTotalPrice({
                ...state.products,
                [key]: updatedProduct,
            });
            state.due = state.totalPrice - state.paid;
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
