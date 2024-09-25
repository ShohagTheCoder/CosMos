"use client";
import Sidebar from "@/app/components/Sidebar";
import { Customer } from "@/app/interfaces/customer.inerface";
import React from "react";

function Customers({
    customers,
    userId,
}: {
    customers: Customer[];
    userId: string;
}) {
    return (
        <div className="py-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300 ps-[94px] pe-4 2xl:px-0">
            <Sidebar userId={userId} active="customers" />
            <div className="container mx-auto">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
                    Customers
                </h1>

                {/* Customers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {customers.map((customer: Customer, key) => (
                        <div
                            key={key}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="mb-4">
                                <img
                                    src={`/images/customers/${
                                        customer.image || "customer.jpg"
                                    }`}
                                    alt="Profile"
                                    className="h-20 w-20 rounded-full object-cover mb-3"
                                />
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

                            {/* Action Buttons */}
                            <div className="flex justify-between">
                                {/* View Button */}
                                <a
                                    href={`customers/${customer._id}`}
                                    className="py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                                >
                                    View
                                </a>

                                {/* Edit Button */}
                                <a
                                    href={`customers/update/${customer._id}`}
                                    className="py-2 px-4 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                                >
                                    Edit
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Customers;
