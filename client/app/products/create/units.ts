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
        },
        kg: {
            label: "Kilogram",
            unit: "kg",
            value: 1,
            dynamic: false,
            dynamicValue: false,
        },
        qt: {
            label: "Quintal",
            unit: "qt",
            value: 100,
            dynamic: false,
            dynamicValue: false,
        },
        bag: {
            label: "Bag",
            unit: "bag",
            value: 50,
            dynamic: false,
            dynamicValue: true,
        },
        undefined: {
            label: "Undefined",
            unit: "undefined",
            value: 1,
            dynamic: true,
            dynamicValue: true,
        },
    },
    pices: {
        pcs: {
            label: "Pices",
            unit: "pcs",
            value: 1,
            dynamic: false,
            dynamicValue: false,
        },
        box: {
            label: "Box",
            unit: "box",
            value: 12,
            dynamic: false,
            dynamicValue: true,
        },
    },
    volume: {
        ltr: {
            label: "Liter",
            unit: "ltr",
            value: 1,
            dynamic: false,
            dynamicValue: false,
        },
        btl: {
            label: "Bottle",
            unit: "btl",
            value: 5,
            dynamic: false,
            dynamicValue: true,
        },
    },
};

export { units };
