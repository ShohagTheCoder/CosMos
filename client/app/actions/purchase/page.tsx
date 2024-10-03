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
import { redirect } from "next/navigation";
import NoResponse from "@/app/common/components/NoResponse";
import apiClient from "@/app/utils/apiClient";

export default async function PurchasePage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        let products: ProductWithID[] = await getProductsInServerForPurchase();
        const suppliers: SupplierWithId[] = await getSuppliersInServer();
        const { data: commands } = await apiClient.get("commands");
        const user: any = await getUserInServer(userId!);
        const { data: setting } = await apiClient.get(
            `settings/findByUserId/${userId}`
        );
        products = products.map((product) => {
            product.prices = product.purchasePrices;
            product.measurements = product.purchaseMeasurements;
            return product;
        });
        return (
            <div>
                <Purchase
                    productsArray={products}
                    suppliersArray={suppliers}
                    user={user}
                    commands={commands}
                    setting={setting}
                />
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
