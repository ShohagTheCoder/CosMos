import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
        addToCart: (state: CartState, action: PayloadAction<ProductWithID>) => {
            let product = action.payload;
            const existingProduct = state.products[product._id];

            if (existingProduct) {
                state.products[product._id] = getUpdatedProduct(
                    existingProduct,
                    existingProduct.quantity + 1,
                    undefined
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
            let paid = action.payload || 0;
            if (paid >= 0 && state.customer) {
                state.paid = paid;
                state.due = state.totalPrice - paid;
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
        updateSalePrice: (
            state: CartState,
            action: PayloadAction<{ key: any; amount: number }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                const product = state.products[key];
                if (product) {
                    product.updatePrice += amount;
                    state.products[key] = getUpdatedProduct(
                        product,
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
        updateQuantity: (
            state: CartState,
            action: PayloadAction<{ key: string | undefined; quantity: number }>
        ) => {
            let { key = state.activeProduct, quantity } = action.payload;
            if (key && quantity >= 0) {
                const product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        quantity,
                        undefined
                    );
                    return updateCart(state);
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
        decrementQuantity: (
            state: CartState,
            action: PayloadAction<string | undefined>
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
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },

        updateUnit: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined | undefined;
                unit: string;
            }>
        ) => {
            let { key = state.activeProduct, unit } = action.payload;
            if (key) {
                const product = state.products[key];
                if (product) {
                    state.products[key] = getUpdatedProduct(
                        product,
                        undefined,
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
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                let product = state.products[key];

                if (product && amount < product.price - product.updatePrice) {
                    state.products[key] = getUpdatedProduct(
                        {
                            ...product,
                            discount: amount,
                        },
                        undefined,
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },
        updateDiscountAmount: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined;
                amount: number;
            }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                let product = state.products[key];

                if (
                    product &&
                    product.discount + amount <
                        product.price - product.updatePrice
                ) {
                    product.discount += amount;
                    state.products[key] = getUpdatedProduct(
                        product,
                        undefined,
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },
        addExtraDiscount: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined;
                amount: number;
            }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                let product = state.products[key];
                if (product && amount < product.subTotal) {
                    state.products[key] = getUpdatedProduct(
                        {
                            ...product,
                            extraDiscount: amount,
                        },
                        undefined,
                        undefined
                    );
                    return updateCart(state);
                }
            }
        },
        updateExtraDiscountAmount: (
            state: CartState,
            action: PayloadAction<{
                key: string | undefined;
                amount: number;
            }>
        ) => {
            let { key = state.activeProduct, amount } = action.payload;
            if (key) {
                let product = state.products[key];
                console.log("Called");
                if (
                    product &&
                    product.extraDiscount + amount < product.subTotal
                ) {
                    product.extraDiscount += amount;
                    state.products[key] = getUpdatedProduct(
                        product,
                        undefined,
                        undefined
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
        resetCart: () => {
            return initialCartState;
        },
        setWholeCart: (state: CartState, action: PayloadAction<CartState>) => {
            return action.payload;
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
    setWholeCart,
    resetCart,
    setSalePrice,
} = cartSlice.actions;
export default cartSlice.reducer;
