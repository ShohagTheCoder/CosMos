"use client";

import { useEffect, useState } from "react";
import { ProductWithID } from "../products/interfaces/product.interface";
import apiClient from "../utils/apiClient";

export default function Sell() {
    const [products, setProducts] = useState<Record<string, ProductWithID>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient<ProductWithID[]>("products");
                const productsArray = response.data;

                const products = productsArray.reduce<
                    Record<string, ProductWithID>
                >((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {});
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main>
            <div className="container">d</div>
        </main>
    );
}
