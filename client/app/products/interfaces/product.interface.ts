export interface Measurement {
    unit: string;
    value: number;
}

export interface Unit {
    unit: string;
    label: string;
    dynamic: boolean;
    dynamicValue: boolean;
    value: number;
}

export interface Price {
    unit: string;
    max: number;
    price: number;
}

export interface Resource {
    _id: string;
    unit: string;
    count: number;
    quantity: number;
}

export default interface Product {
    [x: string]: any;
    _id?: string;
    SKU: string;
    name: string;
    description: string;
    madeIn?: string;
    units: Record<string, Unit>;
    prices: Price[];
    measurements: Measurement[];
    purchasePrices: Price[];
    purchaseMeasurements: Measurement[];
    hasResources: boolean;
    resources: Record<string, Resource>;
    resourcesCost: number;
    unit: string;
    price: number;
    priority: number;
    saleUnitsBase: string;
    purchaseUnitsBase?: string;
    discount: number;
    extraDiscount: number;
    quantity?: number;
    subTotal?: number;
    stockLow: number;
    stockAlert: number;
    sellEnable: boolean;
    purchaseEnable: boolean;
    displaySaleUnit?: string;
    displayPurchaseUnit?: string;
}

export interface ProductWithID {
    _id: string;
    SKU: string;
    name: string;
    description?: string;
    madeIn?: string;
    saleUnitsBase: string;
    purchaseUnitsBase: string;
    units: Record<string, Unit>;
    prices: Price[];
    priority: number;
    measurements: Measurement[];
    purchasePrices: Price[];
    purchaseMeasurements: Measurement[];
    hasResources: boolean;
    resources: Record<string, Resource>;
    resourcesCost: number;
    unit: string;
    price: number;
    discount: number;
    extraDiscount: number;
    stock: string;
    quantity: number;
    count: number;
    subTotal: number;
    stockLow: number;
    stockAlert: number;
    sellEnable: boolean;
    purchaseEnable: boolean;
    displaySaleUnit: string;
    displayPurchaseUnit: string;
}
