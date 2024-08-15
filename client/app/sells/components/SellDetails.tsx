import { CartState } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SellDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    let totalPrice = cart.totalPrice;

    return (
        <div className="py-3">
            <hr />
            <p className="my-3">Total price : {totalPrice}</p>
            <hr />
        </div>
    );
}

export default SellDetails;
