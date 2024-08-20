import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    changeActiveProduct,
    updateUnit,
    updateQuantity,
} from "../../store/slices/cartSlice"; // Assuming your cart slice location
import { RootState } from "../../store/store";
import { ProductWithID } from "@/app/products/interfaces/product.interface";

export interface Product {
    _id: string; // MongoDB unique identifier
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
    quantity: number;
}

function CartProduct() {
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);

    const handleDecrement = (_id: string) => {
        let product = cart.products[_id];
        if (product.quantity > 1) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = (_id: string) => {
        let product = cart.products[_id];
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    return (
        <div className="cart">
            <div className="border flex p-2">
                <p>Actions :</p>
                <p className="w-[80px]"></p>
                <button className="bg-red-700 px-2 py-1">Delete</button>
            </div>
            {Object.values(cart.products).map((product: ProductWithID) => (
                <div
                    key={product._id}
                    className={`flex products-center py-4 px-3 ${
                        product._id == cart.activeProduct ? "bg-green-950" : ""
                    }`}
                >
                    <img
                        src="product.jpeg"
                        alt={product.name}
                        className="h-[90px] object-cover mr-4"
                        onClick={() =>
                            dispatch(changeActiveProduct(product._id))
                        }
                    />
                    <div className="flex-1">
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <p className="text-gray-200">
                            1
                            {product.units[product.unit].base +
                                " = " +
                                product.price.toLocaleString() +
                                " tk"}
                        </p>
                        <p>
                            1 {product.unit} ={" "}
                            {product.units[product.unit].value +
                                " " +
                                product.units[product.unit].base +
                                " * " +
                                product.quantity +
                                " = " +
                                (
                                    product.units[product.unit].value *
                                    product.quantity
                                ).toLocaleString() +
                                " " +
                                product.units[product.unit].base}
                        </p>
                        <div className="flex products-center mt-2">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded"
                                onClick={() => handleDecrement(product._id)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="h-[40px] bg-black w-[66px] text-white p-2"
                                value={product.quantity}
                                onChange={(e) =>
                                    dispatch(
                                        updateQuantity({
                                            key: product._id,
                                            quantity: parseInt(e.target.value),
                                        })
                                    )
                                }
                            />

                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
                                onClick={() => handleIncrement(product._id)}
                            >
                                +
                            </button>
                            <div>
                                <select
                                    className="h-[40px] p-1 bg-black text-white p-2 mx-2"
                                    value={product.unit}
                                    onChange={(e) =>
                                        dispatch(
                                            updateUnit({
                                                key: product._id,
                                                unit: e.target.value,
                                            })
                                        )
                                    }
                                >
                                    {Object.values(product.units).map(
                                        (unit) => (
                                            <option
                                                key={unit.unit}
                                                value={unit.unit}
                                            >
                                                {unit.unit}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-medium">
                            Subtotal: {product.subTotal.toLocaleString()}
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

export default CartProduct;
