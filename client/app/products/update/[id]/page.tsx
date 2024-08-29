"use client";
import React, { useEffect } from "react";
import "./../../create/style.css";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setProduct } from "@/app/store/slices/productSlice";
import CreateProductTabs from "../../create/components/CreateProductTabs";

function UpdateProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();

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
    }, []);

    return (
        <div className="container max-w-[800px] mt-4 mx-auto bg-gray-800 text-white">
            <div className="bg-gray-700 shadow-md rounded px-5 pt-6 pb-5 mb-4">
                <CreateProductTabs />
            </div>
        </div>
    );
}

export default UpdateProduct;
