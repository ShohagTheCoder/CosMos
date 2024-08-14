import { addToCart, CartItem } from "@/app/store/slices/cartSlice";
import { useDispatch } from "react-redux";

export default function useAddToCart() {
    const dispatch = useDispatch();

    const addToCartHandler = (product: CartItem) => {
        dispatch(addToCart(product));
    };

    return addToCartHandler;
}
