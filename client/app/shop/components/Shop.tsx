"use client";
import Cashout from "@/app/components/Cashout";
import TransferMoney from "@/app/components/TransferMoney";
import React, { useEffect, useState } from "react";

export default function Shop({ shop: initialShop, accounts = [] }: any) {
    const [shop, setShop] = useState(initialShop);
    const [account, setAccount] = useState(shop.account);
    const [tansferMoneyPopup, setTransferMoneyPopup] = useState(false);
    const [cashoutPopup, setCashoutPopup] = useState(false);

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
        const handleKeyDown = (e: any) => {
            // Check if the active element is not an input element and CtrlRight is pressed
            const activeElement = document.activeElement;
            if (
                e.code === "ControlRight" &&
                !(
                    activeElement?.tagName === "INPUT" ||
                    activeElement?.tagName === "TEXTAREA"
                )
            ) {
                setCashoutPopup(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup function to remove the event listener
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [setCashoutPopup]); // Include setCashoutPopup as a dependency

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

            <div className="container max-w-4xl mx-auto px-4">
                {/* Profile and Account Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4">
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
                                    {shop.name}
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
                                    {account?.balance >= 0 ? (
                                        <>
                                            Balance:{" "}
                                            <span className="text-green-400 font-semibold">
                                                {account.balance.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                ৳
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            Balance :{" "}
                                            <span className="text-red-400 font-semibold">
                                                {account?.balance?.toLocaleString(
                                                    "en-US"
                                                )}{" "}
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
            </div>
        </main>
    );
}
