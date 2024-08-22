"use client";
import React, { useState } from "react";
import apiClient from "../utils/apiClient";

function Accounts() {
    const [senderId, setSenderId] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [action, setAction] = useState("");
    const [note, setNote] = useState("");

    async function handleSendMoney() {
        try {
            const { data } = await apiClient.post("accounts/send-money", {
                senderId,
                receiverId,
                amount,
                action,
                note,
            });

            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mx-auto text-black">
            <div className="mt-4 flex flex-col max-w-[400px] mx-auto">
                <label htmlFor="sender">Sender Account Id</label>
                <input
                    id="sender"
                    type="text"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="p-3"
                />
                <label htmlFor="receiver">Receiver Account Id</label>
                <input
                    id="receiver"
                    type="text"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="p-3"
                />
                <label htmlFor="amount">Amount to send</label>
                <input
                    id="amount"
                    type="number"
                    min={0}
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="p-3"
                />
                <label htmlFor="action">Action of this transaction</label>
                <input
                    id="action"
                    type="text"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="p-3"
                />
                <label htmlFor="note">Note</label>
                <input
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="p-3"
                />
                <button
                    onDoubleClick={handleSendMoney}
                    className="border bg-green-700 mt-4 p-3"
                >
                    Send Money
                </button>
            </div>
        </div>
    );
}

export default Accounts;
