import React from "react";
import Details from "./components/Details";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function DetailsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    return (
        <div>
            <Sidebar userId={userId} active="details" />
            <div className="ps-[90px] bg-gray-900 min-h-screen">
                <Details />
            </div>
        </div>
    );
}
