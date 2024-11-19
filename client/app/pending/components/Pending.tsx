"use client";
import TrashIcon from "@/app/icons/TrashIcon";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import React from "react";

export default function Pending({ sells }: { sells: CartState[] }) {
    const handleDeletePendingSell = async (id: string) => {
        try {
            await apiClient.delete(`sells/${id}`);
            console.log("Pending sell deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete pending sell", error);
        }
    };

    if (sells.length === 0) {
        return (
            <div className="container mx-auto h-screen flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-gray-600 text-lg">
                        No pending sells found
                    </p>
                    <a
                        href="/restaurant"
                        className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition duration-200"
                    >
                        Start Selling
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sells.map((sell: CartState) => (
                        <div
                            key={sell._id}
                            className="bg-gray-700 text-white p-4 rounded-md shadow-lg flex flex-col"
                        >
                            <div className="mb-3 flex justify-between">
                                <p className="font-bold">Customer :</p>
                                <p>{sell.customer?.name || "Unknown"}</p>
                            </div>
                            <div className="bg-gray-800 py-2 px-3 rounded-md mb-3 space-y-3 flex-grow">
                                {Object.values(sell.products).map(
                                    (product: ProductWithID) => (
                                        <div
                                            key={product._id}
                                            className="flex justify-between"
                                        >
                                            <p>{product.name}</p>
                                            <p>
                                                {product.quantity}{" "}
                                                {product.unit}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-3">
                                <p className="font-bold">Total :</p>
                                <p>{sell.totalPrice} ৳</p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={`/restaurant/${sell._id}`}
                                    className="flex-1 bg-gray-800 hover:bg-green-700 text-white py-2 px-3 rounded-md text-center transition duration-200"
                                >
                                    View
                                </a>
                                <button
                                    onDoubleClick={() =>
                                        handleDeletePendingSell(sell._id)
                                    }
                                    className="bg-red-900 text-white py-2 px-3 rounded-md hover:bg-red-700 transition duration-200"
                                    title="Double-click to delete"
                                >
                                    <TrashIcon height="18" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
