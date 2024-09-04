import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { AxiosResponse } from "axios";
import { arrayToObjectById } from "./arrayToObjectById";

// Utility function to handle errors
const handleError = (error: any, message: string) => {
    console.error("An error occurred:", error);
    // You can add more error handling logic here, like showing notifications or retrying
    throw new Error(message);
};

export async function getProductsInServer() {
    try {
        const res: AxiosResponse<ProductWithID[]> = await apiClient.get(
            "products"
        );
        return arrayToObjectById(res.data);
    } catch (error) {
        handleError(error, "Faild to fetch products");
    }
}

export async function getCustomersInServer() {
    try {
        const res: AxiosResponse<CustomerWithId[]> = await apiClient.get(
            "customers"
        );
        return arrayToObjectById(res.data);
    } catch (error) {
        handleError(error, "Faild to fetch customers");
    }
}
export async function getSuppliersInServer() {
    try {
        const res: AxiosResponse<object[]> = await apiClient.get("suppliers");
        return arrayToObjectById(res.data);
    } catch (error) {
        handleError(error, "Faild to fetch suppliers");
    }
}

export async function getUserInServer(id: string) {
    try {
        const response = await apiClient.get(`users/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, "Faild to fetch user");
    }
}
