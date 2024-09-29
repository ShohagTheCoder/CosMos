import React from "react";
import "./style.css";
import Sidebar from "@/app/components/Sidebar";
import { cookies } from "next/headers";
import CreateProduct from "./components/CreateProduct";
import NoResponse from "@/app/common/components/NoResponse";

function CreateProductPage() {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get("user-id")?.value;

        return (
            <div className="min-h-screen max-auto flex justify-center bg-gray-800">
                <Sidebar userId={userId} active="createProduct" />
                <div className="container w-auto inline-block transition-all my-5 mx-auto rounded-md bg-gray-800 text-white">
                    <CreateProduct />
                </div>
            </div>
        );
    } catch (error) {
        <NoResponse />;
    }
}

export default CreateProductPage;
