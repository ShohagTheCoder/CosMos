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
    updatePrice: number;
}

export interface ProductWithID extends Product {
    _id: string; // Since Product has _id as optional, you can enforce it here
    stock: {
        stock: number;
    };
    subTotal: number;
    product: Product; // If this is a reference back to Product
}
