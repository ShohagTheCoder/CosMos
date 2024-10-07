import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import Sidebar from "../components/Sidebar";
import Shop from "./components/Shop";
import ErrorResponse from "../common/components/ErrorResponse";
import apiServer from "../utils/apiServer";

export default async function ShopPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: shop } = await apiServer.get("/users/shop");
        const { data: accounts } = await apiServer.get("/accounts");
        return (
            <div>
                <Sidebar userId={userId} active="shop" />
                <div>
                    <Shop shop={shop} accounts={accounts} />
                </div>
            </div>
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
