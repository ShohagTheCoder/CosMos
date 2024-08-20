import Product, { Unit } from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { units } from "@/app/products/create/units";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";

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
    price: 0,
    unit: Object.values(units.weight)[0].base,
    discount: 0,
    extraDiscount: 0,
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
        selectUnits: (
            state: Product,
            action: PayloadAction<Record<string, Unit>>
        ) => {
            const unit = Object.values(action.payload)[0].base;
            state.units = action.payload;
            state.prices[0].unit = unit;
            state.measurements[0].unit = unit;
            state.unit = unit;
        },
        updateUnitsDynamicValue: (
            state: Product,
            action: PayloadAction<{ key: string; value: number }>
        ) => {
            const { key, value } = action.payload;
            state.units[key].value = value;
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updatePriceMax: (
            state: Product,
            action: PayloadAction<{ key: number; max: any }>
        ) => {
            const { key, max } = action.payload;
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, max } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updatePriceUnit: (
            state: Product,
            action: PayloadAction<{ key: number; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            console.log(action.payload);
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, unit, max: 0 } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updatePricePrice: (
            state: Product,
            action: PayloadAction<{ key: number; price: any }>
        ) => {
            const { key, price } = action.payload;
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, price } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
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
            action: PayloadAction<{ key: number; value: number }>
        ) => {
            const { key, value } = action.payload;
            state.measurements = state.measurements.map((item, index) =>
                index === key ? { ...item, value: value } : item
            );
        },
        addMeasurement: (state: Product) => {
            state.measurements.push(
                state.measurements[state.measurements.length - 1]
            );
        },
        updateUnit: (state: Product, action: PayloadAction<string>) => {
            state.unit = action.payload;
            state.price = Math.ceil(getProductUnitPrice(state));
        },
    },
});

export const {
    updateProductField,
    selectUnits,
    updatePriceMax,
    updatePriceUnit,
    updatePricePrice,
    addPrice,
    updateUnitsDynamicValue,
    updateMeasurementUnit,
    updateMeasurementValue,
    addMeasurement,
    updateUnit,
} = productSlice.actions;

export default productSlice.reducer;
