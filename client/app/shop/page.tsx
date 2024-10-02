import apiClient from "@/app/utils/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "../components/Sidebar";
import NoResponse from "../common/components/NoResponse";
import Shop from "./components/Shop";

export default async function ShopPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: shop } = await apiClient.get("/users/shop");
        const { data: sells } = await apiClient.get("/sells");
        const { data: accounts } = await apiClient.get("/accounts");
        return (
            <div>
                <Sidebar userId={userId} active="shop" />
                <div>
                    <Shop shop={shop} sells={sells} accounts={accounts} />
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
