import React from "react";
import NoResponse from "@/app/common/components/NoResponse";
import Sell from "../components/Sell";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import {
    getCustomersInServer,
    getUserInServer,
} from "./../functions/apiHandlers";
import { cookies } from "next/headers";
import apiClient from "@/app/utils/apiClient";
import { redirect } from "next/navigation"; // Import redirect

export default async function SellPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        // const products: ProductWithID[] = await getProductsInServer();
        const {
            data: { data: products },
        } = await apiClient.get("/products");
        const customers: CustomerWithId[] = await getCustomersInServer();
        const { data: commands } = await apiClient.get("commands");
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
        return <NoResponse />;
    }
}
