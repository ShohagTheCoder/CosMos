"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import Units from "../components/Units";
import "./style.css";
import UnitsTab from "../components/UnitsTab";
import { Measurement, Price } from "../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { updateProductField } from "@/app/store/slices/productSlice";

interface Product {
    SKU: string;
    name: string;
    description?: string;
    madeIn?: string;
}

function CreateProduct() {
    const dispatch = useDispatch();
    const product = useSelector((state: any) => state.product);
    const [message, setMessage] = useState("");

    async function createProduct() {
        console.log(product);
        try {
            const result = await apiClient.post("products", product);
            setMessage("Product created successfully!");
            console.log(result.data);
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
                        onChange={(e) =>
                            dispatch(
                                updateProductField({
                                    field: "SKU",
                                    value: e.target.value,
                                })
                            )
                        }
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
                        onChange={(e) =>
                            dispatch(
                                updateProductField({
                                    field: "name",
                                    value: e.target.value,
                                })
                            )
                        }
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
                        onChange={(e) =>
                            dispatch(
                                updateProductField({
                                    field: "description",
                                    value: e.target.value,
                                })
                            )
                        }
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
