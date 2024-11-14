import React from "react";
import "./style.css";
import Sidebar from "@/app/components/Sidebar";
import { cookies } from "next/headers";
import CreateProduct from "./components/CreateProduct";
import NoResponse from "@/app/common/components/NoResponse";
import { redirect } from "next/navigation";

export default async function CreateProductPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get("user-id")?.value;

        return (
            <div className="min-h-screen flex justify-center bg-gray-800 cosmos-scrollbar">
                <Sidebar userId={userId} active="createProduct" />
                <div className="container bg-gray-800 text-white overflow-hidden">
                    <CreateProduct />
                </div>
            </div>
        );
    } catch (error) {
        <NoResponse />;
    }
}
