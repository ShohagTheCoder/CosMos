"use client";
import apiCall from "@/app/common/apiCall";
import Cashout from "@/app/components/Cashout";
import DatePicker from "@/app/components/DatePicker";
import DatePickerMini from "@/app/components/DatePickerMinit";
import Pagination from "@/app/components/Pagination";
import SellsRow from "@/app/components/SellsRow";
import TransferMoney from "@/app/components/TransferMoney";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import CustomersIcon from "@/app/icons/CustomersIcon";
import UserIcon from "@/app/icons/UserIcon";
import React, { useEffect, useState } from "react";

export default function Shop({ shop: initialShop, accounts = [] }: any) {
    const [shop, setShop] = useState(initialShop);
    const [sells, setSells] = useState([]);
    const [account, setAccount] = useState(shop.account);
    const [tansferMoneyPopup, setTransferMoneyPopup] = useState(false);
    const [cashoutPopup, setCashoutPopup] = useState(false);
    const [startDate, setStartDate] = useState(new Date()); // Set to today's date or any default date
    const [endDate, setEndDate] = useState(new Date()); // Set to today's date or any default date

    function handleTransferMoney(amount: any) {
        setAccount((account: any) => ({
            ...account,
            balance: account.balance - amount,
        }));
    }

    function handleCashout(data: any) {
        // Update the account balance in the state
        const updatedAccount = {
            ...account,
            balance: account.balance - data.amount,
        };
        setAccount(updatedAccount);

        // Update the shop state with the new account balance
        setShop((prevShop: any) => ({
            ...prevShop,
            account: updatedAccount,
        }));

        setTimeout(() => {
            setCashoutPopup(false);
        }, 3000);
    }

    useEffect(() => {
        apiCall
            .get(`/sells/query?startDate=${startDate}&endDate=${endDate}`)
            .success((data) => {
                setSells(data);
            });
    }, [startDate, endDate]);

    const handleDateChange = (newStartDate: Date, newEndDate: Date) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        // Optionally, you can fetch your sells here based on the new dates
    };

    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen py-6">
            {tansferMoneyPopup && (
                <TransferMoney
                    accounts={accounts}
                    account={account}
                    callback={handleTransferMoney}
                    handleClose={() => setTransferMoneyPopup(false)}
                />
            )}
            {cashoutPopup && (
                <Cashout
                    account={shop.account}
                    callback={handleCashout}
                    handleClose={() => setCashoutPopup(!cashoutPopup)}
                />
            )}

            <div className="container max-w-3xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
                    {/* Profile Picture */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="flex items-center space-x-6">
                            <img
                                src={`/images/users/${
                                    shop.image || "user.jpg"
                                }`}
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Shop Owner
                                </h2>
                                <p className="text-gray-400">Owner Details</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="md:col-span-2 bg-gray-800 shadow-lg rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <p className="text-gray-400 text-xl">
                                    {account.balance >= 0 ? (
                                        <>
                                            Balance:{" "}
                                            <span className="text-green-400 font-semibold">
                                                {account.balance} ৳
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Due:{" "}
                                            <span className="text-red-400 font-semibold">
                                                {Math.abs(
                                                    account.balance
                                                ).toLocaleString("en-US")}{" "}
                                                ৳
                                            </span>
                                        </>
                                    )}
                                </p>
                            </div>
                            <div className="col-span-2 flex gap-3">
                                <button
                                    onClick={() => setTransferMoneyPopup(true)}
                                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition duration-300"
                                >
                                    Send Money
                                </button>
                                <button
                                    onClick={() => setCashoutPopup(true)}
                                    className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-700 text-white rounded-md font-medium transition duration-300"
                                >
                                    Cash out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sells Information */}
                <div className="mt-8">
                    <div className="w-full mb-4">
                        <div>
                            <DatePickerMini
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={handleDateChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-gray-100">
                            All Sells
                        </h3>
                        <div className="flex gap-3">
                            <p className="text-gray-400 text-lg">
                                Paid:{" "}
                                <span className="font-semibold">
                                    {sells.reduce(
                                        (acc: number, sell: any) =>
                                            acc + sell.paid,
                                        0
                                    )}{" "}
                                    ৳
                                </span>
                            </p>{" "}
                            <p className="text-gray-400 text-lg">
                                Sells:{" "}
                                <span className="font-semibold">
                                    {sells.reduce(
                                        (acc: number, sell: any) =>
                                            acc + sell.due,
                                        0
                                    )}{" "}
                                    ৳
                                </span>
                            </p>{" "}
                            <p className="text-gray-400 text-lg">
                                Sells:{" "}
                                <span className="font-semibold">
                                    {sells.reduce(
                                        (acc: number, sell: any) =>
                                            acc + sell.totalPrice,
                                        0
                                    )}{" "}
                                    ৳
                                </span>
                            </p>{" "}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <SellsRow sells={sells} />
                    </div>
                </div>
            </div>
        </main>
    );
}
