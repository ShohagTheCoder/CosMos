"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import Units from "../components/Units";
import "./style.css";
import UnitsTab from "../components/UnitsTab";
import { Measurement, Price } from "../interfaces/product.interface";

interface Product {
    SKU: string;
    name: string;
    prices: Price[];
    units: Record<string, any>;
    measurements: Measurement[];
    description?: string;
    madeIn?: string;
}

function CreateProduct() {
    const [product, setProduct] = useState<Product>({
        SKU: "",
        name: "",
        description: "",
        units: {
            kg: "Hoi",
        },
        prices: [
            {
                unit: "kg",
                max: 0,
                price: 0,
            },
        ],
        measurements: [
            {
                unit: "kg",
                value: 0,
            },
        ],
        // Add initial values for new fields as needed
    });

    // const [basesList, setBasesList] = useState<Record<string, Base>>({});
    // const [unitsList, setUnitsList] = useState({});

    // const [bases, setBases] = useState({});
    // const [units, setUnits] = useState({});
    // const [prices, setPrices] = useState([]);
    // const [measurements, setmeasurements] = useState([]);

    const [message, setMessage] = useState("");

    function updateSKU(e: React.ChangeEvent<HTMLInputElement>) {
        setProduct((prev: any) => ({ ...prev, SKU: e.target.value }));
    }
    function updateName(e: React.ChangeEvent<HTMLInputElement>) {
        setProduct((prev: any) => ({ ...prev, name: e.target.value }));
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setProduct((prev: any) => ({ ...prev, description: e.target.value }));
    }

    function updatePrice(e: React.ChangeEvent<HTMLInputElement>) {
        setProduct((prev: any) => ({
            ...prev,
            price: parseFloat(e.target.value),
        }));
    }

    // useEffect(() => {
    //     async function fetchBasesListAndUnitsList() {
    //         try {
    //             let respose = await apiClient("units");
    //             setBasesList(respose.data.bases);
    //             setUnitsList(respose.data.unist);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     fetchBasesListAndUnitsList();
    // }, []);

    async function createProduct() {
        console.log(product);
        return;
        try {
            const result = await apiClient.post("products", product);
            setMessage("Product created successfully!");
            setProduct(product); // Reset form after success
        } catch (error) {
            setMessage("Failed to create product.");
            console.error(error);
        }
    }

    return (
        <div className="container max-w-[800px] mt-4 mx-auto bg-gray-800 text-white">
            <p className="text-center text-red-500">{message}</p>
            <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        SKU
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={product.SKU}
                        onChange={updateSKU}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={product.name}
                        onChange={updateName}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="description"
                    >
                        Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        value={product.description}
                        onChange={updateDescription}
                    />
                </div>
                <UnitsTab />
                {/* ... other fields and buttons with dark theme styling */}
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onDoubleClick={createProduct}
                >
                    Create Product
                </button>
            </div>
        </div>
    );
}

export default CreateProduct;
