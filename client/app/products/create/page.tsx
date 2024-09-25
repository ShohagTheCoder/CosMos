"use client";
import React, { useEffect, useState } from "react";
import "./style.css";
import Tab from "@/app/elements/tab/Tab";
import Resources from "./components/Resources";
import CreateProduct from "./components/CreateProduct";
import General from "../components/General";
import UnitsTab from "../components/UnitsTab";

function CreateProductPage() {
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

    const [image, setImage] = useState(null);

    const tabs = [
        {
            id: "general",
            title: "General",
            content: <General image={image} setImage={setImage} />,
        },
        {
            id: "units",
            title: "Units",
            content: <UnitsTab />,
        },
        {
            id: "resources",
            title: "Resources",
            content: <Resources />,
        },
        {
            id: "create",
            title: "Create",
            content: <CreateProduct image={image} setImage={setImage} />,
        },
    ];

    const options: {
        navigator?: boolean;
        classes?: {
            container?: string;
            tabButton?: string;
            tabHeader?: string;
            tabContent?: string;
            buttonContainer?: string;
            button?: string;
        };
        titleAlignment?: "start" | "center" | "end"; // Correct type
    } = {
        navigator: true,
        classes: {
            container: "rounded-none",
            tabHeader: "p-3 border-dashed border-b-2 border-gray-500",
            tabContent: "px-1 py-5",
            buttonContainer: "p-3",
        },
        titleAlignment: "center", // Ensure this value matches the allowed types
    };

    return (
        <div className="min-h-screen max-auto flex justify-center bg-gray-800">
            <div className="container w-auto inline-block transition-all my-5 mx-auto rounded-md bg-gray-800 text-white">
                <div className="">
                    <Tab tabs={tabs} options={options} />
                </div>
            </div>
        </div>
    );
}

export default CreateProductPage;
