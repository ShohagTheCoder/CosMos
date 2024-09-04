import React from "react";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    getProductsInServer,
    getSuppliersInServer,
    getUserInServer,
} from "./../functions/apiHandlers";
import { cookies } from "next/headers";
import Purchase from "../components/Purchase";
import { SupplierWithId } from "@/app/interfaces/supplier.interface";

async function page() {
    const products: Record<string, ProductWithID> = await getProductsInServer();
    const suppliers: Record<string, SupplierWithId> =
        await getSuppliersInServer();

    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;
    if (!userId) return "UserId or user not found";
    const user: any = await getUserInServer(userId);

    return (
        <div>
            <Purchase products={products} suppliers={suppliers} user={user} />
        </div>
    );
}

export default page;
