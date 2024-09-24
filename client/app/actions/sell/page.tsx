import React from "react";
import Sell from "../components/Sell";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import {
    getCustomersInServer,
    getProductsInServer,
    getUserInServer,
} from "./../functions/apiHandlers";
import { cookies } from "next/headers";
import apiClient from "@/app/utils/apiClient";
import ReloadButton from "./components/ReloadButton";

async function page() {
    try {
        const products: ProductWithID[] = await getProductsInServer();
        const customers: CustomerWithId[] = await getCustomersInServer();
        const { data: commands } = await apiClient.get("commands");
        const cookiesList = cookies();
        const userId = cookiesList.get("user-id")?.value;
        const user: any[] = await getUserInServer(userId!);
        const { data: setting } = await apiClient.get(
            `settings/findByUserId/${userId}`
        );

        return (
            <div>
                <Sell
                    productsArray={products}
                    customersArray={customers}
                    user={user}
                    commands={commands}
                    setting={setting}
                />
            </div>
        );
    } catch (error: any) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center h-screen">
                <p className="text-center">
                    Server is not running <br /> or somthing went wrong!
                </p>
                <ReloadButton text="Retry" />
            </div>
        );
    }
}

export default page;
