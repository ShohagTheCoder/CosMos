import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { AxiosResponse } from "axios";
import { SupplierWithId } from "@/app/interfaces/supplier.interface";

export async function getProductsInServer(): Promise<ProductWithID[]> {
    try {
        const res = await apiClient.get("products");
        return res.data.data;
    } catch (error) {
        return []; // Return an empty object if there's an error
    }
}
export async function getProductsInServerForPurchase(): Promise<
    ProductWithID[]
> {
    try {
        const res = await apiClient.get("products/for-purchase");
        return res.data;
    } catch (error) {
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
        return [];
    }
}

export async function getUserInServer(id: string) {
    try {
        const response = await apiClient.get(`users/${id}`);
        return response.data;
    } catch (error) {
        return {};
    }
}
