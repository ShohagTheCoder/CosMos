import { useDispatch } from "react-redux";
import { CartManager } from "./managers/cartManager";
import {
    CartState,
    initialCartState,
    updateCartState,
} from "../slices/cartSlice";

let cartManagerInstance: CartManager<CartState> | null = null;

export default function useCartManager() {
    const dispatch = useDispatch();

    if (cartManagerInstance == null) {
        cartManagerInstance = new CartManager(
            initialCartState,
            dispatch,
            updateCartState
        );
    }

    return cartManagerInstance;
}
