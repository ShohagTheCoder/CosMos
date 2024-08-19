const units = {
    weight: {
        g: {
            label: "Gram",
            unit: "g",
            value: 0.001,
            dynamic: false,
            base: "kg",
        },
        kg: {
            label: "Kilogram",
            unit: "kg",
            value: 1,
            dynamic: false,
            base: "kg",
        },
        qt: {
            label: "Quintal",
            unit: "qt",
            value: 100,
            dynamic: false,
            base: "kg",
        },
        bag: {
            label: "Bag",
            unit: "bag",
            value: 50,
            dynamic: true,
        },
    },
    pice: {
        pcs: {
            label: "Pices",
            unit: "pcs",
            value: 1,
            dynamic: false,
            base: "pcs",
        },
        box: {
            label: "Box",
            unit: "box",
            value: 12,
            dynamic: true,
            base: "pcs",
        },
    },
    volume: {
        ltr: {
            label: "Liter",
            unit: "ltr",
            value: 1,
            dynamic: false,
            base: "ltr",
        },
        btl: {
            label: "Bottle",
            unit: "btl",
            value: 5,
            dynamic: true,
            base: "ltr",
        },
    },
};

export { units };
