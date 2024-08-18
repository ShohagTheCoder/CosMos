"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import Units from "../components/Units";

interface Product {
    name: string;
    price: number;
    description?: string;
    madeIn?: string;
}

interface Base {
    label: string;
    base: string;
}

function CreateProduct() {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        // Add initial values for new fields as needed
    });

    const [basesList, setBasesList] = useState<Record<string, Base>>({});
    const [unitsList, setUnitsList] = useState({});

    const [bases, setBases] = useState({});
    const [prices, setPrices] = useState({});
    const [measurements, setmeasurements] = useState({});

    const [message, setMessage] = useState("");

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

    useEffect(() => {
        async function fetchBasesListAndUnitsList() {
            try {
                let respose = await apiClient("units");
                console.log(respose.data);
                setBasesList(respose.data.bases);
                setUnitsList(respose.data.unist);
            } catch (error) {
                console.log(error);
            }
        }
        fetchBasesListAndUnitsList();
    }, []);

    async function createProduct() {
        try {
            const result = await apiClient.post("products", product);
            console.log(result.data);
            setMessage("Product created successfully!");
            setProduct({
                name: "",
                description: "",
                price: 0,
            }); // Reset form after success
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
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="price"
                    >
                        Price
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="number"
                        value={product.price}
                        onChange={updatePrice}
                    />
                </div>
                {/* Bases */}
                <div className="bases">
                    <p>Base</p>
                    <select className="bg-black px-3 py-2 my-3">
                        {Object.values(basesList).map((base) => (
                            <option key={base.base} value={base.base}>
                                {base.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Units />
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
