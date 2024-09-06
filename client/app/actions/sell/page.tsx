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

async function page() {
    const products: ProductWithID[] = await getProductsInServer();
    const customers: CustomerWithId[] = await getCustomersInServer();

    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;
    const user: any = await getUserInServer(userId!);
    return (
        <div>
            <Sell
                productsArray={products}
                customersArray={customers}
                user={user}
            />
        </div>
    );
}

export default page;
