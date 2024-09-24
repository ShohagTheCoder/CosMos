import apiClient from "@/app/utils/apiClient";
import React from "react";
import User from "./components/User";
import NoResponse from "@/app/common/components/NoResponse";

export default async function UserPage({ params: { id = "undefined" } }: any) {
    if (id == "undefined") {
        return <NoResponse />;
    }

    try {
        const { data: user } = await apiClient(`users/${id}`);
        const { data: account } = await apiClient(`accounts/${user.account}`);
        const { data: sells } = await apiClient(`sells/findByUser/${id}`);

        // Call user component
        return <User user={user} account={account} sells={sells} />;
    } catch (error) {
        return <NoResponse />;
    }
}
