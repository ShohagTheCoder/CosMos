import apiClient from "@/app/utils/apiClient";
import React from "react";
import User from "./components/User";
import NoResponse from "@/app/common/components/NoResponse";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserPage({ params }: any) {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    let { id } = params();

    if (!id) {
        return <NoResponse />;
    }

    try {
        const { data: user } = await apiClient(`users/${id}`);
        const { data: account } = await apiClient(`accounts/${user.account}`);
        const { data: sells } = await apiClient(`sells/findByUser/${id}`);
        const { data: accounts } = await apiClient(`accounts`);

        // Call user component
        return (
            <User
                user={user}
                account={account}
                sells={sells}
                accounts={accounts}
            />
        );
    } catch (error) {
        return <NoResponse />;
    }
}
