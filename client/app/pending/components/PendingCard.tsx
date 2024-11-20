"use client";
import TrashIcon from "@/app/icons/TrashIcon";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import React from "react";

export default function PendingCard({ sells }: { sells: CartState[] }) {
    const handleDeletePendingSell = async (id: string) => {
        try {
            await apiClient.delete(`sells/${id}`);
            console.log("Pending sell deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete pending sell", error);
        }
    };

    function getDate(inputDate: Date) {
        const date = new Date(inputDate); // Use a different name or directly use inputDate

        // Get the parts of the date
        const day = date.toLocaleString("en-US", { weekday: "long" }); // e.g., "Tuesday"
        const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "November"
        const dayOfMonth = date.getDate(); // e.g., 19
        const year = date.getFullYear(); // e.g., 2024

        // Format the date
        return `${day}, ${month} ${dayOfMonth}, ${year}`;
    }

    function getTime(inputDate: Date): string {
        const date = new Date(inputDate);

        let hours = date.getHours(); // Get the hour (0-23)
        const minutes = date.getMinutes(); // Get the minutes (0-59)
        const period = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

        // Convert to 12-hour format
        hours = hours % 12 || 12; // Converts 0 to 12 for midnight

        // Add leading zero to minutes if needed
        const formattedMinutes = minutes.toString().padStart(2, "0");

        // Format the time
        return `${hours}:${formattedMinutes} ${period}`;
    }

    return (
        <div>
            {sells.map((sell: CartState) => (
                <div
                    onClick={() => {
                        window.location.href = `/restaurant/${sell._id}`;
                    }}
                    key={sell._id}
                    className="bg-gray-800 hover:bg-blue-900 text-white p-4 rounded-md shadow-lg flex flex-col"
                >
                    <div className="mb-3 flex gap-3">
                        <div className="h-10 w-10 bg-blue-800 rounded-md flex justify-center items-center">
                            <p className="font-bold text-lg leading-none mb-0 h-[14px]">
                                {sell._id
                                    .slice(-2, sell._id.lenght)
                                    .toUpperCase()}
                            </p>
                        </div>

                        <div className="flex flex-col justify-between">
                            <p>{sell.customer?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-300">
                                {sell.customer?.phoneNumber || "..."}
                            </p>
                        </div>
                        <div className="ms-auto">
                            <button
                                className="hover:bg-red-800 h-10 w-10 rounded-lg bg-gray-700 flex justify-center items-center"
                                onDoubleClick={(e) => {
                                    e.preventDefault();
                                    handleDeletePendingSell(sell._id);
                                }}
                            >
                                <TrashIcon height="18" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between mb-2">
                        <p className="text-sm text-gray-300">
                            {getDate(sell.createdAt)}
                        </p>
                        <p className="text-sm text-gray-300">
                            {getTime(sell.createdAt)}
                        </p>
                    </div>
                    <div className="border-y border-gray-600 py-3 mb-3 flex-grow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-gray-300">Item</th>
                                    <th className="px-3 text-gray-300">Qty</th>
                                    <th className="text-right text-gray-300">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(sell.products).map(
                                    (product: ProductWithID) => (
                                        <tr key={product._id}>
                                            <td className="py-2">
                                                {product.name.length > 14
                                                    ? product.name.slice(
                                                          0,
                                                          14
                                                      ) + ".."
                                                    : product.name}
                                            </td>
                                            <td className="py-2 px-3">
                                                {product.quantity}{" "}
                                                {product.unit}
                                            </td>
                                            <td className="text-right">
                                                {product.price} ৳
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center rounded-md">
                        <p className="font-semibold">Total :</p>
                        <p className="text-xl font-semibold">
                            {sell.totalPrice} ৳
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
