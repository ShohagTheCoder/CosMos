"use client";
import React from "react";
import "./style.css";
import CreateProductTabs from "./components/CreateProductTabs";

function CreateProduct() {
    return (
        <div className="container max-w-[800px] mt-4 mx-auto bg-gray-800 text-white">
            <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <CreateProductTabs />
            </div>
        </div>
    );
}

export default CreateProduct;
