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
    enable: boolean;
}

export interface Price {
    unit: string;
    start: number;
    price: number;
}

export interface Resource {
    _id: string;
    unit: string;
    count: number;
    quantity: number;
}

type BrandType = string | { name: string };
type CategoryType = string | { name: string };

export default interface Product {
    [x: string]: any;
    _id?: string;
    SKU: string;
    name: string;
    image?: string;
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
    count: number;
    discount: number;
    extraDiscount: number;
    quantity: number;
    subTotal?: number;
    stockLow: number;
    stockAlert: number;
    sellEnable: boolean;
    purchaseEnable: boolean;
    displaySaleUnit?: string;
    displayPurchaseUnit?: string;
    brand?: BrandType; // Updated to allow string or object
    category?: CategoryType; // Same here
    updatePrice: number;
    keywords: string[];
}

export interface ProductWithID extends Product {
    _id: string;
    stock: {
        stock: number;
    };
    subTotal: number;
    displaySaleUnit: string;
    displayPurchaseUnit: string;
    brand: { name: string }; // Enforce the populated form
    category: { name: string }; // Enforce the populated form
    product?: Product;
}
