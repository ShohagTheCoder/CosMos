import Product from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import { units } from "@/app/products/create/units";

const initialState: Product = {
    SKU: "",
    name: "",
    description: "",
    units: units.weight,
    prices: [
        {
            unit: "kg",
            max: 0,
            price: 0,
        },
    ],
    measurements: [
        {
            unit: "kg",
            value: 0,
        },
    ],
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        updateProductField: (
            state: Product,
            action: PayloadAction<{ field: keyof Product; value: any }>
        ) => {
            const { field, value } = action.payload;
            if (field in state) {
                (state as any)[field] = value;
            }
        },
        updateUnits: (state: Product, action) => {
            state.units = action.payload;
        },
        updateUnitsDynamicValue: (
            state: Product,
            action: PayloadAction<{ key: string; value: number }>
        ) => {
            const { key, value } = action.payload;
            state.units[key].value = value;
        },
        updatePrices: (state: Product, action) => {
            state.prices = action.payload;
        },
        updateMeasurements: (state: Product, action) => {
            state.measurements = action.payload;
        },
        updatePriceMax: (
            state: Product,
            action: PayloadAction<{ key: number; max: any }>
        ) => {
            const { key, max } = action.payload;
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, max } : item
            );
        },
        updatePriceUnit: (
            state: Product,
            action: PayloadAction<{ key: number; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, unit, max: 0 } : item
            );
        },
        updatePricePrice: (
            state: Product,
            action: PayloadAction<{ key: number; price: any }>
        ) => {
            const { key, price } = action.payload;
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, price } : item
            );
        },
        addPrice: (state: Product) => {
            state.prices.push(state.prices[state.prices.length - 1]);
        },
        updateMeasurementUnit: (
            state: Product,
            action: PayloadAction<{ key: number; unit: any }>
        ) => {
            const { key, unit } = action.payload;
            state.measurements = state.measurements.map((item, index) =>
                index === key ? { ...item, unit } : item
            );
        },
        updateMeasurementValue: (
            state: Product,
            action: PayloadAction<{ key: number; value: any }>
        ) => {
            const { key, value } = action.payload;
            state.measurements = state.measurements.map((item, index) =>
                index === key ? { ...item, value } : item
            );
        },
        addMeasurement: (state: Product) => {
            state.measurements.push(
                state.measurements[state.measurements.length - 1]
            );
        },
    },
});

export const {
    updateProductField,
    updateUnits,
    updatePrices,
    updateMeasurements,
    updatePriceMax,
    updatePriceUnit,
    updatePricePrice,
    addPrice,
    updateUnitsDynamicValue,
    updateMeasurementUnit,
    updateMeasurementValue,
    addMeasurement,
} = productSlice.actions;

export default productSlice.reducer;
