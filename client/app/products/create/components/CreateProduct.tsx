"use client";
import React, { useEffect, useState } from "react";
import General from "../../components/General";
import UnitsTab from "../../components/UnitsTab";
import Resources from "./Resources";
import StockManagement from "./StockManagement";
import Tab from "@/app/elements/tab/Tab";
import useValidationHandler from "@/app/hooks/useValidationHandler";
import { ProductWithID } from "../../interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export interface ErrorMap {
    [key: string]: string;
}

export default function CreateProduct() {
    const validationHandler = useValidationHandler({
        Name: "Please enter Name",
    });

    const product = useSelector((state: RootState) => state.product);

    const [similarProducts, setSimilarProducts] = useState<ProductWithID[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState(null);
    const [products, setProducts] = useState<ProductWithID[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse] = await Promise.all([
                    apiClient.get("products"),
                ]);

                setProducts(productsResponse.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (product.name.length > 0) {
            setSimilarProducts(
                products
                    .filter((p) =>
                        p.name
                            .toLocaleLowerCase()
                            .includes(product.name.toLocaleLowerCase())
                    )
                    .slice(0, 6)
            );
        } else {
            setSimilarProducts([]);
        }
    }, [product.name]);

    const tabs = [
        {
            id: "general",
            title: "General",
            content: (
                <General
                    products={products}
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

    if (loading) return <p>Loading</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 py-6 cosmos-scrollbar">
            <div className="col-span-2 flex justify-center">
                <div className="cosmos-scrollbar">
                    <Tab tabs={tabs} options={options} />
                </div>
            </div>
            <div className="col-span-1 border-l-2 border-gray-700 border-dashed ms-6 ps-6">
                <div className="w-full border-b-2 border-gray-600 border-dashed pb-4 mb-4">
                    <p className="text-xl">Similar products</p>
                </div>
                <div className="space-y-4">
                    {similarProducts.map((product: ProductWithID) => (
                        <div key={product._id} className="flex">
                            <div className="image">
                                <img
                                    src={`/images/products/${
                                        product.image || "product.jpg"
                                    }`}
                                    className="h-full w-[100px]"
                                    alt="product"
                                />
                            </div>
                            <div className="bg-gray-900 w-full py-2 px-3">
                                <p className="text-lg">{product.name}</p>
                                <p>
                                    {product.prices[0].unit}{" "}
                                    {product.prices[0].price} ৳
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
