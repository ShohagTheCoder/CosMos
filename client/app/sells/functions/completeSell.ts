import { CartState } from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import { AxiosResponse } from "axios";

export const completeSell = async (cart: CartState) => {
    try {
        const result = await apiClient.post("/sells", cart);
        return result;
    } catch (error) {
        return error;
    }
};
