"use client";
import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Main() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="mb-6">
                <label
                    className="block text-gray-300 text-sm font-semibold mb-2"
                    htmlFor="SKU"
                >
                    SKU
                </label>
                <input
                    className="shadow-inner border border-gray-600 rounded-lg w-full py-2 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="SKU"
                    type="text"
                    value={product.SKU}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "SKU",
                                value: e.target.value,
                            })
                        )
                    }
                />
            </div>

            <div className="mb-6">
                <label
                    className="block text-gray-300 text-sm font-semibold mb-2"
                    htmlFor="name"
                >
                    Name
                </label>
                <input
                    className="shadow-inner border border-gray-600 rounded-lg w-full py-2 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="name"
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "name",
                                value: e.target.value,
                            })
                        )
                    }
                />
            </div>

            <div className="mb-6">
                <label
                    className="block text-gray-300 text-sm font-semibold mb-2"
                    htmlFor="description"
                >
                    Description
                </label>
                <textarea
                    className="shadow-inner border border-gray-600 rounded-lg w-full py-2 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="description"
                    rows={4}
                    value={product.description}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "description",
                                value: e.target.value,
                            })
                        )
                    }
                />
            </div>
        </div>
    );
}

export default Main;
