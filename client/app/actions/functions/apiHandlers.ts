import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { AxiosResponse } from "axios";
import { SupplierWithId } from "@/app/interfaces/supplier.interface";

// Utility function to handle errors
const handleError = (error: any, message: string) => {
    console.error("An error occurred:", error);
    // You can add more error handling logic here, like showing notifications or retrying
    throw new Error(message);
};

export async function getProductsInServer(): Promise<ProductWithID[]> {
    try {
        const res: AxiosResponse<ProductWithID[]> = await apiClient.get(
            "products"
        );
        return res.data;
    } catch (error) {
        handleError(error, "Failed to fetch products");
        return []; // Return an empty object if there's an error
    }
}
export async function getProductsInServerForPurchase(): Promise<
    ProductWithID[]
> {
    try {
        const res: AxiosResponse<ProductWithID[]> = await apiClient.get(
            "products/for-purchase"
        );
        return res.data;
    } catch (error) {
        handleError(error, "Failed to fetch products");
        return []; // Return an empty object if there's an error
    }
}

export async function getCustomersInServer() {
    try {
        const res: AxiosResponse<CustomerWithId[]> = await apiClient.get(
            "customers"
        );
        return res.data;
    } catch (error) {
        handleError(error, "Faild to fetch customers");
        return []; // Return an empty object if there's an error
    }
}
export async function getSuppliersInServer() {
    try {
        const res: AxiosResponse<SupplierWithId[]> = await apiClient.get(
            "suppliers"
        );
        return res.data;
    } catch (error) {
        handleError(error, "Faild to fetch suppliers");
        return [];
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
