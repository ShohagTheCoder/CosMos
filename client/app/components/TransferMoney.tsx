import React, { useMemo, useState } from "react";
import apiCall from "../common/apiCall";
import useNotification from "../hooks/useNotification";
import Notification from "../elements/notification/Notification";
import SearchableSelectInput from "../elements/select/SearchableSelectInput";

function TransferMoney({
    accounts: initialAccounts,
    account,
    callback,
    handleClose,
}: any) {
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const { notification, notifyError, notifySuccess } = useNotification();

    const accounts = useMemo(
        () =>
            initialAccounts
                .filter((_account: any) => _account._id !== account._id) // Exclude the current account based on accountId
                .map((account: any) => ({
                    label: account.name,
                    value: account._id, // Use the correct id field here
                })),
        [initialAccounts, account] // Include accountId in the dependency array
    );

    async function handleSendMoney() {
        if (!receiverId) {
            notifyError("Please select receiver account first");
            return;
        }
        if (amount > account.balance + 10000 || amount == 0) {
            notifyError("Please enter correct amount");
            return;
        }
        apiCall
            .post(`accounts/sendMoney`, {
                senderId: account._id,
                receiverId,
                amount,
                note,
                action: "Send money",
            })
            .success((data, message) => {
                notifySuccess(message);
                callback(amount);
                setTimeout(() => {
                    handleClose();
                }, 3000);
            })
            .error((error) => {
                notifyError(error.message);
                console.log(error);
            });
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-80 z-50 flex justify-center items-center">
            <div className="w-full max-w-lg mx-auto bg-gray-800 text-white rounded-lg p-6 shadow-lg">
                <Notification
                    message={notification.message}
                    type={notification.type}
                    className="mb-3"
                />
                {/* Close Button */}
                <div className="flex justify-end mb-3">
                    <button
                        onClick={handleClose}
                        className="text-white bg-red-600 hover:bg-red-700 p-2 rounded h-[40px] w-[40px]"
                    >
                        X
                    </button>
                </div>
                {/* Account Balance */}
                <div className="mb-4 p-3 bg-green-800 rounded-md">
                    <p>Available Balance: {account.balance} ৳</p>
                </div>
                {/* Receiver Select Input */}
                <div className="mb-4">
                    <SearchableSelectInput
                        value={receiverId}
                        onChange={(value: any) => setReceiverId(value)}
                        options={{
                            label: "Receiver account",
                            options: accounts,
                        }}
                    />
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
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

export default TransferMoney;
