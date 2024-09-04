// apiService.ts
import apiClient from "@/app/utils/apiClient";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";

// Utility function to handle errors
const handleError = (error: any, message: string) => {
    console.error("An error occurred:", error);
    // You can add more error handling logic here, like showing notifications or retrying
    throw new Error(message);
};

export const fetchProducts = async () => {
    try {
        const response = await apiClient<ProductWithID[]>("products");
        return response.data.reduce<Record<string, ProductWithID>>(
            (acc, product) => {
                acc[product._id] = product;
                return acc;
            },
            {}
        );
    } catch (error) {
        handleError(error, "Falid to fetch products");
    }
};

export const fetchCustomers = async () => {
    try {
        const response = await apiClient<CustomerWithId[]>("customers");
        return response.data.reduce<Record<string, CustomerWithId>>(
            (acc, customer) => {
                acc[customer._id] = customer;
                return acc;
            },
            {}
        );
    } catch (error) {
        handleError(error, "Faild to fetch customers");
    }
};
export const fetchUser = async (id: string) => {
    try {
        const response = await apiClient.get(`users/${id}`);
        return response.data;
    } catch (error) {
        handleError(error, "Faild to fetch users");
    }
};
