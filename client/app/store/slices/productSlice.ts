import Product, {
    ProductWithID,
    Resource,
    Unit,
} from "@/app/products/interfaces/product.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { units } from "@/app/products/create/units";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import { getUpdatedSaleUnitsBase } from "@/app/functions/getUpdatedSaleUnitsBase";
import updatePricesForNewBase from "@/app/functions/updatePricesForNewBase";

const initialState: Product = {
    SKU: "",
    name: "",
    description: "",
    units: units.weight,
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
            const { base, units } = action.payload;
            state.saleUnitsBase = base;
            state.units = units;
            state.prices[0] = {
                unit: base,
                max: 1,
                price: 1,
            };
            state.measurements[0] = {
                unit: base,
                value: 1,
            };
            state.purchasePrices[0] = {
                unit: base,
                max: 1,
                price: 1,
            };
            state.purchaseMeasurements[0] = {
                unit: base,
                value: 1,
            };
            state.unit = base;
            state.displaySaleUnit = base;
            state.displayPurchaseUnit = base;
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
            state.units[unit.unit] = unit;
            delete state.units[key];
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
    addPurchasePrice,
    updatePurchaseMeasurementUnit,
    updatePurchaseMeasurementValue,
    addPurchaseMeasurement,
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
} = productSlice.actions;

export default productSlice.reducer;
