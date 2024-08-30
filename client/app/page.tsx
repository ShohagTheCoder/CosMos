import Image from "next/image";
import Link from "next/link";
import React from "react";
import Chart from "./components/Chart";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChar";

// Replace with your API endpoint
const API_ENDPOINT = "https://your-api-endpoint";

export default function Dashboard() {
    // Assuming you have functions to fetch data from your API
    const fetchSalesData = () => {
        // ... your fetch logic
        return [
            { amount: 100 },
            { amount: 200 },
            // ... more sales data
        ];
    };

    const fetchProductData = () => {
        // ... your fetch logic
        return [
            { price: 29.99 },
            { price: 15.99 },
            // ... more product data
        ];
    };

    const fetchCustomerData = () => {
        // ... your fetch logic
        return [
            { name: "John Doe" },
            { name: "Jane Smith" },
            // ... more customer data
        ];
    };

    // Fetch data and calculate metrics
    const salesData = fetchSalesData();
    const productData = fetchProductData();
    const customerData = fetchCustomerData();

    const totalSales = salesData.reduce((acc, sale) => acc + sale.amount, 0);
    const averageProductPrice =
        productData.reduce((acc, product) => acc + product.price, 0) /
        productData.length;

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
            <div className="2xl:container mx-auto py-8 px-4 text-white min-h-screen">
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
                        {/* Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="bg-gray-700 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                                <h2 className="text-xl font-bold">
                                    Sales Overview
                                </h2>
                                <p className="mt-2 text-gray-300">
                                    Total Sales: ${totalSales.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-gray-700 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
                                <h2 className="text-xl font-bold">
                                    Product Insights
                                </h2>
                                <p className="mt-2 text-gray-300">
                                    Average Product Price: $
                                    {averageProductPrice.toFixed(2)}
                                </p>
                            </div>
                        </div>
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
