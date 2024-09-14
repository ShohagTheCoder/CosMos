import { Unit } from "../interfaces/product.interface";

interface UnitBases {
    weight: Record<string, Unit>;
    pices: Record<string, Unit>;
    volume: Record<string, Unit>;
}

const savedUnits: UnitBases = {
    weight: {
        g: {
            label: "Gram",
            unit: "g",
            value: 0.001,
            dynamic: false,
            dynamicValue: false,
            enable: false,
        },
        kg: {
            label: "Kilogram",
            unit: "kg",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        bag: {
            label: "Bag",
            unit: "bag",
            value: 50,
            dynamic: false,
            dynamicValue: true,
            enable: true,
        },
        qt: {
            label: "Quintal",
            unit: "qt",
            value: 100,
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
    },
    pices: {
        pcs: {
            label: "Pices",
            unit: "pcs",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        box: {
            label: "Box",
            unit: "box",
            value: 12,
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
    },
    volume: {
        ltr: {
            label: "Liter",
            unit: "ltr",
            value: 1,
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        btl: {
            label: "Bottle",
            unit: "btl",
            value: 5,
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
    },
};

export default savedUnits;
