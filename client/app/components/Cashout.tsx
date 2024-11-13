import React, { useState } from "react";
import NumberInputControl from "../elements/inputs/NumberInputControl";
import apiClient from "../utils/apiClient";
import useNotifications from "../hooks/useNotifications";
import NotificationList from "../elements/notification/NotificationList";

export default function Cashout({ account, callback, handleClose }: any) {
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const [cashoutButtonLoading, setCashoutButtonLoading] = useState(false);

    const { notifications, notifyError, notifySuccess } = useNotifications();

    const notes = [
        { label: "Bill", note: "This is a bill of ?" },
        { label: "Salary", note: "This is a salary payment for ?" },
        { label: "Expense", note: "This is an expense for ?" },
        { label: "Donation", note: "This is a donation to ?" },
        {
            label: "Others",
            note: "This is a miscellaneous payment for ?",
        },
    ];

    async function handleCashout() {
        setCashoutButtonLoading(true);
        apiClient
            .post(`/accounts/cashout`, {
                accountId: account._id,
                amount,
                note,
                action: "Cashout",
            })
            .then((res) => {
                notifySuccess(res.data.message);
                setAmount(0);
                setNote(""); // Clear note after successful cashout
                callback(res.data.data);
            })
            .catch((error) => {
                notifyError(error.message);
            })
            .finally(() => {
                setCashoutButtonLoading(false);
            });
    }

    const handleAmountChange = (amount: number) => {
        setAmount(amount);
    };

    return (
        <div className="fixed top-0 left-0 h-screen w-screen select-none bg-black z-50 flex justify-center items-center">
            <div className="w-full max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 p-6 relative">
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
                <NotificationList notifications={notifications} />
                <div className="">
                    <p className="text-lg text-gray-400">
                        Balance:{" "}
                        <span className="text-2xl font-semibold mx-2 text-white">
                            {account.balance}
                        </span>
                        ৳
                    </p>
                </div>
                <div className="border-t-2 border-gray-700 border-dashed my-3" />

                {/* Input Fields */}
                <div className="space-y-4">
                    <div>
                        <NumberInputControl
                            step={10}
                            value={amount}
                            onChange={(amount) => {
                                handleAmountChange(amount);
                            }}
                            className="w-full flex"
                            buttonClassName="h-[50px] w-[50px]"
                            inputClassName="text-lg flex-grow bg-gray-800 p-3 text-white placeholder-gray-400 focus:outline-none h-[50px]"
                        />
                    </div>
                    {/* Quick Note Buttons */}
                    <div className="flex flex-wrap mb-3 gap-2">
                        {notes.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setNote(item.note)}
                                className="bg-gray-800 text-white rounded-md px-2 py-1 hover:bg-blue-700 transition duration-300"
                            >
                                {item.label}
                            </button>
                        ))}
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

                <div className={`mt-4 ${amount > 0 ? "visible" : "hidden"}`}>
                    {/* Cashout Button */}
                    <button
                        onDoubleClick={handleCashout}
                        className={`w-full py-3 rounded-lg font-semibold text-lg tracking-wide shadow-md ${
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
        </div>
    );
}
