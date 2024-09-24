import Link from "next/link";
import React from "react";
import Chart from "./components/Chart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChar";
import Sidebar from "./components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Dashboard() {
    const cookieStore = cookies();
    const userId = cookieStore.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    const data = [
        { label: "January", value: 40 },
        { label: "February", value: 30 },
        { label: "March", value: 60 },
        { label: "April", value: 50 },
        { label: "May", value: 70 },
    ];

    const lineData = [
        { label: "January", value: 40 },
        { label: "February", value: 30 },
        { label: "March", value: 60 },
        { label: "April", value: 50 },
        { label: "May", value: 70 },
    ];

    const pieData = [
        { label: "Apples", value: 40 },
        { label: "Oranges", value: 30 },
        { label: "Bananas", value: 20 },
        { label: "Grapes", value: 10 },
    ];

    return (
        <main className="bg-gray-900">
            <Sidebar active="home" userId={userId} />
            <div className="2xl:container mx-auto py-8 px-4 text-white min-h-screen ps-[100px] 2xl:ps-0">
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <nav className="space-y-4">
                            <Link
                                href="/dashboard"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Dashboard Home
                            </Link>
                            <Link
                                href="/actions/sell"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Sell
                            </Link>
                            <Link
                                href="/sells"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Sells
                            </Link>
                            <Link
                                href="/products"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Products
                            </Link>
                            <Link
                                href="/products/create"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Create Product
                            </Link>
                            <Link
                                href="/customers"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Customers
                            </Link>
                            <Link
                                href="/customers/create"
                                className="block p-3 bg-gray-700 rounded hover:bg-gray-600 transition-all duration-200"
                            >
                                Create Customer
                            </Link>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-9 bg-gray-800 p-6 rounded-lg shadow-lg space-y-8">
                        <div className="flex flex-wrap">
                            <div className="w-1/3 px-4">
                                <h1 className="text-2xl font-bold mb-6">
                                    Monthly Sales
                                </h1>
                                <Chart data={data} />
                            </div>
                            <div className="w-1/3 px-4">
                                <h1 className="text-2xl font-bold mb-6">
                                    Monthly Sales
                                </h1>
                                <LineChart data={lineData} />
                            </div>
                            <div className="w-1/3 px-4">
                                <h1 className="text-2xl font-bold mb-6">
                                    Monthly Sales
                                </h1>
                                <PieChart data={pieData} />
                            </div>
                        </div>
                        {/* Larger Panels */}
                        <div className="grid grid-cols-1 gap-8">
                            <div className="bg-gray-700 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                                <h2 className="text-xl font-bold">
                                    Detailed Overview
                                </h2>
                                <p className="mt-2 text-gray-300">
                                    {/* Add more detailed overview here, e.g., a chart or table */}
                                </p>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                                <h2 className="text-xl font-bold">
                                    Advanced Statistics
                                </h2>
                                <p className="mt-2 text-gray-300">
                                    {/* Add more advanced statistics here, e.g., a line chart or bar chart */}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-500 text-sm">
                    © 2024 Your Company Name. All rights reserved.
                </footer>
            </div>
        </main>
    );
}
