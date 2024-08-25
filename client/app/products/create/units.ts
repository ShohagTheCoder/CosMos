import { Unit } from "../interfaces/product.interface";

interface UnitBases {
    weight: Record<string, Unit>;
    pices: Record<string, Unit>;
    volume: Record<string, Unit>;
}

const units: UnitBases = {
    weight: {
        g: {
            label: "Gram",
            unit: "g",
            value: 0.001,
            dynamic: false,
            dynamicValue: false,
            base: "kg",
        },
        kg: {
            label: "Kilogram",
            unit: "kg",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            base: "kg",
        },
        qt: {
            label: "Quintal",
            unit: "qt",
            value: 100,
            dynamic: false,
            dynamicValue: false,
            base: "kg",
        },
        bag: {
            label: "Bag",
            unit: "bag",
            value: 50,
            dynamic: false,
            dynamicValue: true,
            base: "kg",
        },
        undefined: {
            label: "Undefined",
            unit: "undefined",
            value: 1,
            dynamic: true,
            dynamicValue: true,
            base: "kg",
        },
    },
    pices: {
        pcs: {
            label: "Pices",
            unit: "pcs",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            base: "pcs",
        },
        box: {
            label: "Box",
            unit: "box",
            value: 12,
            dynamic: false,
            dynamicValue: true,
            base: "pcs",
        },
    },
    volume: {
        ltr: {
            label: "Liter",
            unit: "ltr",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            base: "ltr",
        },
        btl: {
            label: "Bottle",
            unit: "btl",
            value: 5,
            dynamic: false,
            dynamicValue: true,
            base: "ltr",
        },
    },
};

export { units };
