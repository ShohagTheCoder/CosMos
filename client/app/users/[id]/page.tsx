import apiClient from "@/app/utils/apiClient";
import React from "react";
import User from "./components/User";

export default async function UserPage({ params: { id = "undefined" } }: any) {
    if (id == "undefined") {
        return "Id is undefined";
    }
    const { data: user } = await apiClient(`users/${id}`);
    const { data: account } = await apiClient(`accounts/${user.account}`);
    const { data: sells } = await apiClient(`sells/findByUser/${id}`);

    // Call user component
    return <User user={user} account={account} sells={sells} />;
}
