"use client";
import TansferMoney from "@/app/components/TansferMoney";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Shop() {
    const { id } = useParams();
    const [sells, setSells] = useState([]);
    const [account, setAccount] = useState({ balance: 0 });
    const [tansferMoneyPopup, setTansferMoneyPopup] = useState(false);

    function handleTansferMoney(data: any) {
        setTansferMoneyPopup(false);
    }

    useEffect(() => {
        apiClient.get("sells").then((res) => setSells(res.data));
        apiClient.get(`accounts/${id}`).then((res) => setAccount(res.data));
    }, []);

    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen py-6">
            {tansferMoneyPopup && (
                <TansferMoney
                    account={account}
                    callback={handleTansferMoney}
                    handleClose={() => setTansferMoneyPopup(false)}
                />
            )}

            <div className="container max-w-3xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src="/profile-picture.jpg"
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Shop Owner
                                </h2>
                                <p className="text-gray-400">Owner Details</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 font-medium">
                                    {account.balance >= 0 ? (
                                        <>
                                            Balance:{" "}
                                            <span className="text-green-400 font-semibold">
                                                {account.balance} ৳
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Due:{" "}
                                            <span className="text-red-400 font-semibold">
                                                {Math.abs(account.balance)} ৳
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-medium">
                                    Sells:{" "}
                                    <span className="font-semibold">
                                        {account.balance} ৳
                                    </span>
                                </p>
                            </div>
                            <div className="col-span-2">
                                <button
                                    onClick={() => setTansferMoneyPopup(true)}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-300"
                                >
                                    Send Money
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sells Information */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-100 mb-4">
                        All Sells
                    </h3>
                    <div className="space-y-4">
                        {sells.map((sell: any) => (
                            <div
                                key={sell._id}
                                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                            >
                                <p className="text-lg font-semibold text-gray-100 mb-2">
                                    Seller: {sell.user.name}
                                </p>
                                <div className="space-y-2">
                                    {Object.values(sell.products).map(
                                        (product: any) => (
                                            <div
                                                key={product._id}
                                                className="border-l-4 border-blue-500 pl-4 flex gap-4"
                                            >
                                                <p>
                                                    <span className="font-medium text-gray-400">
                                                        Product Name:
                                                    </span>{" "}
                                                    {product.name}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-400">
                                                        Quantity:
                                                    </span>{" "}
                                                    {product.quantity}
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-400">
                                                        Price:
                                                    </span>{" "}
                                                    {product.price} ৳
                                                </p>
                                                <p>
                                                    <span className="font-medium text-gray-400">
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
