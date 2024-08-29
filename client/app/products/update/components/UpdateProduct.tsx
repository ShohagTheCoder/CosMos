import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function UpdateProduct() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [message, setMessage] = useState("");

    async function UpdateProduct() {
        const update = Object.entries(product).reduce(
            (acc: any, [key, value]) => {
                if (value != product.product[key] && key != "product") {
                    acc[key] = value;
                }

                return acc;
            },
            {}
        );
        try {
            const result = await apiClient.patch(
                `products/${product._id}`,
                product
            );
            setMessage("Product updated successfully!");
            console.log(result.data);
        } catch (error) {
            setMessage("Failed to update product.");
            console.error(error);
        }
    }

    return (
        <div>
            <p className="text-center text-red-500">{message}</p>
            <div className="mb-4">
                <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="stockLow"
                >
                    Stock Low
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="number"
                    value={product.stockLow}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "stockLow",
                                value: parseInt(e.target.value),
                            })
                        )
                    }
                />
            </div>
            <div className="mb-4">
                <label
                    className="block text-gray-300 text-sm font-bold mb-2"
                    htmlFor="stockLow"
                >
                    Stock Alert
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="number"
                    value={product.stockAlert}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "stockAlert",
                                value: parseInt(e.target.value),
                            })
                        )
                    }
                />
            </div>
            <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onDoubleClick={UpdateProduct}
            >
                Update Product
            </button>
        </div>
    );
}

export default UpdateProduct;
