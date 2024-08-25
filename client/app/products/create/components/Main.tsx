"use client";
import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function Main() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    console.log(product);

    return (
        <div>
            <div className="mb-4">
                <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="SKU"
                >
                    SKU
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <div className="mb-4">
                <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="name"
                >
                    Name
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <div className="mb-4">
                <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="description"
                >
                    Description
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="description"
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
