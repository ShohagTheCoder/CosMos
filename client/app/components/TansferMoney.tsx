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
                data: "Money tansfer successfull",
            });
            console.log(data);

            setTimeout(() => {
                callback(data);
            }, 3000);
        } catch (error) {
            setMessage({
                type: ERROR,
                data: "Faild to tansfer money",
            });
            console.log(error);
        }
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black z-50 py-[150px]">
            <div className="w-[600px] mx-auto h-full p-5 bg-slate-900">
                <div className="flex place-content-end mb-4 items-center">
                    <button
                        onClick={handleClose}
                        className="h-[30px] w-[30px] bg-red-600 rounded-md"
                    >
                        X
                    </button>
                </div>
                <div className="h-full flex place-content-center items-center">
                    <div className="w-[300px]">
                        {message.type == ERROR ? (
                            <div className="py-3 px-4 mb-3 bg-red-700">
                                <p>{message.data}</p>
                            </div>
                        ) : (
                            ""
                        )}
                        {message.type == SUCCESS ? (
                            <div className="py-3 px-4 mb-3 bg-green-700">
                                <p>{message.data}</p>
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="bg-green-800 py-3 px-4 mb-3">
                            <p>Available Balance : {account.balance} ৳</p>
                        </div>
                        <div>
                            <input
                                id="receiverId"
                                type="text"
                                className="bg-slate-700 py-2 px-4 text-white w-full"
                                placeholder="Receiver ID"
                                onChange={(e) => setReceiverId(e.target.value)}
                                value={receiverId}
                            />
                        </div>
                        <div className="my-3">
                            <input
                                id="amount"
                                type="number"
                                className="bg-slate-700 py-2 px-4 text-white w-full"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <textarea
                                onChange={(e) => setNote(e.target.value)}
                                id="note"
                                className="bg-slate-700 py-2 px-4 text-white resize-none w-full"
                                placeholder="Note"
                                rows={2}
                                cols={22}
                                value={note}
                            ></textarea>
                        </div>
                        <div className="mt-2">
                            <button
                                onDoubleClick={handleSendMoney}
                                className="btn bg-blue-600 text-white py-3 px-4 w-full"
                            >
                                Send money
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TansferMoney;
