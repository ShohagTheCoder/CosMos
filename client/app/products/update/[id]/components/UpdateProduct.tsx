"use client";
import React, { useEffect, useState } from "react";
import PulseFadeLoading from "@/app/elements/loding/PulseFadeLoading";
import Tab from "@/app/elements/tab/Tab";
import General from "@/app/products/components/General";
import Resources from "@/app/products/create/components/Resources";
import StockManagement from "@/app/products/create/components/StockManagement";
import { useDispatch } from "react-redux";
import { setProduct } from "@/app/store/slices/productSlice";
import UnitsTab from "@/app/products/components/UnitsTab";

export default function UpdateProduct({ product }: any) {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);

    useEffect(() => {
        dispatch(setProduct(product));
    }, []);

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

    if (!product._id)
        return (
            <div className="h-svh flex justify-center items-center">
                <PulseFadeLoading />
            </div>
        );

    const tabs = [
        {
            id: "general",
            title: "General",
            content: <General />,
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
            content: <StockManagement image={image} setImage={setImage} />,
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
            tabHeader: "p-3",
            tabContent: "p-5",
            buttonContainer: "p-3",
        },
        titleAlignment: "center", // Ensure this value matches the allowed types
    };

    return (
        <div className="container max-w-3xl mt-4 mx-auto bg-gray-800 text-white">
            <div className="">
                <Tab tabs={tabs} options={options} />
            </div>
        </div>
    );
}
