import TrashIcon from "@/app/icons/TrashIcon";
import Measurements from "@/app/products/components/Mesurements";
import Prices from "@/app/products/components/Prices";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function ProductUpdateShortcut({
    handleClose,
    callback,
}: {
    // eslint-disable-next-line no-unused-vars
    callback: (product: ProductWithID) => void;
    handleClose: () => void;
}) {
    const product = useSelector((state: RootState) => state.product);

    // Return null if the product is not available yet
    if (!product) return null;

    return (
        <div className="bg-gray-800 mb-4">
            <div className="flex justify-between p-3 gap-3 items-start">
                <div className="flex gap-3">
                    <div className="h-20">
                        <img
                            className="w-full h-full object-cover"
                            src={`/images/products/${
                                product.image || "product.jpg"
                            }`}
                            alt={product.name}
                        />
                    </div>
                    <div>
                        <p className="text-xl mb-3">{product.name}</p>
                        <p>{product.description}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        className="py-2 px-3 bg-green-600 rounded-md"
                        onClick={() => callback(product as ProductWithID)}
                    >
                        Save
                    </button>
                    <button
                        className="py-2 px-2 bg-red-800 hover:bg-red-700 rounded-md"
                        onClick={handleClose}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
            <Prices />
            <Measurements />
        </div>
    );
}
