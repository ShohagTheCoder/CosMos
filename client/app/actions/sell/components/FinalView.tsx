import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function FinalView() {
    const cart = useSelector((state: RootState) => state.cart);

    return (
        // <div className="fixed z-50 bg-gray-800 h-svh w-svw flex justify-center items-start">
        <div className="bg-gray-800 w-full py-6 py-4">
            <div className="bg-gray-900 w-[400px] p-5 mx-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-800">
                            <td className="py-2 px-3">Name</td>
                            <td className="text-center py-2 px-3">Quantity</td>
                            <td className="text-end py-2 px-3">Subtotal</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(cart.products).map(
                            (product, index: number) => {
                                return (
                                    <tr
                                        key={product._id}
                                        className={`${
                                            index % 2 == 1
                                                ? "even:bg-gray-800"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-2 px-3">
                                            {product.name}
                                        </td>
                                        <td className="text-center py-2 px-3">
                                            {product.quantity +
                                                " " +
                                                product.unit}
                                        </td>
                                        <td className="text-end py-2 px-3">
                                            {product.subTotal} ৳
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between py-2 px-3 mt-3 bg-green-900">
                    <p>Total price</p>
                    <p>{cart.totalPrice} ৳</p>
                </div>
            </div>
        </div>
    );
}
