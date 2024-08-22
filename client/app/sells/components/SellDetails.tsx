import { CartState, updatePaid } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();

    return (
        <div className="py-3">
            <hr className="my-3 border-gray-300" />
            <p className=" text-lg font-semibold">
                সর্বমোট : {cart.totalPrice.toLocaleString("Bn-bd")}
                <span> ৳</span>
            </p>
            <input
                className="h-[40px] w-[70px] bg-black outline-none text-white px-3 border"
                type="number"
                value={cart.paid}
                onChange={(e) => dispatch(updatePaid(parseInt(e.target.value)))}
            />
            <p>Due: {cart.due}</p>
            <p>Customer total Due: {cart.customerTotalDue}</p>
            <hr className="my-3 border-gray-300" />
        </div>
    );
}

export default SellDetails;
