"use client";
import React, { useEffect, useState } from "react";
import apiCall from "../common/apiCall";

// Define the Transaction interface
interface Transaction {
    _id: string;
    senderName: string;
    receiverName: string;
    amount: number;
    senderNewBalance: number;
    receiverNewBalance: number;
    action: string;
    note: string;
    date: string; // Store the date as a string
}

export default function TransactionsPage() {
    // Use the Transaction[] type for the transactions state
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        // Fetch transactions when the component loads
        // fetchTransactions().then((data) => setTransactions(data));\
        apiCall.get("transactions").success((data) => {
            console.log(data);
            setTransactions(data);
        });
    }, []);

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
            <div className="container max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Transactions</h1>

                {/* Transactions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
                        >
                            {/* Header Section */}
                            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                                <div>
                                    <p className="text-lg font-semibold">
                                        {transaction.senderName}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        to {transaction.receiverName}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-green-400">
                                        {transaction.amount} ৳
                                    </p>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="text-gray-400 space-y-2">
                                <p>
                                    <span className="font-medium text-gray-300">
                                        Action:
                                    </span>{" "}
                                    {transaction.action}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-300">
                                        Note:
                                    </span>{" "}
                                    {transaction.note || "N/A"}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-300">
                                        Sender Balance:
                                    </span>{" "}
                                    {transaction.senderNewBalance} ৳
                                </p>
                                <p>
                                    <span className="font-medium text-gray-300">
                                        Receiver Balance:
                                    </span>{" "}
                                    {transaction.receiverNewBalance} ৳
                                </p>
                                <p className="text-xs text-gray-500">
                                    Date:{" "}
                                    {new Date(
                                        transaction.date
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
