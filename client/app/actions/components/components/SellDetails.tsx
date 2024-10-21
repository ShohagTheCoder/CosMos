"use client";
import useCartManager from "@/app/store/providers/cartProvider";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customerAccount = cart.customerAccount;
    const cartManager = useCartManager();

    return (
        <div className="bg-transparent p-3 mb-3 border-dashed border-2 border-gray-600">
            <div className="single-row flex justify-between items-center">
                <p className=" text-lg font-semibold pt-1">সর্বমোট :</p>
                <p className=" text-lg font-semibold pt-1">
                    {Math.ceil(cart.totalPrice).toLocaleString("en-US")}
                    <span> ৳</span>
                </p>
            </div>
            {cart.customer ? (
                <>
                    <div className="single-row pt-2 mb-2 mt-2 pb-1 border-t-2 border-dashed border-b-2 border-gray-600 flex justify-between">
                        <p className=" text-lg font-semibold py-1">পেয়েছি :</p>
                        <p className=" text-lg font-semibold py-1">
                            <input
                                className="no-spin w-[60px] text-end bg-black outline-none text-white"
                                type="number"
                                value={cart.paid}
                                onChange={(e) => {
                                    cartManager
                                        .set("paid", parseInt(e.target.value))
                                        .save();
                                }}
                            />
                            <span> ৳</span>
                        </p>
                    </div>
                    <div className="single-row mb-2 pb-1 border-dashed border-b-2 border-gray-600 flex justify-between">
                        {cart.due < 0 ? (
                            <>
                                <p className=" text-lg font-semibold py-1">
                                    নতুন জমা :
                                </p>
                                <p className=" text-lg font-semibold py-1">
                                    {Math.abs(cart.due)}
                                    <span> ৳</span>
                                </p>
                            </>
                        ) : (
                            <>
                                <p className=" text-lg font-semibold py-1">
                                    নতুন বাকি :
                                </p>
                                <p className=" text-lg font-semibold py-1">
                                    {cart.due.toLocaleString("en-US")}
                                    <span> ৳</span>
                                </p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col xl:flex-row gap-2 xl:gap-4">
                        <div className="flex justify-between w-full xl:w-1/2">
                            {customerAccount.balance <= 0 ? (
                                <>
                                    <p className=" text-lg font-semibold py-1">
                                        আগের বাকি :
                                    </p>
                                    <p className=" text-lg font-semibold py-1">
                                        {Math.abs(
                                            customerAccount.balance
                                        ).toLocaleString("en-US")}{" "}
                                        ৳
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className=" text-lg font-semibold py-1">
                                        আগের জমা :
                                    </p>
                                    <p className=" text-lg font-semibold py-1">
                                        {customerAccount.balance.toLocaleString(
                                            "en-US"
                                        )}{" "}
                                        ৳
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="min-h-full border-t-2 xl:border-s-2 border-slate-600 border-dashed"></div>
                        <div className="flex justify-between w-full xl:w-1/2">
                            {customerAccount.balance - cart.due > 0 ? (
                                <>
                                    <p className=" text-lg font-semibold py-1">
                                        মোট জমা :{" "}
                                    </p>
                                    <p className=" text-lg font-semibold py-1">
                                        {Math.abs(
                                            customerAccount.balance - cart.due
                                        ).toLocaleString("en-US")}{" "}
                                        ৳
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className=" text-lg font-semibold py-1">
                                        মোট বাকি :{" "}
                                    </p>
                                    <p className=" text-lg font-semibold py-1">
                                        {Math.abs(
                                            customerAccount.balance - cart.due
                                        ).toLocaleString("en-US")}{" "}
                                        ৳
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}
        </div>
    );
}

export default SellDetails;
