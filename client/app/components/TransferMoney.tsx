import React, { useMemo, useState } from "react";
import apiCall from "../common/apiCall";
import useNotification from "../hooks/useNotification";
import Notification from "../elements/notification/Notification";
import SearchableSelectInput from "../elements/select/SearchableSelectInput";
import NumberInputControl from "../elements/inputs/NumberInputControl";

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
                .filter((_account: any) => _account._id !== account._id)
                .map((account: any) => ({
                    label: account.name,
                    value: account._id,
                })),
        [initialAccounts, account]
    );

    async function handleSendMoney() {
        if (!receiverId) {
            notifyError("Please select a receiver account first");
            return;
        }
        if (amount > account.balance + 10000 || amount <= 0) {
            notifyError("Please enter a valid amount");
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
            <div className="w-full max-w-lg mx-auto bg-gray-900 text-white rounded-lg p-6 shadow-lg border border-gray-700">
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
                <div className="mb-4 p-4 rounded-md bg-gradient-to-r from-green-900 to-blue-900">
                    <p className="text-xl text-center font-semibold">
                        Balance: {account.balance} ৳
                    </p>
                </div>

                {/* Receiver Select Input */}
                <div className="mb-4">
                    <SearchableSelectInput
                        value={receiverId}
                        onChange={(value: any) => setReceiverId(value)}
                        options={{
                            label: "Receiver Account",
                            options: accounts,
                        }}
                    />
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    {/* Amount */}
                    <NumberInputControl
                        value={amount}
                        onChange={setAmount}
                        className="w-full flex"
                        buttonClassName="h-[50px] w-[50px]"
                        inputClassName="text-lg flex-grow w-auto bg-gray-800 p-3 text-white placeholder-gray-400 focus:outline-none h-[50px]"
                    />

                    {/* Note */}
                    <textarea
                        id="note"
                        className="w-full bg-gray-800 p-3 rounded-md text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500 resize-none"
                        placeholder="Add a note (optional)"
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>

                {/* Send Money Button */}
                <div className="mt-6">
                    <button
                        onDoubleClick={handleSendMoney}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-300 shadow-lg"
                    >
                        Send Money
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TransferMoney;
