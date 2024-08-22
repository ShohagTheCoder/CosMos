import { CartState } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        <div className="py-3">
            <hr className="my-3 border-gray-300" />
            <p className=" text-lg font-semibold">
                সর্বমোট : {cart.totalPrice.toLocaleString("Bn-bd")}
                <span> ৳</span>
            </p>
            <hr className="my-3 border-gray-300" />
        </div>
    );
}

export default SellDetails;
