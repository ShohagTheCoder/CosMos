"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SalesReport from "./SalesReport";
import apiClient from "../utils/apiClient";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { lineData } from "../data/lineData";

export default function Dashbaord() {
    const [sells, setSells] = useState([]);
    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    useEffect(() => {
        apiClient
            .get(`/sells/query?startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                setSells(res.data.data);
            });
    }, [startDate, endDate]);

    const data = [
        {
            country: "USA",
            burgers: 120,
        },
        {
            country: "Germany",
            burgers: 90,
        },
        {
            country: "France",
            burgers: 70,
        },
        {
            country: "USAs",
            burgers: 120,
        },
        {
            country: "Germanys",
            burgers: 90,
        },
        {
            country: "Franced",
            burgers: 70,
        },
        {
            country: "USAg",
            burgers: 120,
        },
        {
            country: "Germanygh",
            burgers: 90,
        },
        {
            country: "Francee",
            burgers: 70,
        },
    ];

    return (
        <main className="bg-white text-black dark:text-white dark:bg-gray-900">
            <div className="container mx-auto py-8 px-4 min-h-screen ps-[94px]">
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
                    <div
                        style={{ height: "400px" }}
                        className="border border-gray-500 bg-gray-950 mb-4"
                    >
                        <ResponsiveLine
                            data={lineData}
                            margin={{
                                top: 50,
                                right: 110,
                                bottom: 50,
                                left: 60,
                            }}
                            xScale={{ type: "point" }}
                            yScale={{
                                type: "linear",
                                min: "auto",
                                max: "auto",
                                stacked: true,
                                reverse: false,
                            }}
                            yFormat=" >-.2f"
                            axisTop={null}
                            axisRight={null}
                            pointSize={6}
                            pointColor={{ theme: "background" }}
                            pointBorderWidth={1}
                            pointBorderColor={{ from: "serieColor" }}
                            pointLabel="data.yFormatted"
                            pointLabelYOffset={-12}
                            enableTouchCrosshair={true}
                            useMesh={true}
                            legends={[
                                {
                                    anchor: "bottom-right",
                                    direction: "column",
                                    justify: false,
                                    translateX: 100,
                                    translateY: 0,
                                    itemsSpacing: 0,
                                    itemDirection: "left-to-right",
                                    itemWidth: 80,
                                    itemHeight: 20,
                                    itemOpacity: 0.75,
                                    symbolSize: 12,
                                    symbolShape: "circle",
                                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                                    itemTextColor: "#fff", // Whiter legend text in the box
                                    effects: [
                                        {
                                            on: "hover",
                                            style: {
                                                itemBackground:
                                                    "rgba(0, 0, 0, .03)",
                                                itemOpacity: 1,
                                            },
                                        },
                                    ],
                                },
                            ]}
                            theme={{
                                axis: {
                                    ticks: {
                                        text: {
                                            fill: "#fff", // Whiter tick text
                                        },
                                    },
                                    legend: {
                                        text: {
                                            fill: "#fff", // Whiter axis legends
                                        },
                                    },
                                },
                                grid: {
                                    line: {
                                        stroke: "rgba(255, 255, 255, 0.2)", // Subtle grid lines for contrast
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="p-6 bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg space-y-8">
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
