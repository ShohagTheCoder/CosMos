import React from "react";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    getProductsInServerForPurchase,
    getSuppliersInServer,
    getUserInServer,
} from "./../functions/apiHandlers";
import { cookies } from "next/headers";
import Purchase from "../components/Purchase";
import { SupplierWithId } from "@/app/interfaces/supplier.interface";

async function page() {
    const products: ProductWithID[] = await getProductsInServerForPurchase();
    const suppliers: SupplierWithId[] = await getSuppliersInServer();

    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;
    const user: any = await getUserInServer(userId!);
    return (
        <div>
            <Purchase
                productsArray={products}
                suppliersArray={suppliers}
                receiver={user}
            />
        </div>
    );
}

export default page;
