"use client";
import Sidebar from "@/app/components/Sidebar";
import TransferMoney from "@/app/components/TransferMoney";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";

export default function User({
    user = { name: "unknown" },
    account: initialAccount = { balance: 0 },
    accounts = [],
}: any) {
    const [sells, setSells] = useState([]);
    const [account, setAccount] = useState(initialAccount);
    const [tansferMoneyPopup, setTransferMoneyPopup] = useState(false);
    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    function handleTransferMoney(amount: any) {
        setAccount((account: any) => ({
            ...account,
            balance: account.balance - amount,
        }));
    }

    useEffect(() => {
        apiClient
            .get(`/sells/query?startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                setSells(res.data.data);
            });
    }, [startDate, endDate]);

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // Optionally, you can fetch your sells here based on the new dates
    };

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
            <div className="container max-w-4xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
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
                        <div className="flex flex-col gap-3">
                            <div className="flex">
                                <p className="text-gray-400 font-medium text-xl">
                                    {account.balance >= 0 ? (
                                        <>
                                            Balance :{" "}
                                            <span className="text-green-400 font-semibold">
                                                {account.balance.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                ৳
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Balance :{" "}
                                            <span className="text-red-400 font-semibold">
                                                {account.balance.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                ৳
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
            </div>
        </div>
    );
}
