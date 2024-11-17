import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import redirect
import ErrorResponse from "@/app/common/components/ErrorResponse";
import apiServer from "@/app/utils/apiServer";
import Pending from "./components/Pending";
import Sidebar from "../components/Sidebar";

export default async function PendingPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: pendingSells } = await apiServer().get(`sells/pending`);

        return (
            <div>
                <Sidebar userId={userId} active="pending" />
                <div className="ps-[80px]">
                    <Pending sells={pendingSells} />
                </div>
            </div>
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
