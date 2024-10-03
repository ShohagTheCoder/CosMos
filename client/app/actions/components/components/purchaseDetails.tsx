import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function PurchaseDetails() {
    const stock = useSelector((state: RootState) => state.stock);

    return (
        <div className="p-3 mb-3 border-dashed border-2 border-gray-600">
            <div className="single-row flex justify-between items-center">
                <p className=" text-lg font-semibold pt-1">সর্বমোট :</p>
                <p className=" text-lg font-semibold pt-1">
                    {stock.totalPrice.toLocaleString("en-US")}
                    <span> ৳</span>
                </p>
            </div>
        </div>
    );
}
