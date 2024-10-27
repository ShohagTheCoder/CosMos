import { Unit } from "../interfaces/product.interface";

interface UnitBases {
    weight: Record<string, Unit>;
    pieces: Record<string, Unit>;
    volume: Record<string, Unit>;
}

const defaultUnits: UnitBases = {
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
            label: "KG",
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
            label: "Q",
            unit: "qt",
            value: 100,
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
    },
    pieces: {
        pcs: {
            label: "Pcs",
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
            label: "Ltr",
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

export default defaultUnits;
