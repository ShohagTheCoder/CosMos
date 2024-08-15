import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "./../../store/slices/cartSlice"; // Assuming your cart slice location
import { RootState } from "@/app/store/store";

export interface Product {
    _id: string; // MongoDB unique identifier
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
    quantity: number;
}

function CartItem({ product }: { product: Product }) {
    const dispatch = useDispatch();
    // const { items } = useSelector((state: RootState) => state.cart); // Access cart items

    const handleDecrement = () => {
        if (product.quantity > 1) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = () => {
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    return (
        <div className="flex items-center border-b py-4">
            <img
                src="product.jpeg"
                alt={product.name}
                className="w-20 h-20 object-cover mr-4"
            />
            <div className="flex-1">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price}</p>
                <div className="flex items-center mt-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2"
                        onClick={handleDecrement}
                    >
                        -
                    </button>
                    <span className="text-gray-700 font-bold">
                        {product.quantity}
                    </span>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                        onClick={handleIncrement}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-medium">
                    Subtotal: ${product.price * product.quantity}
                </p>
                <button
                    onDoubleClick={() => dispatch(removeFromCart(product._id))}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

export default CartItem;
