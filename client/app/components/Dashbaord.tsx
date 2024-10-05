"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import apiCall from "../common/apiCall";
import SalesReport from "./SalesReport";

export default function Dashbaord() {
    const [sells, setSells] = useState([]);
    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    useEffect(() => {
        apiCall
            .get(`/sells/query?startDate=${startDate}&endDate=${endDate}`)
            .success((data) => {
                setSells(data);
            });
    }, [startDate, endDate]);

    return (
        <main className="bg-gray-900">
            <div className="container mx-auto py-8 px-4 text-white min-h-screen ps-[94px]">
                {/* Top Navigation Bar */}
                <div className="flex justify-between items-center mb-8">
                    <div className="text-3xl font-bold">Dashboard</div>
                    <div className="space-x-4">
                        <Link
                            href="/profile"
                            className="hover:text-gray-400 transition-colors duration-200"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/settings"
                            className="hover:text-gray-400 transition-colors duration-200"
                        >
                            Settings
                        </Link>
                        <Link
                            href="/logout"
                            className="hover:text-red-400 transition-colors duration-200"
                        >
                            Logout
                        </Link>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1">
                    {/* Main Content */}
                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="">
                                <SalesReport
                                    sells={sells}
                                    previousDayData={{
                                        paid: 700,
                                        due: 300,
                                        total: 1000,
                                    }}
                                />
                            </div>
                            <div className="">
                                <SalesReport
                                    sells={sells}
                                    previousDayData={{
                                        paid: 700,
                                        due: 300,
                                        total: 1000,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-500 text-sm">
                    © 2024 Your Company Name. All rights reserved.
                </footer>
            </div>
        </main>
    );
}
