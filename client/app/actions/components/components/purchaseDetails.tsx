import { updatePaid } from "@/app/store/slices/purchaseSlice";
import { RootState } from "@/app/store/store";
import {
    convertBnBDToStandard,
    convertStandardToBnBD,
} from "@/app/utils/numberFormat";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PurchaseDetails() {
    const purchase = useSelector((state: RootState) => state.purchase);
    const dispatch = useDispatch();

    return (
        <div className="p-3 mb-3 border-dashed border-2 border-gray-600">
            <div className="single-row flex justify-between items-center">
                <p className=" text-lg font-semibold pt-1">সর্বমোট :</p>
                <p className=" text-lg font-semibold pt-1">
                    {convertStandardToBnBD(purchase.totalPrice)}
                    <span> ৳</span>
                </p>
            </div>
        </div>
    );
}
