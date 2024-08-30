"use client";
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";
import Product from "./interfaces/product.interface";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("No Message");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await apiClient.get("products");
                setProducts(result.data);
                setMessage("Products fetched");
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    async function handleDeleteProduct(_id: any, index: number) {
        const sure = window.confirm("Are you sure to delete the product?");
        if (sure) {
            try {
                const result = await apiClient.delete(`products/${_id}`);
                console.log(result.data);
                setMessage("Product deleted successfully");
                const updatedProducts = products;
                delete updatedProducts[index];
                setProducts(updatedProducts);
            } catch (error) {
                setMessage("Failed to delete product");
                console.log("failed to delete product");
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <Link href="/products/create" className="btn btn-primary">
                    Create
                </Link>
            </div>
            <div className="message">
                <p>{message}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full shadow-md rounded-lg dark:border dark:border-gray-700 border-collapse: separate border-spacing-2 text-sm">
                    <thead>
                        <tr className="text-left bg-gray-100 dark:bg-gray-700">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: Product, index: number) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <td className="py-3 px-4">{product.name}</td>
                                <td className="py-3 px-4">{product.price}</td>
                                <td className="py-3 px-4">
                                    {product.description}
                                </td>
                                <td className="py-3 px-4 flex justify-end space-x-2">
                                    <Link
                                        href={`/products/update/${product._id}`}
                                        className="btn btn-sm btn-secondary"
                                    >
                                        Update
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDeleteProduct(
                                                product._id,
                                                index
                                            )
                                        }
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
