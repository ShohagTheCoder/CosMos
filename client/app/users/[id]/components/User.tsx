"use client";
import Sidebar from "@/app/components/Sidebar";
import TransferMoney from "@/app/components/TransferMoney";
import CustomersIcon from "@/app/icons/CustomersIcon";
import React, { useState } from "react";

export default function User({
    user = { name: "unknown" },
    account: initialAccount = { balance: 0 },
    sells = [],
    accounts = [],
}: any) {
    let [account, setAccount] = useState(initialAccount);
    const [tansferMoneyPopup, setTransferMoneyPopup] = useState(false);

    function handleTransferMoney(amount: any) {
        setAccount((account: any) => ({
            ...account,
            balance: account.balance - amount,
        }));
    }

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen py-6">
            {tansferMoneyPopup && (
                <TransferMoney
                    account={account}
                    callback={handleTransferMoney}
                    handleClose={() => setTransferMoneyPopup(false)}
                    accounts={accounts}
                />
            )}
            <Sidebar active="user" userId={user._id} />
            <div className="container max-w-3xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src="/images/users/user.jpg"
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {user.name}
                                </h2>
                                <p className="text-gray-400">Details</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 font-medium text-xl">
                                    {account.balance >= 0 ? (
                                        <>
                                            Balance :{" "}
                                            <span className="text-green-400 font-semibold">
                                                {account.balance} ৳
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Due :{" "}
                                            <span className="text-red-400 font-semibold">
                                                {Math.abs(account.balance)} ৳
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <button
                                    onClick={() => setTransferMoneyPopup(true)}
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
                                <p className="text-lg font-semibold text-gray-100 mb-2 flex gap-3">
                                    <CustomersIcon />
                                    {sell.customer
                                        ? sell.customer.name
                                        : "Unknown"}
                                </p>
                                <div className="my-2 flex gap-3 justify-between bg-gray-900 py-2 px-3">
                                    <p>Paid : {sell.paid} ৳</p>
                                    <p>Due : {sell.due} ৳</p>
                                    <p>Total price : {sell.totalPrice} ৳</p>
                                </div>
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
        </div>
    );
}
