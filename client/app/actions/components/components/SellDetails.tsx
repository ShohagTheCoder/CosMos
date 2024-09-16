import { updatePaid } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customerAccount = cart.customerAccount;
    const dispatch = useDispatch();

    // Handle input change
    const handleUpdatePaid = (e: any) => {
        dispatch(updatePaid(parseInt(e.target.value)));
    };

    return (
        <div className="p-3 mb-3 border-dashed border-2 border-gray-600">
            <div className="single-row flex justify-between items-center">
                <p className=" text-lg font-semibold pt-1">সর্বমোট :</p>
                <p className=" text-lg font-semibold pt-1">
                    {cart.totalPrice}
                    <span> ৳</span>
                </p>
            </div>
            {cart.customer ? (
                <>
                    <div className="single-row pt-2 mb-2 mt-2 pb-1 border-t-2 border-dashed border-b-2 border-gray-600 flex justify-between">
                        <p className=" text-lg font-semibold py-1">পেয়েছি :</p>
                        <p className=" text-lg font-semibold py-1">
                            <input
                                className="no-spin w-100 text-end bg-black outline-none text-white"
                                type="text"
                                value={cart.paid}
                                onChange={handleUpdatePaid}
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
                                    {cart.due}
                                    <span> ৳</span>
                                </p>
                            </>
                        )}
                    </div>
                    <div className="single-row flex flex-wrap">
                        <div className="flex justify-between w-1/2 pe-4">
                            {customerAccount.balance <= 0 ? (
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
                                        {customerAccount.balance} ৳
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="flex justify-between w-1/2 ps-4 border-s-slate-600 border-s-2 border-dashed">
                            {customerAccount.balance - cart.due > 0 ? (
                                <>
                                    <p className=" text-lg font-semibold py-1">
                                        মোট জমা :{" "}
                                    </p>
                                    <p className=" text-lg font-semibold py-1">
                                        {Math.abs(
                                            customerAccount.balance - cart.due
                                        )}{" "}
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
                                        )}{" "}
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
