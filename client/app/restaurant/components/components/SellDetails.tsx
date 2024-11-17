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
                <p className="text-lg font-semibold pt-1">সর্বমোট :</p>
                <p className="text-2xl font-bold text-green-500 pt-1">
                    {Math.ceil(cart.totalPrice).toLocaleString("en-US")}
                    <span> ৳</span>
                </p>
            </div>
        </div>
    );
}

export default SellDetails;
