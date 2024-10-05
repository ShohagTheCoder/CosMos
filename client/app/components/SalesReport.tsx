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
        <div className="bg-gray-900 rounded-lg p-6 shadow-lg mb-6 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">
                Today’s Sales Report
            </h3>
            <div className="grid grid-cols-3 gap-4">
                {/* Paid Box */}
                <div className="relative p-4 bg-green-700 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-gray-100">
                        Paid:{" "}
                        <span className="font-semibold text-white">
                            {todayPaid} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Previous: {previousPaid} ৳
                        <span
                            className={`ml-2 ${
                                growthPaid > 0
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            ({growthPaid.toFixed(1)}%)
                        </span>
                    </p>
                    <div className="w-full h-2 bg-gray-600 rounded mt-2">
                        <div
                            className="bg-green-400 h-full"
                            style={{
                                width: `${
                                    (todayPaid / (previousPaid || 1)) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Due Box */}
                <div className="relative p-4 bg-yellow-600 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-gray-100">
                        Due:{" "}
                        <span className="font-semibold text-white">
                            {todayDue} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Previous: {previousDayData.due} ৳
                    </p>
                    <div className="w-full h-2 bg-gray-600 rounded mt-2">
                        <div
                            className="bg-yellow-400 h-full"
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
                <div className="relative p-4 bg-blue-600 rounded-lg shadow-md overflow-hidden">
                    <p className="text-lg text-gray-100">
                        Total:{" "}
                        <span className="font-semibold text-white">
                            {todayTotal} ৳
                        </span>
                    </p>
                    <p className="text-sm text-gray-300">
                        Previous: {previousDayData.total} ৳
                    </p>
                    <div className="w-full h-2 bg-gray-600 rounded mt-2">
                        <div
                            className="bg-blue-400 h-full"
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
