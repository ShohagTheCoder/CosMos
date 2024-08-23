import { CartState, updatePaid } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
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
                <p className=" text-lg font-semibold py-1">জমা :</p>
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
                <p className=" text-lg font-semibold py-1">বাকি :</p>
                <p className=" text-lg font-semibold py-1">
                    {cart.due.toLocaleString("En-us")}
                    <span> ৳</span>
                </p>
            </div>
            <div className="single-row flex justify-between">
                <p className=" text-lg font-semibold py-1">
                    &apos;{cart.customer?.name}&#39; এর মোট বাকি :
                </p>
                <p className=" text-lg font-semibold py-1">
                    {Math.abs(cart.customerTotalDue).toLocaleString("En-us")}
                    <span> ৳</span>
                </p>
            </div>
        </div>
    );
}

export default SellDetails;
