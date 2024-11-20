"use client";
import { CartState } from "@/app/store/slices/cartSlice";
import React from "react";
import PendingCard from "./PendingCard";

export default function Pending({ sells }: { sells: CartState[] }) {
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
        <div className="p-4 select-none">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <PendingCard sells={sells} />
                </div>
            </div>
        </div>
    );
}
