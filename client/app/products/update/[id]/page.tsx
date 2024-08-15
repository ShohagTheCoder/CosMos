"use client";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Product {
    name: string;
    price: number;
    description?: string;
    madeIn?: string;
}

function UpdateProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>({
        name: "",
        description: "",
        price: 0,
        // Add initial values for new fields as needed
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await apiClient.get(`products/${id}`);
                setProduct(result.data);
            } catch (error) {
                console.log(error);
                setMessage("Something went wrong");
            }
        };

        fetchProduct();
    }, [id]);

    const [message, setMessage] = useState("");

    function updateName(e: React.ChangeEvent<HTMLInputElement>) {
        setProduct((prev) => ({ ...prev, name: e.target.value }));
    }

    function updateDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setProduct((prev) => ({ ...prev, description: e.target.value }));
    }

    function updatePrice(e: React.ChangeEvent<HTMLInputElement>) {
        setProduct((prev) => ({ ...prev, price: parseFloat(e.target.value) }));
    }

    async function updateProduct() {
        try {
            const result = await apiClient.put(`products/${id}`, product);
            console.log(result.data);
            setMessage("Product updated successfully!");
            setProduct({
                name: "",
                description: "",
                price: 0,
            }); // Reset form after success
        } catch (error) {
            setMessage("Failed to update product.");
            console.error(error);
        }
    }

    return (
        <div className="container max-w-[1000px] mt-4 mx-auto p-4 bg-gray-800 text-white">
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
                {/* ... other fields and buttons with dark theme styling */}
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={updateProduct}
                >
                    Update Product
                </button>
            </div>
        </div>
    );
}

export default UpdateProduct;
