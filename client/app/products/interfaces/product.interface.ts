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
    _id?: string; // This remains optional in the base Product interface
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
    brand?: string | { name: string }; // Allow either a string or an object
    category?: string | { name: string }; // Same here
    updatePrice: number;
    keywords: string[];
}

export interface ProductWithID extends Product {
    _id: string; // Enforce _id as required
    stock: {
        stock: number;
    };
    subTotal: number;
    displaySaleUnit: string;
    displayPurchaseUnit: string;
    brand: { name: string }; // Enforce the populated form
    category: { name: string }; // Enforce the populated form
    product?: Product; // Allow this to be optional if this is a reference back to the Product
}
