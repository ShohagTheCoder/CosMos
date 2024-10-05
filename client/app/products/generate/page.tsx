"use client";
import React, { useEffect, useState } from "react";
import { productNames } from "./data/productNames";
import useNotification from "@/app/hooks/useNotification";
import Notification from "@/app/elements/notification/Notification";
import { productUnits } from "./data/productUnits";

// Helper function to generate random units
const generateRandomUnits = () => {
    const shuffledUnits = productUnits.sort(() => 0.5 - Math.random());
    const selectedUnits = shuffledUnits.slice(
        0,
        Math.floor(Math.random() * 3) + 1
    );
    return selectedUnits.reduce((acc: any, unit) => {
        acc[unit.unit] = { ...unit };
        return acc;
    }, {});
};

// Helper function to generate random prices for selling
const generateRandomPrices = (units: any) => {
    const unitKeys = Object.keys(units);
    const numberOfPrices = Math.floor(Math.random() * 2) + 2; // Generate 2 or 3 prices
    const basePrice = 100 + Math.floor(Math.random() * 200); // Base price for selling

    return unitKeys.slice(0, numberOfPrices).map((unit, idx) => ({
        unit,
        start: idx + 1,
        // Calculate the price for higher quantities by reducing the base price
        price: basePrice - idx * Math.floor(basePrice * 0.1), // Reduce 10% for each higher quantity
    }));
};

// Helper function to generate purchase prices based on selling prices
const generateRelatedPurchasePrices = (sellPrices: any) => {
    return sellPrices.map((sellPrice: any) => {
        // Purchase price is 10% to 20% less than the selling price
        const discount = Math.floor(Math.random() * 11) + 10; // Random discount between 10% to 20%
        const purchasePrice = sellPrice.price * (1 - discount / 100);
        return {
            unit: sellPrice.unit,
            start: sellPrice.start,
            price: parseFloat(purchasePrice.toFixed(2)), // Keep two decimal places for precision
        };
    });
};

// Helper function to generate random measurements
const generateRandomMeasurements = (units: any, type: "sell" | "purchase") => {
    const unitKeys = Object.keys(units);
    const numberOfMeasurements = Math.floor(Math.random() * 3) + 1; // Generate 1, 2, or 3 measurements
    return unitKeys.slice(0, numberOfMeasurements).map((unit, idx) => ({
        unit,
        value: type === "sell" ? idx + 1 : (idx + 1) * 10, // Purchase measurements are larger
    }));
};

// Component to display detailed product information
const ProductGenerator = ({ productNames }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            const generatedProducts = productNames.map(
                (name: string, index: number) => generateProduct(name, index)
            );
            setProducts(generatedProducts);
        }
    }, [isClient]);

    const generateProduct = (name: string, index: number) => {
        const units = generateRandomUnits();
        const sellPrices = generateRandomPrices(units);
        return {
            SKU: `${Math.floor(Math.random() * 1000000)}`,
            name,
            description: `${name} description`,
            image: null,
            units,
            prices: sellPrices, // Selling prices
            purchasePrices: generateRelatedPurchasePrices(sellPrices), // Purchase prices
            measurements: generateRandomMeasurements(units, "sell"), // Retail measurements
            purchaseMeasurements: generateRandomMeasurements(units, "purchase"), // Wholesale measurements
            keywords: ["testy"],
            saleUnitsBase: Object.keys(units)[0],
            price: 300,
            unit: Object.keys(units)[0],
            hasResources: false,
            updatePrice: 0,
            resourcesCost: 0,
            discountEnable: true,
            discount: 0,
            discounts: [],
            extraDiscount: 0,
            sellEnable: true,
            purchaseEnable: true,
            displaySaleUnit: Object.keys(units)[0],
            displayPurchaseUnit: Object.keys(units)[1] || Object.keys(units)[0],
            quantity: 1,
            count: 1,
            priority: 1,
            stockLow: 50,
            stockAlert: 10,
            subTotal: 32,
            maximumDiscount: 4,
            stock: {
                SKU: `${Math.floor(Math.random() * 1000000)}`,
                name,
                stock: 0,
                stockLow: 50,
                stockAlert: 10,
                lastSupplier: "Supplier Name",
                lastStockedDate: new Date().toISOString(),
            },
        };
    };

    if (!isClient) {
        return null; // Render nothing on the server
    }

    return (
        <div className="grid grid-cols-6 gap-3">
            {products.map((product: any) => (
                <div
                    key={product._id}
                    className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                    <img
                        src={`/images/products/${
                            product.image || "product.jpg"
                        }`}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h2 className="font-bold text-lg">{product.name}</h2>
                    <p>{product.description}</p>
                    <p className="mt-2">Price: ${product.price}</p>
                    <p>Stock: {product.stock.stock}</p>

                    {/* Display Product Units */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Units:</h3>
                        <ul className="list-disc list-inside">
                            {Object.keys(product.units).map((unitKey) => (
                                <li key={unitKey}>
                                    {product.units[unitKey].label} -{" "}
                                    {product.units[unitKey].value}{" "}
                                    {product.units[unitKey].unit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Display Prices for Different Units */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Prices:</h3>
                        <ul className="list-disc list-inside">
                            {product.prices.map((price: any, idx: number) => (
                                <li key={idx}>
                                    {price.unit.toUpperCase()}: ${price.price}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Display Purchase Prices for Different Units */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Purchase Prices:</h3>
                        <ul className="list-disc list-inside">
                            {product.purchasePrices.map(
                                (purchasePrice: any, idx: number) => (
                                    <li key={idx}>
                                        {purchasePrice.unit.toUpperCase()}: $
                                        {purchasePrice.price}
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
                        Buy Now
                    </button>
                </div>
            ))}
        </div>
    );
};

// Example usage of the ProductGenerator component
export default function ProductsGeneratePage() {
    const { notification, notifyError, notifySuccess, clearNotifications } =
        useNotification();

    function handleCreateAllProducts() {
        console.log("Create all products");
        notifySuccess("All products created successfully");
        setTimeout(() => {
            clearNotifications();
            window.history.back();
        }, 3000);
    }

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-3 mb-3">
                <h1 className="text-2xl font-bold">Product List</h1>
                <div className="">
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        className="mt-0"
                    />
                </div>
                <div className="flex justify-end items-start">
                    <button
                        onDoubleClick={handleCreateAllProducts}
                        className="bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                        Create All
                    </button>
                </div>
            </div>
            <ProductGenerator productNames={productNames} />
        </div>
    );
}
