import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import React from "react";

async function CustomerProfile({ params }: any) {
    const { id } = params;

    const { data: customer } = await apiClient.get(`customers/${id}`);
    const { data: sells } = await apiClient.get(`sells/findByCustomer/${id}`);
    const { data: account } = await apiClient.get(
        `accounts/${customer.account}`
    );

    return (
        <main className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300">
            <div className="w-[1000px] mx-auto px-4">
                {/* Customer Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Customer Details */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-6">
                            <img
                                src={`/images/customers/${
                                    customer.image || "customer.jpg"
                                }`}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {customer.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Phone : {customer.phoneNumber}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Address : {customer.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {account.balance >= 0 ? (
                                        <span>
                                            Balance :{" "}
                                            <span className="text-green-500 font-semibold">
                                                {account.balance} ৳
                                            </span>
                                        </span>
                                    ) : (
                                        <span>
                                            Due :{" "}
                                            <span className="text-red-500 font-semibold">
                                                {Math.abs(account.balance)} ৳
                                            </span>
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-end">
                                    Total purchase : <span>? ৳</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sells Section */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        All purchases
                    </h3>
                    <div className="space-y-6">
                        {sells.map((sell: any) => (
                            <div
                                key={sell._id}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                            >
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Seller : {sell.user.name}
                                </p>
                                <div className="space-y-2">
                                    {Object.values(sell.products).map(
                                        (product: any) => (
                                            <div
                                                key={product._id}
                                                className="border-l-4 border-blue-500 pl-4 flex gap-4"
                                            >
                                                <p>
                                                    <span className="font-medium">
                                                        Product Name:
                                                    </span>{" "}
                                                    {product.name}
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        Quantity:
                                                    </span>{" "}
                                                    {product.quantity}
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        Price:
                                                    </span>{" "}
                                                    {product.price} ৳
                                                </p>
                                                <p>
                                                    <span className="font-medium">
                                                        SubTotal:
                                                    </span>{" "}
                                                    {product.subTotal} ৳
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CustomerProfile;
