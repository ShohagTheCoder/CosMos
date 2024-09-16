const products: any[] = [
    {
        SKU: 'G46457',
        name: 'Corn',
        description: 'Grain',
        units: {
            g: {
                label: 'Gram',
                unit: 'g',
                value: 0.001,
                dynamic: false,
                dynamicValue: false,
                base: 'kg',
                enable: true,
            },
            kg: {
                label: 'Kilogram',
                unit: 'kg',
                value: 1,
                dynamic: false,
                dynamicValue: false,
                base: 'kg',
                enable: true,
            },
            qt: {
                label: 'Quintal',
                unit: 'qt',
                value: 100,
                dynamic: false,
                dynamicValue: false,
                base: 'kg',
                enable: false,
            },
            bag: {
                label: 'Bag',
                unit: 'bag',
                value: 50,
                dynamic: false,
                dynamicValue: true,
                base: 'kg',
                enable: true,
            },
        },
        prices: [
            {
                unit: 'bag',
                max: 1,
                price: 99,
            },
            {
                unit: 'bag',
                max: 10,
                price: 95,
            },
        ],
        measurements: [
            {
                unit: 'kg',
                value: 1,
            },
            {
                unit: 'kg',
                value: 5,
            },
            {
                unit: 'bag',
                value: 1,
            },
        ],
        saleUnitsBase: 'kg',
        purchasePrices: [
            {
                unit: 'bag',
                max: 1,
                price: 80,
            },
        ],
        purchaseMeasurements: [
            {
                unit: 'bag',
                value: 1,
            },
        ],
        price: 99,
        unit: 'kg',
        hasResources: false,
        resourcesCost: 0,
        discount: 0,
        extraDiscount: 0,
        quantity: 1,
        count: 1,
        stockLow: 50,
        stockAlert: 10,
        subTotal: 99,
        displaySaleUnit: 'kg',
        displayPurchaseUnit: 'qt',
        priority: 1,
        purchaseEnable: true,
        sellEnable: false,
        discountEnable: true,
        discounts: [],
        image: 'product.jpg',
        maximumDiscount: 5,
        updatePrice: 0,
    },
];

export default products;
