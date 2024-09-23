"use client";
import React, { useEffect } from "react";
import apiCall from "../common/apiCall"; // Adjust the import path accordingly

export default function Page() {
    useEffect(() => {
        const fetchProducts = () => {
            apiCall
                .get("/products/error")
                .success((data) => console.log("Fetched products:", data))
                .error((error) =>
                    console.log("Error fetching products:", error.message)
                )
                .finally(() =>
                    console.log("Fetch products operation completed.")
                );
        };

        fetchProducts();
    }, []);

    return <div>Products page</div>;
}
