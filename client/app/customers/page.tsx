import React from "react";
import apiClient from "../utils/apiClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import Customers from "./components/Customers";
import ErrorResponse from "../common/components/ErrorResponse";
import apiServer from "../utils/apiServer";

export default async function CustomersPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: customers } = await apiServer().get("customers");
        return <Customers customers={customers} userId={userId} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
