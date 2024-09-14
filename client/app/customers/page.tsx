"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { Customer } from "../interfaces/customer.inerface";
import Link from "next/link";

function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);

    useEffect(() => {
        apiClient.get("customers").then((res) => setCustomers(res.data));
    }, []);

    return (
        <main className="py-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    Customers
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer: Customer, key) => (
                        <div
                            key={key}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {customer.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {customer.address}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {customer.phoneNumber}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    href={`customers/update/${customer._id}`}
                                    className="py-2 px-4 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Customers;
