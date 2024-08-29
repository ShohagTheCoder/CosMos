import { CartState, updatePaid } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customerAccount = cart.customerAccount;
    const dispatch = useDispatch();

    return (
        <div className="p-3 mb-3 border border-dashed border-2 border-gray-600">
            <div className="single-row mb-2 pb-1 border-b border-dashed border-b-2 border-gray-600 flex justify-between">
                <p className=" text-lg font-semibold py-1">সর্বমোট :</p>
                <p className=" text-lg font-semibold py-1">
                    {cart.totalPrice.toLocaleString("En-us")}
                    <span> ৳</span>
                </p>
            </div>
            <div className="single-row mb-2 pb-1 border-b border-dashed border-b-2 border-gray-600 flex justify-between">
                <p className=" text-lg font-semibold py-1">পেয়েছি :</p>
                <p className=" text-lg font-semibold py-1">
                    <input
                        className="no-spin w-[80px] text-end bg-black outline-none text-white"
                        type="number"
                        value={cart.paid}
                        onChange={(e) =>
                            dispatch(updatePaid(parseInt(e.target.value)))
                        }
                    />
                    <span> ৳</span>
                </p>
            </div>
            <div className="single-row mb-2 pb-1 border-b border-dashed border-b-2 border-gray-600 flex justify-between">
                {cart.due < 0 ? (
                    <>
                        <p className=" text-lg font-semibold py-1">
                            নতুন জমা :
                        </p>
                        <p className=" text-lg font-semibold py-1">
                            {Math.abs(cart.due).toLocaleString("En-us")}
                            <span> ৳</span>
                        </p>
                    </>
                ) : (
                    <>
                        <p className=" text-lg font-semibold py-1">বাকি :</p>
                        <p className=" text-lg font-semibold py-1">
                            {cart.due.toLocaleString("En-us")}
                            <span> ৳</span>
                        </p>
                    </>
                )}
            </div>
            <div className="single-row flex flex-wrap">
                <div className="flex justify-between w-1/2 pe-4">
                    {customerAccount.balance < 0 ? (
                        <>
                            <p className=" text-lg font-semibold py-1">
                                আগের বাকি :
                            </p>
                            <p className=" text-lg font-semibold py-1">
                                {Math.abs(customerAccount.balance)} ৳
                            </p>
                        </>
                    ) : (
                        <>
                            <p className=" text-lg font-semibold py-1">
                                আগের জমা :
                            </p>
                            <p className=" text-lg font-semibold py-1">
                                {customerAccount.balance}
                            </p>
                        </>
                    )}
                </div>
                <div className="flex justify-between w-1/2 ps-4 border-s border-s-slate-600 border-s-2 border-dashed">
                    {customerAccount.balance - cart.due > 0 ? (
                        <>
                            <p className=" text-lg font-semibold py-1">
                                মোট জমা :{" "}
                            </p>
                            <p className=" text-lg font-semibold py-1">
                                {Math.abs(customerAccount.balance - cart.due)} ৳
                            </p>
                        </>
                    ) : (
                        <>
                            <p className=" text-lg font-semibold py-1">
                                মোট বাকি :{" "}
                            </p>
                            <p className=" text-lg font-semibold py-1">
                                {Math.abs(customerAccount.balance - cart.due)} ৳
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SellDetails;
