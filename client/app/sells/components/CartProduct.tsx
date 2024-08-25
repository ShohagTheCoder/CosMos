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
        if (product.quantity > 0) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = (_id: string) => {
        let product = cart.products[_id];
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    return (
        <div className="cart">
            {Object.values(cart.products).map((product: ProductWithID) => (
                <div
                    key={product._id}
                    className="mb-3 border border-dashed border-2 border-slate-500"
                >
                    <div
                        className={`flex flex-wrap py-4 px-3 ${
                            product._id == cart.activeProduct
                                ? "bg-green-950"
                                : ""
                        }`}
                    >
                        <img
                            src="product.jpg"
                            alt={product.name}
                            className="h-[90px] object-cover mr-4"
                            onClick={() =>
                                dispatch(changeActiveProduct(product._id))
                            }
                        />
                        <div className="overflow-hidden">
                            <h3 className="text-lg font-medium">
                                {product.name}
                            </h3>
                            <p className="text-gray-200">
                                1
                                {product.units[product.unit].base +
                                    " = " +
                                    product.price.toLocaleString()}{" "}
                                <span> ৳</span>
                            </p>
                            <p>
                                {product.saleUnitsBase == product.unit ? (
                                    ""
                                ) : (
                                    <div>
                                        1 {product.unit} ={" "}
                                        {product.units[product.unit].value +
                                            " " +
                                            product.units[product.unit].base +
                                            " * " +
                                            product.quantity +
                                            " = " +
                                            (
                                                product.units[product.unit]
                                                    .value * product.quantity
                                            ).toLocaleString() +
                                            " " +
                                            product.units[product.unit].base}
                                    </div>
                                )}
                            </p>
                        </div>
                        <div className="w-full flex flex-wrap products-center mt-4 justify-between items-center">
                            <div className="flex flex-warp">
                                <button
                                    className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                    onClick={() => handleDecrement(product._id)}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="no-spin h-[40px] w-[70px] bg-black  outline-none text-white text-center"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        dispatch(
                                            updateQuantity({
                                                key: product._id,
                                                quantity: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        )
                                    }
                                />

                                <button
                                    className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                    onClick={() => handleIncrement(product._id)}
                                >
                                    +
                                </button>
                                <div>
                                    <select
                                        className="h-[40px] bg-black text-white p-2 outline-none"
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
                            <div className="flex flex-wrap items-center">
                                <p className="text-lg font-medium">
                                    মোট :{" "}
                                    {product.subTotal.toLocaleString("Bn-bd")}
                                    <span> ৳</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CartProduct;
