import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getProductsTotalPrice from "@/app/functions/getProductsTotalPrice";
import getUpdatedPurchaseProduct from "@/app/functions/purchase/getUpdatedPurchaseProduct";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum PurchaseActionTypes {
    sell = "sell",
    purchase = "purchase",
    return = "return",
}

export interface PurchaseState {
    receiver?: {
        name: string;
    };
    products: Record<string, ProductWithID>;
    totalPrice: number;
    supplier?: {
        name: string;
        products: string[];
    };
    activeProduct?: string;
    selectedProductIndex: number;
}

const initialState: PurchaseState = {
    selectedProductIndex: 0,
    products: {},
    totalPrice: 0,
};

const purchaseSlice = createSlice({
    name: "purchase",
    initialState,
    reducers: {
        addToPurchase: (
            state: PurchaseState,
            action: PayloadAction<ProductWithID>
        ) => {
            let product = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                state.products[product._id] = getUpdatedPurchaseProduct(
                    existingProduct,
                    1,
                    null
                );
            } else {
                product = getUpdatedPurchaseProduct(
                    product,
                    product.purchaseMeasurements[0].value - 1,
                    product.purchaseMeasurements[0].unit
                );
                state.products = { ...state.products, [product._id]: product };
                state.activeProduct = product._id;
            }

            state.totalPrice += product.subTotal;
        },
        addToPurchaseProducts: (
            state: PurchaseState,
            action: PayloadAction<ProductWithID[]>
        ) => {
            const products = action.payload;
            // Loop through the new products and update the state
            products.forEach((product) => {
                if (product.purchaseMeasurements.length > 0) {
                    state.products[product._id] = getUpdatedPurchaseProduct(
                        product,
                        product.purchaseMeasurements[0].value - 1,
                        product.purchaseMeasurements[0].unit
                    );
                }
            });

            // Calculate the new total price
            state.totalPrice = getProductsTotalPrice(state.products);
        },
        removeFromPurchase: (state, action) => {
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

        updatePaid: (state: PurchaseState, action: PayloadAction<number>) => {
            let paid = action.payload;
            if (!paid) {
                paid = 0;
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
                const updatedProduct = getUpdatedPurchaseProduct(
                    product,
                    quantity - product.quantity,
                    null
                );
                state.products = {
                    ...state.products,
                    [key]: updatedProduct,
                };
                state.totalPrice = getProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },
        incrementQuantity: (state: PurchaseState, action) => {
            let productId = action.payload;
            if (!productId) {
                productId = state.activeProduct;
            }
            const product = state.products[productId];

            if (product) {
                const updatedProduct = getUpdatedPurchaseProduct(
                    product,
                    1,
                    null
                );
                state.products[productId] = updatedProduct;
                state.totalPrice = getProductsTotalPrice({
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

            if (product && product.quantity > 0) {
                const updatedProduct = getUpdatedPurchaseProduct(
                    product,
                    -1,
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
            }
        },

        updateUnit: (
            state: PurchaseState,
            action: PayloadAction<{ key: string; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            const product = state.products[key];

            if (product) {
                const updatedProduct = getUpdatedPurchaseProduct(
                    product,
                    null,
                    unit
                );
                state.products = {
                    ...state.products,
                    [key]: updatedProduct,
                };
                state.totalPrice = getProductsTotalPrice({
                    ...state.products,
                    [product._id]: updatedProduct,
                });
            }
        },

        shiftMeasurementTo: (
            state: PurchaseState,
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
                const updatedProduct = getUpdatedPurchaseProduct(
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
            }
        },

        clearPurchase: (state) => {
            state.products = {};
            state.totalPrice = 0;
        },

        addSupplier: (state, action) => {
            state.supplier = action.payload;
        },

        changeActiveProduct: (state, action) => {
            state.activeProduct = action.payload;
        },

        addDiscount: (
            state: PurchaseState,
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedPurchaseProduct(
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
        },
        addExtraDiscount: (
            state: PurchaseState,
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedPurchaseProduct(
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
        },
        setReceiver: (state: PurchaseState, action) => {
            if (action.payload._id) {
                state.receiver = action.payload;
            }
        },
    },
});

export const {
    addToPurchase,
    removeFromPurchase,
    updatePaid,
    updateQuantity,
    incrementQuantity,
    addToPurchaseProducts,
    decrementQuantity,
    clearPurchase,
    addSupplier,
    changeActiveProduct,
    selectPreviousProduct,
    selectNexProduct,
    resetSelectedProductIndex,
    updateUnit,
    shiftMeasurementTo,
    addDiscount,
    addExtraDiscount,
    setReceiver,
} = purchaseSlice.actions;
export default purchaseSlice.reducer;
