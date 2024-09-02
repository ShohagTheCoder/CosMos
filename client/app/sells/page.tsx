"use client";

import { useEffect, useState } from "react";
import { ProductWithID } from "../products/interfaces/product.interface";
import apiClient from "../utils/apiClient";
import { CartState } from "../store/slices/cartSlice";
import { convertStandardToBnBD } from "../utils/numberFormat";
import Link from "next/link";

export default function Sell() {
    const [sells, setSells] = useState<CartState[]>([]);

    useEffect(() => {
        const fetchSells = async () => {
            try {
                const response = await apiClient("sells");
                const sells = response.data;

                setSells(sells);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSells();
    }, []);

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6">
            <div className="container mx-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th className="py-2 px-4 text-left">Seller</th>
                                <th className="py-2 px-4 text-left">
                                    Customer
                                </th>
                                <th className="py-2 px-4 text-left">
                                    Total Price
                                </th>
                                <th className="py-2 px-4 text-left">Paid</th>
                                <th className="py-2 px-4 text-left">Due</th>
                                <th className="py-2 px-4 text-left">
                                    Products
                                </th>
                                <th className="py-2 px-4 text-left">actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sells.map((sell, key) => (
                                <tr
                                    key={key}
                                    className="border-b border-gray-700 hover:bg-gray-700"
                                >
                                    <td className="py-3 px-4">
                                        {sell.user.name}
                                    </td>
                                    <td className="py-3 px-4">
                                        {sell.customer ? (
                                            <p>{sell.customer.name}</p>
                                        ) : (
                                            <span className="italic text-gray-500">
                                                No Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <p>
                                            {convertStandardToBnBD(
                                                sell.totalPrice
                                            )}{" "}
                                            ৳
                                        </p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p>
                                            {convertStandardToBnBD(sell.paid)} ৳
                                        </p>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p>
                                            {convertStandardToBnBD(sell.due)} ৳
                                        </p>
                                    </td>
                                    <td className="py-3 px-4">
                                        {Object.values(sell.products).map(
                                            (product) => (
                                                <div
                                                    key={product._id}
                                                    className="py-1 flex gap-3"
                                                >
                                                    <p className="font-medium">
                                                        {product.name}
                                                    </p>
                                                    <p className=" text-gray-400">
                                                        {product.quantity}
                                                        {" ("}
                                                        {product.unit} {") "}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                href={`/sells/${sell._id}`}
                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                View
                                            </Link>
                                            <button className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
