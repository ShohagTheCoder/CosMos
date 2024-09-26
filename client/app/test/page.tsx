"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useProductManager } from "./productManager";
import Com from "./Com";
import { CartManager } from "../store/providers/managers/cartManager";
import { initialCartState, updateCartState } from "../store/slices/cartSlice";
import { ProductWithID } from "../products/interfaces/product.interface";
import useCartManager from "../store/providers/cartProvider";

export default function TestPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);
    const cartManager = useCartManager();

    function handleClick() {
        cartManager
            .addToCart({
                _id: "12",
                name: "Apple",
                price: 88,
                count: 4,
                quantity: 1,
                subTotal: 99,
            })
            .save();
    }
    function handleClickRemove() {
        cartManager.remove("products", "12").save();
    }
    return (
        <div>
            <div className="w-[400px] mx-auto mt-[100px]">
                <p>{cart.totalPrice}</p>
                <p>{cart.paid}</p>
                <p>{cart.products["12"]?.quantity || 0}</p>
                <button onClick={handleClick}>Click</button>
                <button onClick={handleClickRemove}>Remove</button>
            </div>
            <div>{/* <Com /> */}</div>
        </div>
    );
}
