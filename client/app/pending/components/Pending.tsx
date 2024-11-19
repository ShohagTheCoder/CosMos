import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState } from "@/app/store/slices/cartSlice";
import React from "react";

export default function Pending({ sells }: { sells: CartState[] }) {
    return (
        <div className="p-3">
            <div className="container mx-auto">
                <div className="grid grid-cols-4 gap-3 my-3">
                    {sells.map((sell: CartState) => (
                        <div key={sell._id} className="bg-gray-700 w-auto p-3">
                            <p className="py-2 px-3 bg-gray-800">
                                Customer : {sell.customer?.name}
                            </p>
                            <div className="p-3 bg-gray-800 my-2">
                                {Object.values(sell.products).map(
                                    (product: ProductWithID) => (
                                        <div
                                            key={product._id}
                                            className="flex justify-between"
                                        >
                                            <p>{product.name}</p>
                                            <p>
                                                {product.quantity}{" "}
                                                {product.unit}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="py-2 px-3 bg-gray-800 mb-2 flex justify-between">
                                <p>Total : </p>
                                <p>{sell.totalPrice} ৳</p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href={`/restaurant/${sell._id}`}
                                    className="bg-green-800 text-white py-2 px-3 h-[40px] w-full hover:bg-blue-800"
                                >
                                    View
                                </a>
                                <button className="bg-red-800 text-white py-2 px-3 h-[40px] w-[40px] hover:bg-red-500">
                                    x
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
