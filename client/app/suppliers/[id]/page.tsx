"use client";

import { useEffect, useState } from "react";
import apiClient from "@/app/utils/apiClient";
import { useParams } from "next/navigation";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import SelectProductPopup from "@/app/components/SelectProductPopup";
import Button from "@/app/elements/buttons/Button";

interface Supplier {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    products: string[];
}

interface Product {
    _id: string;
    name: string;
    price: number;
    // Add other product fields as needed
}

export default function ViewSupplier() {
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        const fetchSupplier = async () => {
            if (!id) return;

            try {
                const response = await apiClient.get(`suppliers/${id}`);
                setSupplier(response.data);
                // setSupplier({
                //     ...response.data,
                //     products: ["66d0aa8f156ec0fcee3d4919"],
                // });
            } catch (error) {
                setError("Failed to fetch supplier details.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplier();

        apiClient
            .get("products")
            .then((res) => setProducts(res.data))
            .catch((error) => console.log(error));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Loading supplier details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p>Supplier not found.</p>
            </div>
        );
    }

    function handleAddProductPopup() {
        setPopup(!popup);
    }

    function handlePopupClose() {
        setPopup(false);
    }

    async function handleCallback(res: ProductWithID) {
        handlePopupClose();
        const prev = supplier?.products?.find((i) => i == res._id);
        if (prev) return;
        const products = supplier?.products || [];
        products?.push(res._id);
        try {
            await apiClient.patch(`suppliers/add-product/${supplier?._id}`, {
                productId: res._id,
            });
            setSupplier((i: any) => ({
                ...i,
                products: products,
            }));
        } catch (error) {
            console.log(error);
        }
    }

    async function handleRemoveProduct(id: string) {
        const confirmRemoval = window.confirm(
            "Are you sure you want to remove the product from the supplier?"
        );

        if (confirmRemoval && supplier?.products) {
            const products = [...supplier.products]; // Create a shallow copy of the products array
            const index = products.indexOf(id);

            if (index !== -1) {
                products.splice(index, 1); // Remove the product from the array

                try {
                    await apiClient.delete(
                        `suppliers/remove-product/${supplier._id}`,
                        {
                            data: { productId: id }, // Make sure to pass data correctly in the request
                        }
                    );

                    setSupplier((prev: any) => ({
                        ...prev,
                        products,
                    }));
                } catch (error) {
                    console.error("Failed to remove the product:", error);
                }
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            {popup == true ? (
                <SelectProductPopup
                    products={products}
                    callback={handleCallback}
                    handleClose={handlePopupClose}
                />
            ) : (
                ""
            )}
            <div className="container max-w-[1200px] mx-auto">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg grid grid-cols-2">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">
                            {supplier.name}
                        </h1>
                        <p className="mb-2">
                            <strong>Email:</strong> {supplier.email}
                        </p>
                        <p className="mb-2">
                            <strong>Phone Number:</strong>{" "}
                            {supplier.phoneNumber}
                        </p>
                        <p className="mb-4">
                            <strong>Address:</strong> {supplier.address}
                        </p>
                        <h2 className="text-2xl font-semibold mb-3">
                            Products
                        </h2>
                        <Button
                            onClick={handleAddProductPopup}
                            className="mb-3"
                        >
                            Add products +
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <p className="text-center">Products</p>
                        {supplier.products && supplier.products.length > 0 ? (
                            <ul className="space-y-2">
                                {supplier.products.map((id) => {
                                    const product: ProductWithID =
                                        products.find(
                                            (i: ProductWithID) => i._id == id
                                        )!;
                                    if (product) {
                                        return (
                                            <li
                                                key={product._id}
                                                className="bg-gray-700 p-3 rounded-md"
                                            >
                                                <div className="grid grid-cols-2">
                                                    <div>
                                                        <p>
                                                            <strong>
                                                                Name:
                                                            </strong>{" "}
                                                            {product.name}
                                                        </p>
                                                        <p>
                                                            <strong>
                                                                Price:
                                                            </strong>{" "}
                                                            $
                                                            {product.price.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                    {/* Add more product details as needed */}
                                                    <div className="flex justify-end items-center">
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveProduct(
                                                                    id
                                                                )
                                                            }
                                                            className="h-[30px] w-[30px] bg-red-700 hover:bg-red-500 rounded-full"
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    } else {
                                        return (
                                            "Product not found with id : " + id
                                        );
                                    }
                                })}
                            </ul>
                        ) : (
                            <p>No products availabel for this supplier.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
