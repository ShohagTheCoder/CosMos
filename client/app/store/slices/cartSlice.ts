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
    updateCartState,
    shiftMeasurementTo,
    resetSalePrice,
    setPriceToWithDiscount,
    shiftUnitTo,
} = cartSlice.actions;
export default cartSlice.reducer;
