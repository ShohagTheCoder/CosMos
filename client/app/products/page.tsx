"use client";
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { Product } from "../interfaces/product.interface";

export default function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await apiClient.get("products");
                setProducts(result.data);
                console.log(result.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="lg:container mx-auto py-4">
            <table className="table-fixed w-full border border-collapse">
                <thead>
                    <tr>
                        <th className="border px-3 py-2">Name</th>
                        <th className="border px-3 py-2">Price</th>
                        <th className="border px-3 py-2">descripttion</th>
                        <th className="border px-3 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: Product) => (
                        <tr key={product._id}>
                            <td className="border px-3 py-2">{product.name}</td>
                            <td className="border px-3 py-2">
                                {product.price}
                            </td>
                            <td className="border px-3 py-2">
                                {product.description}
                            </td>
                            <td className="border px-3 py-2">
                                <button className="border p-1">Update</button>
                                <button className="border p-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
