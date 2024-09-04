import React from "react";
import Sell from "../components/Main";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import {
    getCustomersInServer,
    getProductsInServer,
    getUserInServer,
} from "./functions/apiHandlers";
import { cookies } from "next/headers";

async function page() {
    const products: Record<string, ProductWithID> = await getProductsInServer();
    const customers: Record<string, CustomerWithId> =
        await getCustomersInServer();

    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;
    if (!userId) return "UserId or user not found";
    const user: any = await getUserInServer(userId);

    return (
        <div>
            <Sell products={products} customers={customers} user={user} />
        </div>
    );
}

export default page;
