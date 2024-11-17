import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SupplierDetails() {
    const stock = useSelector((state: RootState) => state.stock);
    const supplier = stock.supplier;

    if (supplier) {
        return (
            <div>
                <table className="min-w-full bg-slate-900 border-dashed border-2 border-slate-600 mb-3">
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                সাপ্লায়ার
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {supplier.name}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                নাম্বার
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {supplier.phoneNumber}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                ঠিকানা
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {supplier.address}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else {
        return "";
    }
}

export default SupplierDetails;
