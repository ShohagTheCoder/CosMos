"use client";
import Cashout from "@/app/components/Cashout";
import TransferMoney from "@/app/components/TransferMoney";
import CustomersIcon from "@/app/icons/CustomersIcon";
import UserIcon from "@/app/icons/UserIcon";
import React, { useState } from "react";

export default function Shop({
    shop: initialShop,
    sells: initialSells,
    accounts = [],
}: any) {
    const [shop, setShop] = useState(initialShop);
    const [sells, setSells] = useState(initialSells);
    const [account, setAccount] = useState(shop.account);
    const [tansferMoneyPopup, setTransferMoneyPopup] = useState(false);
    const [cashoutPopup, setCashoutPopup] = useState(false);

    function handleTransferMoney(amount: any) {
        setAccount((account: any) => ({
            ...account,
            balance: account.balance - amount,
        }));
    }

    function handleCashout(data: any) {
        // Update the account balance in the state
        const updatedAccount = {
            ...account,
            balance: account.balance - data.amount,
        };
        setAccount(updatedAccount);

        // Update the shop state with the new account balance
        setShop((prevShop: any) => ({
            ...prevShop,
            account: updatedAccount,
        }));

        setTimeout(() => {
            setCashoutPopup(false);
        }, 3000);
    }

    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen py-6">
            {tansferMoneyPopup && (
                <TransferMoney
                    accounts={accounts}
                    account={account}
                    callback={handleTransferMoney}
                    handleClose={() => setTransferMoneyPopup(false)}
                />
            )}
            {cashoutPopup && (
                <Cashout
                    account={shop.account}
                    callback={handleCashout}
                    handleClose={() => setCashoutPopup(!cashoutPopup)}
                />
            )}

            <div className="container max-w-3xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src={`/images/users/${
                                    shop.image || "user.jpg"
                                }`}
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
                                        {sells.reduce(
                                            (acc: number, sell: any) =>
                                                acc + sell.totalPrice,
                                            0
                                        )}{" "}
                                        ৳
                                    </span>
                                </p>
                            </div>
                            <div className="col-span-2 flex gap-3">
                                <button
                                    onClick={() => setTransferMoneyPopup(true)}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-300"
                                >
                                    Send Money
                                </button>
                                <button
                                    onClick={() => setCashoutPopup(true)}
                                    className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-700 text-white rounded-md font-medium transition duration-300"
                                >
                                    Cash out
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
                                <div className="flex justify-between">
                                    <p className="text-lg font-semibold text-gray-100 mb-2 flex gap-3">
                                        <UserIcon /> {sell.user.name}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-100 mb-2 flex gap-3">
                                        <CustomersIcon />
                                        {sell.customer
                                            ? sell.customer.name
                                            : "Unknown"}
                                    </p>
                                </div>
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
        </main>
    );
}
