import { useDispatch } from "react-redux";
import { useRef } from "react";
import { CartManager } from "./managers/cartManager";
import {
    CartState,
    initialCartState,
    updateCartState,
} from "../slices/cartSlice";

export default function useCartManager() {
    const dispatch = useDispatch();
    const cartManagerInstance = useRef<CartManager<CartState> | null>(null);

    if (!cartManagerInstance.current) {
        cartManagerInstance.current = new CartManager(
            initialCartState,
            dispatch,
            updateCartState
        );
    }

    return cartManagerInstance.current;
}
