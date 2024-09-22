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

async function page() {
    const products: ProductWithID[] = await getProductsInServer();
    const customers: CustomerWithId[] = await getCustomersInServer();
    const { data: commands } = await apiClient.get("commands");

    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;
    const user: any[] = await getUserInServer(userId!);
    return (
        <div>
            <Sell
                productsArray={products}
                customersArray={customers}
                user={user}
                commands={commands}
            />
        </div>
    );
}

export default page;
