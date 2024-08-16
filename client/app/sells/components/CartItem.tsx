import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "./../../store/slices/cartSlice"; // Assuming your cart slice location
import { RootState } from "../../store/store";

export interface Product {
    _id: string; // MongoDB unique identifier
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
    quantity: number;
}

function CartItem() {
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);

    const handleDecrement = (_id: string) => {
        let product = cart.items[_id];
        if (product.quantity > 1) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = (_id: string) => {
        let product = cart.items[_id];
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    return (
        <div className="cart">
            {Object.values(cart.items).map((product) => (
                <div
                    key={product._id}
                    className="flex items-center border-b py-4"
                >
                    <img
                        src="product.jpeg"
                        alt={product.name}
                        className="h-[90px] object-cover mr-4"
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <p className="text-gray-200">Price: ${product.price}</p>
                        <div className="flex items-center mt-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded"
                                onClick={() => handleDecrement(product._id)}
                            >
                                -
                            </button>
                            <span className="tex-white-700 font-bold mx-2">
                                {product.quantity}
                            </span>
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
                                onClick={() => handleIncrement(product._id)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-medium">
                            Subtotal: {product.price * product.quantity}
                        </p>
                        <button
                            onDoubleClick={() =>
                                dispatch(removeFromCart(product._id))
                            }
                            className="bg-red-500 hover:bg-red-700 mt-4 text-white font-bold py-2 px-4 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartItem;
