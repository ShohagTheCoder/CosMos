"use client";
import React, { useEffect } from "react";
import "./../../create/style.css";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setProduct } from "@/app/store/slices/productSlice";
import UpdateProductTabs from "../components/UpdateProductTabs";

function UpdateProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();

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
            <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <UpdateProductTabs />
            </div>
        </div>
    );
}

export default UpdateProduct;
