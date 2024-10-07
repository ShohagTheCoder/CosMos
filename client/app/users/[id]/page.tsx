import React from "react";
import User from "./components/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import apiServer from "@/app/utils/apiServer";
import ErrorResponse from "@/app/common/components/ErrorResponse";

export default async function UserPage({ params }: any) {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    let { id } = params;

    try {
        const { data: user } = await apiServer.get(`users/${id}`);
        const { data: account } = await apiServer.get(
            `accounts/${user.account}`
        );
        const { data: sells } = await apiServer.get(`sells/findByUser/${id}`);
        const { data: accounts } = await apiServer.get(`accounts`);

        // Call user component
        return (
            <User
                user={user}
                account={account}
                sells={sells}
                accounts={accounts}
            />
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
