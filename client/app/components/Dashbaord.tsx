"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SalesReport from "./SalesReport";
import apiClient from "../utils/apiClient";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";

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

    const lineData = [
        {
            id: "japan",
            color: "hsl(296, 70%, 50%)",
            data: [
                {
                    x: "plane",
                    y: 79,
                },
                {
                    x: "helicopter",
                    y: 21,
                },
                {
                    x: "boat",
                    y: 96,
                },
                {
                    x: "train",
                    y: 69,
                },
                {
                    x: "subway",
                    y: 60,
                },
                {
                    x: "bus",
                    y: 274,
                },
                {
                    x: "car",
                    y: 88,
                },
                {
                    x: "moto",
                    y: 252,
                },
                {
                    x: "bicycle",
                    y: 251,
                },
                {
                    x: "horse",
                    y: 253,
                },
                {
                    x: "skateboard",
                    y: 298,
                },
                {
                    x: "others",
                    y: 142,
                },
            ],
        },
        {
            id: "france",
            color: "hsl(12, 70%, 50%)",
            data: [
                {
                    x: "plane",
                    y: 114,
                },
                {
                    x: "helicopter",
                    y: 26,
                },
                {
                    x: "boat",
                    y: 99,
                },
                {
                    x: "train",
                    y: 258,
                },
                {
                    x: "subway",
                    y: 7,
                },
                {
                    x: "bus",
                    y: 77,
                },
                {
                    x: "car",
                    y: 157,
                },
                {
                    x: "moto",
                    y: 195,
                },
                {
                    x: "bicycle",
                    y: 63,
                },
                {
                    x: "horse",
                    y: 178,
                },
                {
                    x: "skateboard",
                    y: 17,
                },
                {
                    x: "others",
                    y: 278,
                },
            ],
        },
        {
            id: "us",
            color: "hsl(136, 70%, 50%)",
            data: [
                {
                    x: "plane",
                    y: 186,
                },
                {
                    x: "helicopter",
                    y: 89,
                },
                {
                    x: "boat",
                    y: 106,
                },
                {
                    x: "train",
                    y: 234,
                },
                {
                    x: "subway",
                    y: 98,
                },
                {
                    x: "bus",
                    y: 51,
                },
                {
                    x: "car",
                    y: 6,
                },
                {
                    x: "moto",
                    y: 269,
                },
                {
                    x: "bicycle",
                    y: 29,
                },
                {
                    x: "horse",
                    y: 73,
                },
                {
                    x: "skateboard",
                    y: 209,
                },
                {
                    x: "others",
                    y: 73,
                },
            ],
        },
        {
            id: "germany",
            color: "hsl(72, 70%, 50%)",
            data: [
                {
                    x: "plane",
                    y: 58,
                },
                {
                    x: "helicopter",
                    y: 150,
                },
                {
                    x: "boat",
                    y: 201,
                },
                {
                    x: "train",
                    y: 32,
                },
                {
                    x: "subway",
                    y: 261,
                },
                {
                    x: "bus",
                    y: 143,
                },
                {
                    x: "car",
                    y: 236,
                },
                {
                    x: "moto",
                    y: 168,
                },
                {
                    x: "bicycle",
                    y: 152,
                },
                {
                    x: "horse",
                    y: 103,
                },
                {
                    x: "skateboard",
                    y: 253,
                },
                {
                    x: "others",
                    y: 90,
                },
            ],
        },
        {
            id: "norway",
            color: "hsl(210, 70%, 50%)",
            data: [
                {
                    x: "plane",
                    y: 145,
                },
                {
                    x: "helicopter",
                    y: 173,
                },
                {
                    x: "boat",
                    y: 147,
                },
                {
                    x: "train",
                    y: 162,
                },
                {
                    x: "subway",
                    y: 181,
                },
                {
                    x: "bus",
                    y: 288,
                },
                {
                    x: "car",
                    y: 188,
                },
                {
                    x: "moto",
                    y: 49,
                },
                {
                    x: "bicycle",
                    y: 296,
                },
                {
                    x: "horse",
                    y: 212,
                },
                {
                    x: "skateboard",
                    y: 61,
                },
                {
                    x: "others",
                    y: 10,
                },
            ],
        },
    ];

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
                    <div style={{ height: "400px" }} className="border mb-4">
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
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "transportation",
                                legendOffset: 36,
                                legendPosition: "middle",
                                truncateTickAt: 0,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "count",
                                legendOffset: -40,
                                legendPosition: "middle",
                                truncateTickAt: 0,
                            }}
                            pointSize={10}
                            pointColor={{ theme: "background" }}
                            pointBorderWidth={2}
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
                        />
                    </div>
                    <div style={{ height: "400px" }} className="border mb-4">
                        <ResponsiveBar
                            data={data}
                            keys={["burgers"]}
                            indexBy="country"
                            margin={{
                                top: 50,
                                right: 130,
                                bottom: 50,
                                left: 60,
                            }}
                            padding={0.3}
                            colors={{ scheme: "nivo" }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Country",
                                legendPosition: "middle",
                                legendOffset: 32,
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: "Burgers",
                                legendPosition: "middle",
                                legendOffset: -40,
                            }}
                            labelSkipWidth={12}
                            labelSkipHeight={12}
                            labelTextColor={{
                                from: "color",
                                modifiers: [["darker", 1.6]],
                            }}
                            legends={[
                                {
                                    dataFrom: "keys",
                                    anchor: "bottom-right",
                                    direction: "column",
                                    justify: false,
                                    translateX: 120,
                                    itemWidth: 100,
                                    itemHeight: 20,
                                    itemsSpacing: 2,
                                    symbolSize: 20,
                                    itemDirection: "left-to-right",
                                },
                            ]}
                            animate={true}
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
