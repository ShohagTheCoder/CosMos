export const productUnits = [
    {
        label: "Piece",
        unit: "pcs",
        value: 1, // 1 piece
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Dozen",
        unit: "dz",
        value: 12, // 12 pieces make a dozen
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Pack",
        unit: "pk",
        value: 6, // A standard pack might contain 6 items
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Box",
        unit: "box",
        value: 24, // A box might contain 24 items
        dynamic: false,
        dynamicValue: true,
        enable: true,
    },
    {
        label: "Carton",
        unit: "crt",
        value: 144, // A carton typically holds 12 dozen or 144 pieces
        dynamic: true,
        dynamicValue: true,
        enable: true,
    },
    {
        label: "Bundle",
        unit: "bnd",
        value: 500, // Bundle of 500 small items
        dynamic: true,
        dynamicValue: true,
        enable: true,
    },
    {
        label: "Kg",
        unit: "kg",
        value: 1, // 1 kilogram
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Gram",
        unit: "g",
        value: 0.001, // 1 gram = 0.001 kg
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Liter",
        unit: "ltr",
        value: 1, // 1 liter for liquid products
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Milliliter",
        unit: "ml",
        value: 0.001, // 1 milliliter = 0.001 liter
        dynamic: false,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Pallet",
        unit: "plt",
        value: 500, // A pallet might contain 500 individual units
        dynamic: true,
        dynamicValue: true,
        enable: true,
    },
    {
        label: "Crate",
        unit: "crt",
        value: 50, // A crate might hold 50 items
        dynamic: true,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Roll",
        unit: "rl",
        value: 100, // A roll might be measured in length (e.g., 100 meters)
        dynamic: true,
        dynamicValue: true,
        enable: true,
    },
    {
        label: "Packet",
        unit: "pkt",
        value: 30, // A packet with 30 smaller items (e.g., screws or bolts)
        dynamic: true,
        dynamicValue: false,
        enable: true,
    },
    {
        label: "Tray",
        unit: "try",
        value: 20, // A tray could contain 20 items (e.g., eggs)
        dynamic: true,
        dynamicValue: false,
        enable: true,
    },
];
