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
        kg: {
            unit: "kg",
            label: "Kilogram",
            value: 1, // 1 kilogram
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        g: {
            unit: "g",
            label: "Gram",
            value: 0.001, // 1 gram = 0.001 kg
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        lb: {
            unit: "lb",
            label: "Pound",
            value: 0.453592, // 1 pound = 0.453592 kg
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
            enable: true,
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
        dz: {
            unit: "dz",
            label: "Dozen",
            value: 12, // 12 pieces make a dozen
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        pk: {
            unit: "pk",
            label: "Pack",
            value: 6, // A standard pack might contain 6 items
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        box: {
            unit: "box",
            label: "Box",
            value: 24, // A box might contain 24 items
            dynamic: false,
            dynamicValue: true,
            enable: true,
        },
        crt: {
            unit: "crt",
            label: "Carton",
            value: 144, // A carton typically holds 12 dozen or 144 pieces
            dynamic: true,
            dynamicValue: true,
            enable: true,
        },
        bnd: {
            unit: "bnd",
            label: "Bundle",
            value: 500, // Bundle of 500 small items
            dynamic: true,
            dynamicValue: true,
            enable: true,
        },
        plt: {
            unit: "plt",
            label: "Pallet",
            value: 500, // A pallet might contain 500 individual units
            dynamic: true,
            dynamicValue: true,
            enable: true,
        },
        crate: {
            unit: "crate",
            label: "Crate",
            value: 50, // A crate might hold 50 items
            dynamic: true,
            dynamicValue: false,
            enable: true,
        },
        rl: {
            unit: "rl",
            label: "Roll",
            value: 100, // A roll might be measured in length (e.g., 100 meters)
            dynamic: true,
            dynamicValue: true,
            enable: true,
        },
        pkt: {
            unit: "pkt",
            label: "Packet",
            value: 30, // A packet with 30 smaller items (e.g., screws or bolts)
            dynamic: true,
            dynamicValue: false,
            enable: true,
        },
        try: {
            unit: "try",
            label: "Tray",
            value: 20, // A tray could contain 20 items (e.g., eggs)
            dynamic: true,
            dynamicValue: false,
            enable: true,
        },
    },

    volume: {
        ltr: {
            unit: "ltr",
            label: "Liter",
            value: 1, // 1 liter for liquid products
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        ml: {
            unit: "ml",
            label: "Milliliter",
            value: 0.001, // 1 milliliter = 0.001 liter
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
        gal: {
            unit: "gal",
            label: "Gallon",
            value: 3.78541, // 1 gallon = 3.78541 liters
            dynamic: false,
            dynamicValue: false,
            enable: true,
        },
    },
};
