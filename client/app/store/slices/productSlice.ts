import Product, {
    ProductWithID,
    Resource,
    Unit,
} from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import savedUnits from "@/app/products/create/units";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import { getUpdatedSaleUnitsBase } from "@/app/functions/getUpdatedSaleUnitsBase";
import updatePricesForNewBase from "@/app/functions/updatePricesForNewBase";

const initialState: Product = {
    SKU: "",
    name: "",
    description: "",
    units: savedUnits.weight,
    updatePrice: 0,
    prices: [],
    measurements: [],
    saleUnitsBase: "",
    purchasePrices: [],
    purchaseMeasurements: [],
    price: 1,
    unit: "",
    sellEnable: true,
    purchaseEnable: true,
    priority: 1,
    quantity: 1,
    count: 1,
    discount: 0,
    extraDiscount: 0,
    stockAlert: 10,
    stockLow: 50,
    hasResources: false,
    resources: {},
    resourcesCost: 0,
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
        setProductProduct: (state, action) => {
            state._id = action.payload._id;
            state.product = action.payload;
        },
        selectUnits: (
            state: Product,
            action: PayloadAction<{ base: string; units: Record<string, Unit> }>
        ) => {
            let { base, units } = action.payload;

            state.saleUnitsBase = base;
            if (!units[base].enable) units[base].enable = true;
            state.units = units;

            // Ensure arrays exist before accessing index 0
            if (!state.prices.length)
                state.prices.push({ unit: base, max: 1, price: 1 });
            else state.prices[0] = { unit: base, max: 1, price: 1 };

            if (!state.measurements.length)
                state.measurements.push({ unit: base, value: 1 });
            else state.measurements[0] = { unit: base, value: 1 };

            if (!state.purchasePrices.length)
                state.purchasePrices.push({ unit: base, max: 1, price: 1 });
            else state.purchasePrices[0] = { unit: base, max: 1, price: 1 };

            if (!state.purchaseMeasurements.length)
                state.purchaseMeasurements.push({ unit: base, value: 1 });
            else state.purchaseMeasurements[0] = { unit: base, value: 1 };

            state.unit = base;
            state.displaySaleUnit = base;
            state.displayPurchaseUnit = base;
        },
        removeUnit: (state: Product, action: PayloadAction<string>) => {
            const key = action.payload;

            // Ensure the unit being removed is not the current sale unit
            if (key !== state.saleUnitsBase) {
                // Delete the unit from the units object
                delete state.units[key];

                // Optionally, check and clean up related fields if they depend on the removed unit
                state.prices = state.prices.filter(
                    (price) => price.unit !== key
                );
                state.measurements = state.measurements.filter(
                    (measurement) => measurement.unit !== key
                );
                state.purchasePrices = state.purchasePrices.filter(
                    (purchasePrice) => purchasePrice.unit !== key
                );
                state.purchaseMeasurements = state.purchaseMeasurements.filter(
                    (purchaseMeasurement) => purchaseMeasurement.unit !== key
                );

                if (state.displaySaleUnit == key)
                    state.displaySaleUnit = state.unit;
                if (state.displayPurchaseUnit == key)
                    state.displayPurchaseUnit = state.unit;
            }
        },

        addDynamicUnit: (
            state: Product,
            action: PayloadAction<{
                unit: string;
                label: string;
                value: number;
            }>
        ) => {
            state.units[action.payload.unit] = {
                ...action.payload,
                dynamic: true,
                dynamicValue: true,
                enable: true,
            };
        },
        updateUnitsDynamicValue: (
            state: Product,
            action: PayloadAction<{ key: string; value: number }>
        ) => {
            const { key, value } = action.payload;
            state.units[key].value = value;
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updateDynamicUnitLabel: (
            state: Product,
            action: PayloadAction<{ key: string; value: string }>
        ) => {
            const { key, value } = action.payload;
            state.units[key].label = value;
        },
        toggleUnitEnable: (
            state: Product,
            action: PayloadAction<{ key: string; enable: boolean }>
        ) => {
            const { key, enable } = action.payload;
            if (key !== state.unit) {
                state.units[key].enable = enable;

                if (!enable) {
                    let prices = state.prices;
                    for (let index in prices) {
                        if (prices[index].unit == key) {
                            state.prices[index].unit = state.unit;
                        }
                    }
                    let purchasePrices = state.purchasePrices;
                    for (let index in purchasePrices) {
                        if (purchasePrices[index].unit == key) {
                            state.purchasePrices[index].unit = state.unit;
                        }
                    }
                    let measurements = state.measurements;
                    for (let index in measurements) {
                        if (measurements[index].unit == key) {
                            state.measurements[index].unit = state.unit;
                        }
                    }
                    let purchaseMeasurements = state.purchaseMeasurements;
                    for (let index in purchaseMeasurements) {
                        if (purchaseMeasurements[index].unit == key) {
                            state.purchaseMeasurements[index].unit = state.unit;
                        }
                    }
                }
            }
        },
        updateDynamicUnitUnit: (
            state: Product,
            action: PayloadAction<{ key: string; value: string }>
        ) => {
            const { key, value } = action.payload;
            state.units[key].unit = value;
        },
        remapDynamicUnitUnit: (
            state: Product,
            action: PayloadAction<string>
        ) => {
            const key = action.payload;
            const unit = state.units[key];
            if (unit && unit.unit.length > 0 && unit.unit != key) {
                state.units[unit.unit] = unit;
                delete state.units[key];
            }
        },
        changeSaleUnitsBase: (
            state: Product,
            action: PayloadAction<string>
        ) => {
            const base = action.payload;
            state.prices = updatePricesForNewBase(state, base);
            state.units = getUpdatedSaleUnitsBase(state, base);
            state.saleUnitsBase = base;
            state.unit = base;
            state.price = getProductUnitPrice(state);
            // Safeguard units[base] existence
            state.units[base].enable = true;
        },

        // updateProductResourceProduct: (
        //     state: Product,
        //     action: PayloadAction<{ key: number; product: ProductWithID }>
        // ) => {
        //     const { key, product } = action.payload;
        //     state.resources = state.resources.map(
        //         (resource: any, index: number) =>
        //             index === key ? product : resource
        //     );
        // },
        updateProductResourceUnit: (
            state: Product,
            action: PayloadAction<{
                key: string;
                unit: string;
                product: ProductWithID;
            }>
        ) => {
            const { key, unit, product } = action.payload;
            let resource = state.resources[key];

            if (resource) {
                resource.unit = unit;
                resource.count = product.units[unit].value * resource.quantity;
            }
        },
        updateProductResourceQuantity: (
            state: Product,
            action: PayloadAction<{
                key: string;
                quantity: number;
                product: ProductWithID;
            }>
        ) => {
            const { key, quantity, product } = action.payload;
            let resource = state.resources[key];

            if (resource) {
                resource.quantity = quantity;
                resource.count = product.units[resource.unit].value * quantity;
            }
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
            state.prices = state.prices.map((item, index) =>
                index === key ? { ...item, unit, max: 1 } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        toggleProductHasResources: (state) => {
            state.hasResources = !state.hasResources;
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
        removePrice: (state: Product, action: PayloadAction<number>) => {
            const index = action.payload;
            // Check if index is valid before removing
            if (
                index >= 0 &&
                index < state.prices.length &&
                state.prices.length > 1
            ) {
                state.prices.splice(index, 1); // Remove one item at the given index
            }
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
        removeMeasurement: (state: Product, action: PayloadAction<number>) => {
            const index = action.payload;
            // Check if index is valid before removing
            if (
                index >= 0 &&
                index < state.measurements.length &&
                state.measurements.length > 1
            ) {
                state.measurements.splice(index, 1); // Remove one item at the given index
            }
        },
        /* Purchse section */
        updatePurchasePriceMax: (
            state: Product,
            action: PayloadAction<{ key: number; max: any }>
        ) => {
            const { key, max } = action.payload;
            state.purchasePrices = state.purchasePrices.map((item, index) =>
                index === key ? { ...item, max } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updatePurchasePriceUnit: (
            state: Product,
            action: PayloadAction<{ key: number; unit: string }>
        ) => {
            const { key, unit } = action.payload;
            console.log(action.payload);
            state.purchasePrices = state.purchasePrices.map((item, index) =>
                index === key ? { ...item, unit, max: 1 } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        updatePurchasePricePrice: (
            state: Product,
            action: PayloadAction<{ key: number; price: any }>
        ) => {
            const { key, price } = action.payload;
            state.purchasePrices = state.purchasePrices.map((item, index) =>
                index === key ? { ...item, price } : item
            );
            state.price = Math.ceil(getProductUnitPrice(state));
        },
        addPurchasePrice: (state: Product) => {
            state.purchasePrices.push(
                state.purchasePrices[state.purchasePrices.length - 1]
            );
        },
        removePurchasePrice: (
            state: Product,
            action: PayloadAction<number>
        ) => {
            const index = action.payload;
            // Check if index is valid before removing
            if (
                index >= 0 &&
                index < state.purchasePrices.length &&
                state.purchasePrices.length > 1
            ) {
                state.purchasePrices.splice(index, 1); // Remove one item at the given index
            }
        },
        updatePurchaseMeasurementUnit: (
            state: Product,
            action: PayloadAction<{ key: number; unit: any }>
        ) => {
            const { key, unit } = action.payload;
            state.purchaseMeasurements = state.purchaseMeasurements.map(
                (item, index) => (index === key ? { ...item, unit } : item)
            );
        },
        updatePurchaseMeasurementValue: (
            state: Product,
            action: PayloadAction<{ key: number; value: number }>
        ) => {
            const { key, value } = action.payload;
            state.purchaseMeasurements = state.purchaseMeasurements.map(
                (item, index) =>
                    index === key ? { ...item, value: value } : item
            );
        },
        addPurchaseMeasurement: (state: Product) => {
            state.purchaseMeasurements.push(
                state.purchaseMeasurements[
                    state.purchaseMeasurements.length - 1
                ]
            );
        },
        removePurchaseMeasurement: (
            state: Product,
            action: PayloadAction<number>
        ) => {
            const index = action.payload;
            // Check if index is valid before removing
            if (
                index >= 0 &&
                index < state.purchaseMeasurements.length &&
                state.purchaseMeasurements.length > 1
            ) {
                state.purchaseMeasurements.splice(index, 1); // Remove one item at the given index
            }
        },
        // Others
        updateUnit: (state: Product, action: PayloadAction<string>) => {
            state.unit = action.payload;
            state.price = Math.ceil(getProductUnitPrice(state));
        },

        setProduct: (state, action) => {
            return action.payload;
        },
        addResource: (state: Product, action: PayloadAction<Resource>) => {
            const resource = action.payload;
            const existed = state.resources[resource._id];
            if (existed) {
                state.resources[resource._id].quantity += 1;
            } else {
                state.resources[resource._id] = resource;
            }
        },
    },
});

export const {
    updateProductField,
    updatePurchasePriceMax,
    updatePurchasePriceUnit,
    updatePurchasePricePrice,
    addDynamicUnit,
    removeUnit,
    addPurchasePrice,
    updatePurchaseMeasurementUnit,
    updatePurchaseMeasurementValue,
    addPurchaseMeasurement,
    toggleUnitEnable,
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
    updateDynamicUnitLabel,
    updateDynamicUnitUnit,
    changeSaleUnitsBase,
    remapDynamicUnitUnit,
    setProduct,
    // updateProductResourceProduct,
    updateProductResourceUnit,
    updateProductResourceQuantity,
    toggleProductHasResources,
    addResource,
    setProductProduct,
    removeMeasurement,
    removePrice,
    removePurchaseMeasurement,
    removePurchasePrice,
} = productSlice.actions;

export default productSlice.reducer;
