import { addToCart } from "@/app/store/slices/cartSlice";
import React from "react";
import { useDispatch } from "react-redux";

function ProductCard({ products }: { products: any }) {
    const dispatch = useDispatch();

    function handleAddToCart(_id: string) {
        const newProduct = {
            ...products[_id],
            quantity: 1,
        };

        dispatch(addToCart(newProduct));
    }

    return (
        <div className="flex flex-wrap gap-3">
            {Object.values(products).map((product: any) => (
                <div
                    key={product._id}
                    onClick={() => handleAddToCart(product._id)}
                    className="max-w-sm rounded-lg overflow-hidden shadow-xl bg-gray-800 text-white"
                >
                    <img
                        className="w-full h-48 object-cover"
                        src="product.jpeg"
                        alt={product.name}
                    />
                    <div className="px-6 py-4">
                        <h2 className="font-semibold text-2xl mb-2">
                            {product.name}
                        </h2>
                        <p className="text-gray-300 text-base mb-4">
                            {product.description}
                        </p>
                        <p className="font-semibold text-xl text-green-400">
                            ${product.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductCard;
