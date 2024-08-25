import { RootState } from "../../store/store";
import React from "react";
import { useSelector } from "react-redux";

function CustomerDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customer = cart.customer;
    const account = cart.customerAccount;

    if (customer) {
        return (
            <div>
                <table className="min-w-full bg-slate-900 border border-dashed border-2 border-slate-600 mb-3">
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                কারস্টমার
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {customer.name}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                নাম্বার
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {customer.phoneNumber}
                            </td>
                        </tr>
                        <tr className="">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                ঠিকানা
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {customer.address}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default CustomerDetails;
