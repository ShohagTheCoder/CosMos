import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { convertStandardToBnBD } from "@/app/utils/numberFormat";
import React from "react";

interface ProductsCardProps {
    selected: number;
    callback: (product: ProductWithID) => void;
    products: Record<string, ProductWithID> | undefined;
}

function ProductsCard({ selected, callback, products }: ProductsCardProps) {
    function handleCallback(id: string) {
        if (products) {
            callback(products[id]);
        }
    }

    if (!products) {
        return "Loding";
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {Object.values(products).map((product: any, key: number) => (
                <div
                    key={product._id}
                    onClick={() => handleCallback(product._id)}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selected == key ? "bg-green-900" : "bg-black"
                    }`}
                >
                    <img
                        className="w-full h-[240px] object-cover"
                        src="/product.jpg"
                        alt={product.name}
                    />
                    <div className="p-3">
                        <h2 className="font-semibold text-xl mb-1">
                            {product.name}
                        </h2>
                        <p className="text-gray-300 text-base mb-1">
                            {product.description}
                        </p>
                        <p className="font-semibold text-xl text-green-400 inline-block">
                            {convertStandardToBnBD(
                                product.price *
                                    product.units[product.displaySaleUnit].value
                            )}
                            <span> ৳</span>
                        </p>
                        <span className="ms-2">
                            1 {product.units[product.displaySaleUnit].label}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductsCard;
