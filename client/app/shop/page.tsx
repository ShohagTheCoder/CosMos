"use client";
import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TansferMoney from "../components/TansferMoney";

function CustomerProfile() {
    const id = "66c6d8a0b0f83bdb4ed36c97";
    const [sells, setSells] = useState([]);
    const [account, setAccount] = useState({
        balance: 0,
    });

    const [tansferMoneyPopup, setTansferMoneyPopup] = useState(false);
    function handleTansferMoney(data: any) {
        setTansferMoneyPopup(false);
    }

    useEffect(() => {
        apiClient.get("sells").then((res) => setSells(res.data));
        apiClient.get(`accounts/${id}`).then((res) => setAccount(res.data));
    }, []);

    return (
        <main>
            {tansferMoneyPopup ? (
                <TansferMoney
                    account={account}
                    callback={handleTansferMoney}
                    handleClose={() => setTansferMoneyPopup(false)}
                />
            ) : (
                ""
            )}

            <div className="container mx-auto">
                <div className="grid grid-cols-4 py-3 gap-3">
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <img
                                    src="/profile-picture.jpg"
                                    alt=""
                                    className="h-[200px]"
                                />
                            </div>
                            <div className="col-span-1">
                                <p>Shop Owner</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="col-span-1">
                                {account.balance > 0 ? (
                                    <p>Balance: {account.balance} ৳</p>
                                ) : (
                                    <p>Due: {Math.abs(account.balance)} ৳</p>
                                )}
                            </div>
                            <div className="col-span-1">
                                Sells: {account.balance} ৳
                            </div>
                            <div className="col-span-1">View account</div>
                            <div className="col-span-1">
                                <button
                                    onClick={() => setTansferMoneyPopup(true)}
                                    className="py-2 px-3 bg-blue-700"
                                >
                                    Send money
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">
                <p className="mb-3">All sells here</p>
                {sells.map((sell: any) => (
                    <div key={sell._id} className="sell">
                        <div className="border p-3">
                            <p>Seller: {sell.user.name}</p>
                            {Object.values(sell.products).map(
                                (product: any) => (
                                    <div key={product._id} className="product">
                                        <p>Product Name: {product.name}</p>
                                        <p>
                                            Product Quantity: {product.quantity}
                                        </p>
                                        <p>Product Price: {product.price}</p>
                                        <p>
                                            Product SubTotal: {product.subTotal}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default CustomerProfile;
