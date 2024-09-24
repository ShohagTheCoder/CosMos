"use client";
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";
import Product, { ProductWithID } from "./interfaces/product.interface";
import { ERROR, NONE, SUCCESS } from "../utils/constants/message";
import Notification, {
    NotificationProps,
} from "../elements/notification/Notification";
import PulseFadeLoading from "../elements/loding/PulseFadeLoading";
import AddIcon from "../icons/AddIcon";
import exportProducts from "../functions/exportProducts";

export default function Products() {
    const [products, setProducts] = useState<ProductWithID[]>([]);
    const [notification, setNotification] = useState<NotificationProps>({
        message: "",
        type: NONE,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await apiClient.get("products");
                setProducts(result.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    async function handleDeleteProduct(_id: any, index: number) {
        const sure = window.confirm("Are you sure to delete the product?");
        if (sure) {
            try {
                const result = await apiClient.delete(`products/${_id}`);
                const updatedProducts = [...products];
                updatedProducts.splice(index, 1);
                setProducts(updatedProducts);
                setNotification({
                    message: "Product deleted successfully",
                    type: SUCCESS,
                });
            } catch (error) {
                console.log("failed to delete product");
                setNotification({
                    message: "Faild to delete product",
                    type: ERROR,
                });
            }
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-800">
            <div className="container max-w-[1200px] mx-auto px-4 pt-8 pb-4">
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
                <div className="flex items-center justify-between gap-6 mb-4">
                    <h2 className="text-2xl font-bold">Products</h2>
                    <div className="w-auto flex gap-3 items-center">
                        <button onClick={() => exportProducts(products)}>
                            Export
                        </button>
                        <button className="flex gap-3">
                            Import <AddIcon />
                        </button>
                        <Link
                            href="/products/create"
                            target="_blank"
                            className="bg-gray-700 py-2 px-3 hover:bg-green-700 rounded-md flex gap-3 items-center"
                        >
                            Create <AddIcon />
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.length == 0 ? (
                        <div className="col-span-6 min-h-[400px] flex justify-center items-center">
                            <PulseFadeLoading />
                        </div>
                    ) : (
                        <>
                            {products.map((product: Product, index: number) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-3 flex flex-col justify-between"
                                >
                                    <img
                                        src={`images/products/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-t-md"
                                    />
                                    <div className="pt-3">
                                        <h3 className="text-lg font-bold mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                                            {product.description}
                                        </p>
                                        <p className="text-xl font-semibold mb-4">
                                            ${product.price}
                                        </p>
                                        <div className="flex justify-between">
                                            <Link
                                                target="_black"
                                                href={`/products/update/${product._id}`}
                                                className="bg-gray-800 hover:bg-green-700 py-1 px-3 rounded-md"
                                            >
                                                Update
                                            </Link>
                                            <button
                                                onDoubleClick={() =>
                                                    handleDeleteProduct(
                                                        product._id,
                                                        index
                                                    )
                                                }
                                                className="bg-gray-800 hover:bg-red-700 py-1 px-3 rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
