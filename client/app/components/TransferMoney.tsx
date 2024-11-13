import React, { useMemo, useState } from "react";
import SearchableSelectInput from "../elements/select/SearchableSelectInput";
import NumberInputControl from "../elements/inputs/NumberInputControl";
import apiClient from "../utils/apiClient";
import useNotifications from "../hooks/useNotifications";
import NotificationList from "../elements/notification/NotificationList";

function TransferMoney({
    accounts: initialAccounts,
    account,
    callback,
    handleClose,
}: any) {
    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState("");
    const { notifications, notifyError, notifySuccess } = useNotifications();

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
        apiClient
            .post(`accounts/sendMoney`, {
                senderId: account._id,
                receiverId,
                amount,
                note,
                action: "Send money",
            })
            .then((res) => {
                notifySuccess(res.data.message);
                callback(amount);
                setTimeout(() => {
                    handleClose();
                }, 3000);
            })
            .catch((error) => {
                notifyError(error.message);
                console.log(error);
            });
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen select-none bg-black z-50 flex justify-center items-center">
            <div className="w-full max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
                <NotificationList notifications={notifications} />
                {/* Close Button */}
                <div className="flex justify-end mb-2 relative">
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
                </div>
                <div className="p-6">
                    {/* Account Balance */}
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

                    {/* Receiver Select Input */}
                    <div className="mb-4">
                        <SearchableSelectInput
                            value={receiverId}
                            onChange={(value: any) => {
                                setReceiverId(value);
                                console.log(accounts);
                            }}
                            options={{
                                label: "Receiver Account",
                                options: accounts,
                            }}
                        />
                    </div>

                    <div className={`${receiverId ? "visible" : "hidden"}`}>
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
                        <div
                            className={`mt-6 ${
                                amount > 0 ? "visible" : "hidden"
                            }`}
                        >
                            <button
                                onDoubleClick={handleSendMoney}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-300 shadow-lg"
                            >
                                Send Money
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransferMoney;
