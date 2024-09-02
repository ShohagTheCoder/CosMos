"use client";
import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function SellView() {
    const { id } = useParams();
    const [sell, setSell] = useState<CartState>();

    useEffect(() => {
        apiClient
            .get(`/sells/${id}`)
            .then((res) => {
                console.log(res.data);
                setSell(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    if (!sell) return "";

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6">
            <div className="container mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-700">
                        <h2 className="text-3xl font-bold mb-2">
                            Sale Details
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <h3 className="text-lg font-semibold">
                                    Seller:
                                </h3>
                                <p className="text-gray-300">
                                    {sell.user.name}
                                </p>
                            </div>
                            {sell.customer && (
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-lg font-semibold">
                                        Customer:
                                    </h3>
                                    <p className="text-gray-300">
                                        {sell.customer.name}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="overflow-x-auto rounded-lg shadow-md bg-gray-700">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left border-b border-gray-600 bg-gray-800 text-sm font-medium">
                                            Product Name
                                        </th>
                                        <th className="px-4 py-2 text-left border-b border-gray-600 bg-gray-800 text-sm font-medium">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(sell.products).map(
                                        (product) => (
                                            <tr
                                                key={product._id}
                                                className="border-b border-gray-700"
                                            >
                                                <td className="px-4 py-2 text-gray-200">
                                                    {product.name}
                                                </td>
                                                <td className="px-4 py-2 text-gray-200">
                                                    {product.quantity}{" "}
                                                    {product.unit}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <p className="text-xl font-semibold">
                                    Total Price:
                                </p>
                                <p className="text-gray-300">
                                    {sell.totalPrice} ৳
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-semibold">Paid:</p>
                                <p className="text-gray-300">{sell.paid} ৳</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-semibold">Due:</p>
                                <p className="text-gray-300">{sell.due} ৳</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SellView;
