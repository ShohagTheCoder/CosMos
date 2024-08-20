export interface Measurement {
    unit: string;
    value: number;
}

export interface Unit {
    unit: string;
    label: string;
    dynamic: boolean;
    value: number;
    base: string;
}

export interface Price {
    unit: string;
    max: number;
    price: number;
}

export default interface Product {
    SKU: string;
    name: string;
    description?: string;
    madeIn?: string;
    units: Record<string, Unit>;
    prices: Price[];
    measurements: Measurement[];
    unit: string;
    price: number;
    discount: number;
    extraDiscount: number;
    quantity?: number;
    subTotal?: number;
}

export interface ProductWithID {
    _id: string;
    SKU: string;
    name: string;
    description?: string;
    madeIn?: string;
    units: Record<string, Unit>;
    prices: Price[];
    measurements: Measurement[];
    unit: string;
    price: number;
    discount: number;
    extraDiscount: number;
    quantity: number;
    subTotal: number;
}
