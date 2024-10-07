import React, { useEffect, useState } from "react";
import DatePickerMini from "../DatePickerMinit";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import CustomersIcon from "@/app/icons/CustomersIcon";
import UserIcon from "@/app/icons/UserIcon";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";

export default function PurchasesList() {
    const [purchases, setPurchases] = useState([]);

    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    useEffect(() => {
        apiClient
            .get(`/purchases/query?startDate=${startDate}&endDate=${endDate}`)
            .then((res) => {
                setPurchases(res.data.data);
            });
    }, [startDate, endDate]);

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // Optionally, you can fetch your purchases here based on the new dates
    };

    return (
        <div>
            <div className="mt-3">
                <div className="w-full mb-4">
                    <div>
                        <DatePickerMini
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={handleDateChange}
                        />
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-100">
                            Purchases Report
                        </h3>
                        <div>
                            <p className="text-gray-400 text-lg">
                                Total:{" "}
                                <span className="font-semibold text-blue-400">
                                    {purchases
                                        .reduce(
                                            (acc: number, purchase: any) =>
                                                acc + purchase.totalPrice,
                                            0
                                        )
                                        .toLocaleString("en-US")}{" "}
                                    ৳
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {purchases.length === 0 ? (
                        <div className="pt-[100px] flex justify-center">
                            <PulseLoading />
                        </div>
                    ) : (
                        purchases.map((purchase: CartState) => (
                            <div
                                key={purchase._id}
                                className="bg-gray-800 p-4 rounded-lg shadow-lg grid grid-cols-3 gap-4"
                            >
                                <div className="col-span-1">
                                    <div className="flex items-center mb-3 gap-2">
                                        <UserIcon />
                                        <p className="text-md text-gray-100">
                                            {purchase.user.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center mb-3 gap-2">
                                        <CustomersIcon />
                                        <p className="text-md text-gray-100">
                                            {purchase.customer
                                                ? purchase.supplier.name
                                                : "Unknown"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-900 p-3 rounded-md">
                                        <div className="flex flex-col justify-between text-gray-200">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium w-1/2 text-left">
                                                    Paid:
                                                </p>
                                                <p className="mx-2 text-gray-200">
                                                    :
                                                </p>
                                                <p className="font-medium w-1/2 text-right">
                                                    {purchase.paid} ৳
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium w-1/2 text-left">
                                                    Due:
                                                </p>
                                                <p className="mx-2 text-gray-200">
                                                    :
                                                </p>
                                                <p className="font-medium w-1/2 text-right">
                                                    {purchase.due} ৳
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium w-1/2 text-left">
                                                    Total Price:
                                                </p>
                                                <p className="mx-2 text-gray-200">
                                                    :
                                                </p>
                                                <p className="font-medium w-1/2 text-right">
                                                    {purchase.totalPrice} ৳
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 ps-3 border-s-2 border-dashed border-gray-600">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-gray-700 rounded-lg">
                                            <thead>
                                                <tr className="text-gray-300">
                                                    <th className="py-2 px-4 text-left">
                                                        Name
                                                    </th>
                                                    <th className="py-2 px-4 text-left">
                                                        Quantity
                                                    </th>
                                                    <th className="py-2 px-4 text-left">
                                                        Price
                                                    </th>
                                                    <th className="py-2 px-4 text-left">
                                                        SubTotal
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.values(
                                                    purchase.products
                                                ).map(
                                                    (
                                                        product: ProductWithID
                                                    ) => (
                                                        <tr
                                                            key={product._id}
                                                            className="hover:bg-gray-600"
                                                        >
                                                            <td className="py-2 px-4 text-gray-300">
                                                                {product.name}
                                                            </td>
                                                            <td className="py-2 px-4 text-gray-300">
                                                                {
                                                                    product.quantity
                                                                }
                                                            </td>
                                                            <td className="py-2 px-4 text-gray-300">
                                                                {product.price}{" "}
                                                                ৳
                                                            </td>
                                                            <td className="py-2 px-4 text-gray-300">
                                                                {
                                                                    product.subTotal
                                                                }{" "}
                                                                ৳
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
