import React, { useState } from "react";
import apiCall from "../common/apiCall";
import useNotification from "../hooks/useNotification";
import Notification from "../elements/notification/Notification";
import NumberInputControl from "../elements/inputs/NumberInputControl";

export default function Cashout({ account, callback, handleClose }: any) {
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const [cashoutButtonLoading, setCashoutButtonLoading] = useState(false);

    const { notification, notifyError, notifySuccess } = useNotification();

    async function handleCashout() {
        setCashoutButtonLoading(true);
        apiCall
            .post(`/accounts/cashout`, {
                accountId: account._id,
                amount,
                note,
                action: "Cashout",
            })
            .success((data, message) => {
                notifySuccess(message);
                setAmount(0);
                callback(data);
            })
            .error((error) => {
                notifyError(error.message);
            })
            .finally(() => {
                setCashoutButtonLoading(false);
            });
    }

    const handleAmountChange = (amount: number) => {
        if (amount > account.balance) {
            setAmount(account.balance);
        } else {
            setAmount(amount);
        }
    };

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-60 backdrop-blur-md z-50 flex justify-center items-center">
            <div className="w-full max-w-md bg-gray-900 text-white rounded-lg shadow-xl transform transition-all ease-in-out duration-500 p-8 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Notification */}
                <Notification
                    message={notification.message}
                    type={notification.type}
                    className="mb-4"
                />

                {/* Account Balance */}
                <div className="mb-5 p-4 bg-gradient-to-r from-gray-700 to-green-900 rounded-lg text-center text-lg shadow-md">
                    <p>
                        Balance:{" "}
                        <span className="text-2xl font-semibold">
                            {account.balance}
                        </span>{" "}
                        ৳
                    </p>
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                    <div className="flex justify-stretch">
                        <NumberInputControl
                            step={10}
                            value={amount}
                            onChange={(amount) => {
                                handleAmountChange(amount);
                            }}
                            className="w-full flex justify-between"
                            buttonClassName="h-[50px] !w-[50px]"
                            inputClassName="text-lg w-auto bg-gray-800 p-3 text-white placeholder-gray-400 focus:outline-none h-[50px]"
                        />
                    </div>
                    {/* Note Textarea */}
                    <textarea
                        id="note"
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        placeholder="Enter a note (optional)"
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>

                {/* Cashout Button */}
                <button
                    onDoubleClick={handleCashout}
                    className={`mt-8 w-full py-3 rounded-lg font-semibold text-lg tracking-wide shadow-md ${
                        cashoutButtonLoading
                            ? "bg-blue-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                    } transition-all duration-300`}
                    disabled={amount <= 0 || cashoutButtonLoading}
                >
                    {cashoutButtonLoading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        "Cash Out"
                    )}
                </button>
            </div>
        </div>
    );
}