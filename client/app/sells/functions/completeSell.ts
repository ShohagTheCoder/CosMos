import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import { AxiosResponse } from "axios";

/**
 * Completes a sell by making a POST request to the 'sells' endpoint.
 * @param {CartState} cart - The current cart state.
 * @returns {Promise<void>} - A promise that resolves when the request is complete.
 */
export const completeSell = async (
    cart: CartState
): Promise<AxiosResponse | Error> => {
    try {
        const result = await apiClient.post("/sells", {
            totalPrice: cart.totalPrice,
            user: {
                name: "Shohag Ahmed",
                age: 22,
            },
            cart: cart.items,
            note: "This is a note",
        });

        return result;
    } catch (error) {
        return error;
    }
};
