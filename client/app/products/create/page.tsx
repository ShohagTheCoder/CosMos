"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

export interface Product {
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
}

function CreateProduct() {
    const [product, setProduct] = useState<Product>({
        name: "Name",
        description: "description",
        price: 0,
    });

    const [message, setMessage] = useState("No message");

    function updateName(e: any) {
        setProduct((prev) => ({
            ...prev,
            name: e.target.value,
        }));
    }
    function updateDescription(e: any) {
        setProduct((prev) => ({
            ...prev,
            description: e.target.value,
        }));
    }
    function updatePrice(e: any) {
        setProduct((prev) => ({
            ...prev,
            price: e.target.value,
        }));
    }

    async function createProduct() {
        try {
            const result = await apiClient.post("products", product);
            console.log(result.data);
            setMessage("Product created successfully");
        } catch (error) {
            setMessage("Fail to create product");
        }
    }

    return (
        <div className="lg:container mx-auto py-4">
            <p>{message}</p>
            <div className="input-grup flex gap-3">
                <p>Name : </p>
                <input
                    className="bg-black text-white border"
                    type="text"
                    value={product.name}
                    onChange={updateName}
                />
            </div>
            <div className="input-grup flex gap-3 mt-3">
                <p>Description</p>
                <input
                    className="bg-black text-white border"
                    type="text"
                    value={product.description}
                    onChange={updateDescription}
                />
            </div>
            <div className="input-grup flex gap-3 mt-3">
                <p>Price : </p>
                <input
                    className="bg-black text-white border"
                    type="text"
                    value={product.price}
                    onChange={updatePrice}
                />
            </div>
            <div className="create-product">
                <button
                    onDoubleClick={createProduct}
                    className="border px-2 py-1 mt-3"
                >
                    Create Product
                </button>
            </div>
        </div>
    );
}

export default CreateProduct;
