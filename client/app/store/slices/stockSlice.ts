import getCurrentMeasurement from "@/app/functions/getCurrentMeasurement";
import getProductsTotalPrice from "@/app/functions/getProductsTotalPrice";
import getUpdatedStockProduct from "@/app/functions/purchase/getUpdatedPurchaseProduct";
import { Supplier } from "@/app/interfaces/supplier.interface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StockState {
    receiver?: {
        name: string;
    };
    products: Record<string, ProductWithID>;
    totalPrice: number;
    supplier?: Supplier;
    activeProduct?: string;
    selectedProductIndex: number;
}

const initialState: StockState = {
    selectedProductIndex: 0,
    products: {},
    totalPrice: 0,
};

const stockSlice = createSlice({
    name: "stock",
    initialState,
    reducers: {
        addToStock: (
            state: StockState,
            action: PayloadAction<ProductWithID>
        ) => {
            let product = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                state.products[product._id] = getUpdatedStockProduct(
                    existingProduct,
                    1,
                    null
                );
            } else {
                product = getUpdatedStockProduct(
                    product,
                    product.stockMeasurements[0].value - 1,
                    product.stockMeasurements[0].unit
                );
                state.products = { ...state.products, [product._id]: product };
                state.activeProduct = product._id;
            }

            state.totalPrice += product.subTotal;
        },
        addToStockProducts: (
            state: StockState,
            action: PayloadAction<ProductWithID[]>
        ) => {
            const products = action.payload;
            // Loop through the new products and update the state
            products.forEach((product) => {
                if (product.stockMeasurements.length > 0) {
                    state.products[product._id] = getUpdatedStockProduct(
                        product,
                        product.stockMeasurements[0].value - 1,
                        product.stockMeasurements[0].unit
                    );
                }
            });

            // Calculate the new total price
            state.totalPrice = getProductsTotalPrice(state.products);
        },
        removeFromStock: (state, action) => {
            let productId = action.payload;
            if (productId == null) productId = state.activeProduct;
            const removedProduct = state.products[productId];

            if (removedProduct) {
                // eslint-disable-next-line no-unused-vars
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

        updatePaid: (state: StockState, action: PayloadAction<number>) => {
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
                const updatedProduct = getUpdatedStockProduct(
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
        incrementQuantity: (state: StockState, action) => {
            let productId = action.payload;
            if (!productId) {
                productId = state.activeProduct;
            }
            const product = state.products[productId];

            if (product) {
                const updatedProduct = getUpdatedStockProduct(product, 1, null);
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
                const updatedProduct = getUpdatedStockProduct(
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
            state: StockState,
            action: PayloadAction<{ key: string; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            const product = state.products[key];

            if (product) {
                const updatedProduct = getUpdatedStockProduct(
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
            state: StockState,
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
                const updatedProduct = getUpdatedStockProduct(
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

        clearStock: (state) => {
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
            state: StockState,
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedStockProduct(
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
            state: StockState,
            action: PayloadAction<{ key: string; amount: number }>
        ) => {
            const { key, amount } = action.payload;
            if (!state.products[key] || amount < 0) return;
            const updatedProduct = getUpdatedStockProduct(
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
        setReceiver: (state: StockState, action) => {
            if (action.payload._id) {
                state.receiver = action.payload;
            }
        },
    },
});

export const {
    addToStock,
    removeFromStock,
    updatePaid,
    updateQuantity,
    incrementQuantity,
    addToStockProducts,
    decrementQuantity,
    clearStock,
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
} = stockSlice.actions;
export default stockSlice.reducer;
