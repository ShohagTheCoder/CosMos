"use client";
import React, { useEffect, useState } from "react";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import apiClient from "@/app/utils/apiClient";
import DatePickerMini from "@/app/components/DatePickerMinit";

export default function ExpensesList() {
    const [expenses, setExpenses] = useState([]);

    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    useEffect(() => {
        apiClient
            .get(
                `/transactions/query?startDate=${startDate}&endDate=${endDate}&action=Cashout`
            )
            .then((res) => {
                console.log(res.data);
                setExpenses(res.data.data);
            });
    }, [startDate, endDate]);

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // Optionally, you can fetch your expenses here based on the new dates
    };

    return (
        <div className="p-4">
            <div className="mt-3">
                {/* Date Picker */}
                <div className="w-full mb-4">
                    <DatePickerMini
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={handleDateChange}
                    />
                </div>

                {/* Expenses Report Section */}
                <div className="bg-gray-900 rounded-lg p-6 shadow-md mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-semibold text-gray-100">
                            Expenses Report
                        </h3>
                        <div className="flex gap-4">
                            <p className="text-gray-300 text-lg">
                                Total:{" "}
                                <span className="font-bold text-blue-500">
                                    {expenses
                                        .reduce(
                                            (acc: number, expense: any) =>
                                                acc + expense.amount,
                                            0
                                        )
                                        .toLocaleString("en-US")}{" "}
                                    ৳
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {expenses.length === 0 ? (
                        <div className="col-span-8 pt-16 flex justify-center">
                            <PulseLoading />
                        </div>
                    ) : (
                        expenses.map((expense: any) => (
                            <div
                                key={expense._id}
                                className="bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-gray-300">
                                            From:
                                        </span>{" "}
                                        {expense.senderName}
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-gray-300">
                                            To:
                                        </span>{" "}
                                        {expense.receiverName || "Unknown"}
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="font-semibold text-gray-300">
                                            Amount:
                                        </span>{" "}
                                        <span className="text-blue-400">
                                            {expense.amount} ৳
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
