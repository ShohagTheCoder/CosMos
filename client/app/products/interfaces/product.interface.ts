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
    base: string;
}

export interface Price {
    unit: string;
    max: number;
    price: number;
}

export default interface Product {
    [x: string]: any;
    _id?: string;
    SKU: string;
    name: string;
    description?: string;
    madeIn?: string;
    units: Record<string, Unit>;
    prices: Price[];
    measurements: Measurement[];
    purchasePrices: Price[];
    purchaseMeasurements: Measurement[];
    resources: any;
    unit: string;
    price: number;
    saleUnitsBase: string;
    purchaseUnitsBase: string;
    discount: number;
    extraDiscount: number;
    quantity?: number;
    subTotal?: number;
    stockLow: number;
    stockAlert: number;
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
    measurements: Measurement[];
    purchasePrices: Price[];
    purchaseMeasurements: Measurement[];
    resources: any;
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
}
