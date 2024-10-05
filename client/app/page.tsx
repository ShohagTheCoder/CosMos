import React from "react";
import Sidebar from "./components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "./common/components/NoResponse";
import Dashbaord from "./components/Dashbaord";

export default function DashboardPage() {
    const cookieStore = cookies();
    const userId = cookieStore.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        return (
            <div>
                <Sidebar active="dashboard" userId={userId} />
                <div>
                    <Dashbaord />
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
