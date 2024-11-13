"use client";
import React, { useState } from "react";
import General from "../../components/General";
import UnitsTab from "../../components/UnitsTab";
import Resources from "./Resources";
import StockManagement from "./StockManagement";
import Tab from "@/app/elements/tab/Tab";
import useValidationHandler from "@/app/hooks/useValidationHandler";

export interface ErrorMap {
    [key: string]: string;
}

export default function CreateProduct() {
    const validationHandler = useValidationHandler({
        Name: "Please enter Name",
    });

    const [image, setImage] = useState(null);

    const tabs = [
        {
            id: "general",
            title: "General",
            content: (
                <General
                    image={image}
                    setImage={setImage}
                    validationHandler={validationHandler}
                />
            ),
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
            content: (
                <StockManagement
                    image={image}
                    setImage={setImage}
                    validationHandler={validationHandler}
                />
            ),
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
        <div className="">
            <Tab tabs={tabs} options={options} />
        </div>
    );
}
