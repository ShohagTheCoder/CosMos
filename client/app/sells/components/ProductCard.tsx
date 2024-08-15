import { addToCart } from "@/app/store/slices/cartSlice";
import React from "react";
import { useDispatch } from "react-redux";

function ProductCard({ product }: { product: any }) {
    const dispatch = useDispatch();

    function handleAddToCart(product: any) {
        const newProduct = {
            ...product,
            quantity: 1,
        };
        dispatch(addToCart(newProduct));
    }

    // return (
    //     <div
    //         onDoubleClick={() => handleAddToCart(product)}
    //         className="product border w-[200px]"
    //     >
    //         <img src="product.jpeg" alt="Product" />
    //         <p>{product.name}</p>
    //     </div>
    // );

    // return (
    //     <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
    //         <img
    //             className="w-full h-48 object-cover"
    //             src="product.jpeg"
    //             alt={product.name}
    //         />
    //         <div className="px-6 py-4">
    //             <h2 className="font-bold text-xl mb-2">{product.name}</h2>
    //             <p className="text-gray-700 text-base mb-4">
    //                 {product.description}
    //             </p>
    //             <p className="font-bold text-lg text-green-600">
    //                 ${product.price}
    //             </p>
    //         </div>
    //     </div>
    // );

    return (
        <div
            onDoubleClick={() => handleAddToCart(product)}
            className="max-w-sm rounded-lg overflow-hidden shadow-xl bg-gray-800 text-white"
        >
            <img
                className="w-full h-48 object-cover"
                src="product.jpeg"
                alt={product.name}
            />
            <div className="px-6 py-4">
                <h2 className="font-semibold text-2xl mb-2">{product.name}</h2>
                <p className="text-gray-300 text-base mb-4">
                    {product.description}
                </p>
                <p className="font-semibold text-xl text-green-400">
                    ${product.price}
                </p>
            </div>
        </div>
    );
}

export default ProductCard;
