"use client";
import React, { useEffect, useState } from "react";
import { productNames } from "./data/productNames";
import useNotification from "@/app/hooks/useNotification";
import Notification from "@/app/elements/notification/Notification";
import { productUnits } from "./data/productUnits";
import apiCall from "@/app/common/apiCall";

type ProductUnitCategory = "weight" | "pieces" | "volume";

// Define the main units to always include per category
const mainUnits: Record<ProductUnitCategory, string> = {
    weight: "kg",
    pieces: "pcs",
    volume: "ltr",
};

const generateRandomUnits = () => {
    // Define the available categories
    const categories: ProductUnitCategory[] = Object.keys(
        productUnits
    ) as ProductUnitCategory[];

    // Randomly select a category
    const randomCategory: ProductUnitCategory =
        categories[Math.floor(Math.random() * categories.length)];

    // Get the units for the selected category
    const units = productUnits[randomCategory];

    // Get the keys of the units as an array of strings
    let unitKeys = Object.keys(units) as Array<keyof typeof units>;

    // Select a subset of keys (1 to 3) while ensuring the main unit is kept
    const selectedUnits = unitKeys.slice(
        0,
        Math.max(2, Math.floor(Math.random() * 3) + 1)
    );

    // Ensure the main unit for the selected category is included
    const mainUnitKey = mainUnits[randomCategory];
    if (!unitKeys.includes(mainUnitKey)) {
        unitKeys.push(mainUnitKey as keyof typeof units);
    }

    // Reduce the selected keys to an object with their corresponding data
    return {
        units: selectedUnits.reduce((acc: any, unitKey) => {
            // Assign the unit data to the accumulator using the key
            acc[unitKey] = units[unitKey]; // Spread the unit object
            return acc;
        }, {}),
        category: randomCategory,
    };
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
            price: Math.ceil(purchasePrice), // Keep two decimal places for precision
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
const ProductGenerator = ({ productNames, products, setProducts }: any) => {
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
        const { units, category } = generateRandomUnits();
        const sellPrices = generateRandomPrices(units);
        const SKU = `${Math.floor(Math.random() * 1000000)}`;

        // Determine the sale base unit based on the units' category
        const unitKeys = Object.keys(units);
        const firstUnitKey = unitKeys[0];

        return {
            SKU: SKU,
            name,
            description: `${name} description`,
            image: null,
            units,
            prices: sellPrices, // Selling prices
            purchasePrices: generateRelatedPurchasePrices(sellPrices), // Purchase prices
            measurements: generateRandomMeasurements(units, "sell"), // Retail measurements
            purchaseMeasurements: generateRandomMeasurements(units, "purchase"), // Wholesale measurements
            keywords: ["testy"],
            saleUnitsBase: mainUnits[category], // Set the determined sale base unit
            price: sellPrices[0].price,
            unit: firstUnitKey, // Use the first unit key
            displaySaleUnit: firstUnitKey, // Use the first unit key for display
            displayPurchaseUnit: unitKeys[1] || firstUnitKey, // Use the second unit key if available
        };
    };

    if (!isClient) {
        return null; // Render nothing on the server
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {products.slice(0, 10).map((product: any) => (
                <div
                    key={product.SKU}
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

                    {/* Display Product Units */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Units:</h3>
                        <ul className="list-disc list-inside">
                            {Object.keys(product.units).map((unitKey) => (
                                <li key={unitKey}>
                                    {product.units[unitKey].label} -{" "}
                                    {product.units[unitKey].value}{" "}
                                    {product.saleUnitsBase}
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
    const [products, setProducts] = useState<any[]>([]);
    const { notification, notifyError, notifySuccess, clearNotifications } =
        useNotification();

    const CHUNK_SIZE = 100; // Maximum number of products per request

    function handleCreateAllProducts() {
        const productChunks = []; // Array to hold product chunks

        // Split the products into chunks of CHUNK_SIZE
        for (let i = 0; i < products.length; i += CHUNK_SIZE) {
            productChunks.push(products.slice(i, i + CHUNK_SIZE));
        }

        // Function to create products in chunks
        const createProductsInChunks = async (chunks: any) => {
            for (const chunk of chunks) {
                apiCall
                    .post("/products/createMany", chunk)
                    .success((_, message) => {
                        notifySuccess(message); // Assuming the success message is in the response
                    })
                    .error((error) => {
                        notifyError(error.message);
                    });
            }
        };

        // Execute the chunked requests
        createProductsInChunks(productChunks).then(() => {
            setTimeout(() => {
                clearNotifications();
                // window.history.back();
            }, 3000);
        });
    }
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-3 mb-3">
                <h1 className="text-2xl font-bold">
                    Product List ({productNames.length}) Products
                </h1>
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
            <ProductGenerator
                productNames={productNames}
                products={products}
                setProducts={setProducts}
            />
        </div>
    );
}
