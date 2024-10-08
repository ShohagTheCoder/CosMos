import React from "react";

function SalesReport({ sells, previousDayData }: any) {
    const todayPaid = sells.reduce(
        (acc: number, sell: any) => acc + sell.paid,
        0
    );
    const todayDue = sells.reduce(
        (acc: number, sell: any) => acc + sell.due,
        0
    );
    const todayTotal = sells.reduce(
        (acc: number, sell: any) => acc + sell.totalPrice,
        0
    );

    const previousPaid = previousDayData.paid;
    const growthPaid = ((todayPaid - previousPaid) / previousPaid) * 100 || 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mb-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Today’s Sales Report
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {/* Paid Box */}
                <div className="relative p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-green-700 dark:text-green-400">
                        Paid:{" "}
                        <span className="font-semibold text-green-800 dark:text-green-200">
                            {todayPaid} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Previous: {previousPaid} ৳
                        <span
                            className={`ml-2 ${
                                growthPaid > 0
                                    ? "text-green-600 dark:text-green-300"
                                    : "text-red-600 dark:text-red-300"
                            }`}
                        >
                            ({growthPaid.toFixed(1)}%)
                        </span>
                    </p>
                    <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded mt-2">
                        <div
                            className="bg-green-500 dark:bg-green-400 h-full"
                            style={{
                                width: `${
                                    (todayPaid / (previousPaid || 1)) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Due Box */}
                <div className="relative p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-yellow-700 dark:text-yellow-400">
                        Due:{" "}
                        <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                            {todayDue} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Previous: {previousDayData.due} ৳
                    </p>
                    <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded mt-2">
                        <div
                            className="bg-yellow-500 dark:bg-yellow-400 h-full"
                            style={{
                                width: `${
                                    (todayDue / (previousDayData.due || 1)) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Total Box */}
                <div className="relative p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-blue-700 dark:text-blue-400">
                        Total:{" "}
                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                            {todayTotal} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Previous: {previousDayData.total} ৳
                    </p>
                    <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded mt-2">
                        <div
                            className="bg-blue-500 dark:bg-blue-400 h-full"
                            style={{
                                width: `${
                                    (todayTotal /
                                        (previousDayData.total || 1)) *
                                    100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesReport;
