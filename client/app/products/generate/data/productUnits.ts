import { Unit } from "../../interfaces/product.interface";

type ProductUnitCategory = {
    [unit: string]: Unit; // Each category maps unit keys to their properties
};

type ProductUnits = {
    weight: ProductUnitCategory; // For weight units
    pieces: ProductUnitCategory; // For pieces units
    volume: ProductUnitCategory; // For volume units
};

export const productUnits: ProductUnits = {
    weight: {
        g: {
            unit: "g",
            label: "Gram",
            value: 0.001, // 1 gram = 0.001 kg
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        kg: {
            unit: "kg",
            label: "KG",
            value: 1, // 1 kilogram
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        ton: {
            unit: "ton",
            label: "Ton",
            value: 1000, // 1 ton = 1000 kg
            dynamic: false,
            dynamicValue: false,
            enable: false,
        },
        bag: {
            unit: "bag",
            label: "Bag",
            value: 50, // 1 ton = 1000 kg
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
    },

    pieces: {
        pcs: {
            unit: "pcs",
            label: "Piece",
            value: 1, // 1 piece
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        pk: {
            unit: "pk",
            label: "Pack",
            value: 20, // A standard pack might contain 6 items
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
        box: {
            unit: "box",
            label: "Box",
            value: 24, // A box might contain 24 items
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
        crt: {
            unit: "crt",
            label: "Carton",
            value: 144, // A carton typically holds 12 dozen or 144 pieces
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
        bnd: {
            unit: "bnd",
            label: "Bundle",
            value: 120, // Bundle of 500 small items
            dynamic: false,
            dynamicValue: true,
            enable: false,
        },
    },

    volume: {
        ml: {
            unit: "ml",
            label: "Milliliter",
            value: 0.001, // 1 milliliter = 0.001 liter
            dynamic: false,
            dynamicValue: false,
            enable: false,
        },
        ltr: {
            unit: "ltr",
            label: "Liter",
            value: 1, // 1 liter for liquid products
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
    },
};
