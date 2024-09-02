"use client";
import React, { useEffect } from "react";
import "./../../create/style.css";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "@/app/store/slices/productSlice";
import General from "../../components/General";
import UnitsTab from "../components/UnitsTab";
import Resources from "../../create/components/Resources";
import CreateProduct from "../../create/components/CreateProduct";
import { RootState } from "@/app/store/store";
import Tab from "@/app/elements/tab/Tab";

function UpdateProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    useEffect(() => {
        apiClient.get(`products/${id}`).then((res) => {
            dispatch(
                setProduct({
                    ...res.data,
                    _id: id,
                    product: res.data,
                })
            );
        });

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
            <div className="text-center mt-5">
                <p>Loading</p>
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
            content: <CreateProduct />,
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

export default UpdateProduct;
