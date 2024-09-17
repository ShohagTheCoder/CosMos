import React, { useState } from "react";
import apiClient from "../utils/apiClient";
import { ERROR, NONE, SUCCESS } from "../utils/constants/message";

function TansferMoney({ account, callback, handleClose }: any) {
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const [message, setMessage] = useState({
        type: NONE,
        data: "",
    });

    async function handleSendMoney() {
        try {
            const { data } = await apiClient.post("accounts/send-money", {
                senderId: account._id,
                receiverId,
                amount,
                note,
                action: "Send money",
            });

            setMessage({
                type: SUCCESS,
                data: "Money transfer successful",
            });

            setTimeout(() => {
                callback(data);
            }, 3000);
        } catch (error) {
            setMessage({
                type: ERROR,
                data: "Failed to transfer money",
            });
            console.log(error);
        }
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-80 z-50 flex justify-center items-center">
            <div className="w-full max-w-lg mx-auto bg-gray-800 text-white rounded-lg p-6 shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end mb-3">
                    <button
                        onClick={handleClose}
                        className="text-white bg-red-600 hover:bg-red-700 p-2 rounded h-[40px] w-[40px]"
                    >
                        X
                    </button>
                </div>

                {/* Message Display */}
                {message.type === ERROR && (
                    <div className="mb-4 p-4 bg-red-600 text-white rounded-md">
                        <p>{message.data}</p>
                    </div>
                )}
                {message.type === SUCCESS && (
                    <div className="mb-4 p-4 bg-green-600 text-white rounded-md">
                        <p>{message.data}</p>
                    </div>
                )}

                {/* Account Balance */}
                <div className="mb-4 p-3 bg-green-800 rounded-md">
                    <p>Available Balance: {account.balance} ৳</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    {/* Receiver ID */}
                    <input
                        id="receiverId"
                        type="text"
                        className="w-full bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                        placeholder="Receiver ID"
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
                    />

                    {/* Amount */}
                    <input
                        id="amount"
                        type="number"
                        className="w-full bg-gray-700 p-3 rounded-md text-white placeholder-gray-400"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />

                    {/* Note */}
                    <textarea
                        id="note"
                        className="w-full bg-gray-700 p-3 rounded-md text-white placeholder-gray-400 resize-none"
                        placeholder="Note"
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>

                {/* Send Money Button */}
                <div className="mt-6">
                    <button
                        onClick={handleSendMoney}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-300"
                    >
                        Send Money
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TansferMoney;
