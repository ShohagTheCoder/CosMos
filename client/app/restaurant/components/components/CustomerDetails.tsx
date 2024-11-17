import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function CustomerDetails() {
    const cart = useSelector((state: RootState) => state.cart);
    const customer = cart.customer;

    if (customer) {
        return (
            <div>
                <table className="min-w-full bg-slate-900 border-dashed border-2 border-slate-600 mb-3">
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <td className="px-4 py-3 font-semibold text-gray-300">
                                Table
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                                {customer.name}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } else if (cart.greeting) {
        return (
            <div className="min-w-full bg-slate-900 border-dashed border-2 border-slate-600 mb-3">
                <div className="p-3 grid grid-cols-2 gap-3">
                    <div>
                        <p>কারস্টমার</p>
                    </div>
                    <div>
                        <p>{cart.greeting}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomerDetails;
