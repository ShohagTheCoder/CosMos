"use client";
import React, { useEffect } from "react";
import "./style.css";
import CreateProductTabs from "./components/CreateProductTabs";

function CreateProduct() {
    useEffect(() => {
        const handleBeforeUnload = (e: any) => {
            e.returnValue = "Are you sure you want to leave or refresh?";
            return "Are you sure you want to leave or refresh?";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div className="container max-w-[800px] mt-4 mx-auto bg-gray-800 text-white">
            <div className="bg-gray-700 shadow-md rounded px-5 pt-6 pb-5 mb-4">
                <CreateProductTabs />
            </div>
        </div>
    );
}

export default CreateProduct;
