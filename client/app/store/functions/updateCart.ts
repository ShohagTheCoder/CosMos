import getProductsTotalPrice from "@/app/functions/getProductsTotalPrice";
import { CartState } from "../slices/cartSlice";

export default function updateCart(state: CartState): CartState {
    state.totalPrice = getProductsTotalPrice(state.products);
    state.due = state.totalPrice - state.paid;
    return state;
}
