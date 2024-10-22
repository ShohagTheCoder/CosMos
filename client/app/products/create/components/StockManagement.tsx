"use client";
import Button from "@/app/elements/buttons/Button";
import NumberInput from "@/app/elements/inputs/NumberInput";
import NotificationList from "@/app/elements/notification/NotificationList";
import handleImageUpload from "@/app/functions/handleImageUpload";
import useNotifications from "@/app/hooks/useNotifications";

import {
    setProductProduct,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StockManagement({
    image,
    setImage,
    validationHandler,
}: any) {
    const dispatch = useDispatch();
    let product = useSelector((state: RootState) => state.product);
    const [disable, setDisable] = useState(false);
    const { notifications, notifySuccess, notifyError } = useNotifications();

    async function handleCreateProduct() {
        if (!validationHandler.isValid()) {
            // Show errors in notifications if any
            for (let [key, value] of Object.entries(validationHandler.errors)) {
                notifyError(`${key}: ${value}`);
            }
            return;
        }

        // Disable the create button
        setDisable(true);

        try {
            let finalProduct = { ...product };

            if (image) {
                finalProduct.image = product.SKU + "-" + image.name;
                await handleImageUpload(image, {
                    url: "/api/uploads/images/products",
                    fieldName: "image",
                    updateFileNameCallback: () => finalProduct.image,
                });
            }

            const result = await apiClient.post("products", finalProduct);
            dispatch(setProductProduct(result.data));
            setImage(null);

            notifySuccess("Product created successfully!");
            console.log(result.data);
        } catch (error) {
            notifyError("Failed to create product.");
            console.error(error);
        } finally {
            setDisable(false);
        }
    }

    async function handleUpdateProduct() {
        setDisable(true);

        let update = Object.entries(product).reduce(
            (acc: any, [key, value]) => {
                if (
                    product.product &&
                    key in product.product &&
                    value !== product.product[key] &&
                    key !== "product"
                ) {
                    acc[key] = value;
                }
                return acc;
            },
            {}
        );

        try {
            let finalProduct = { ...update };

            if (image) {
                finalProduct.image = product.SKU + "-" + image.name;
                await handleImageUpload(image, {
                    url: "/api/uploads/images/products",
                    fieldName: "image",
                    updateFileNameCallback: () => finalProduct.image,
                });
            }

            const result = await apiClient.patch(
                `products/${product._id}`,
                finalProduct
            );
            dispatch(setProductProduct(result.data));
            setImage(null);
            notifySuccess("Product updated successfully!");
        } catch (error) {
            notifyError("Failed to update product.");
            console.error(error);
        } finally {
            setDisable(false);
        }
    }

    return (
        <div className="w-[600px]">
            <NotificationList notifications={notifications} />
            <div className="grid grid-cols-2 gap-6">
                <NumberInput
                    className="mb-3"
                    value={product.stockLow}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "stockLow",
                                value: parseInt(e.target.value),
                            })
                        )
                    }
                    options={{
                        label: "Stock low",
                        placeholder: "Minimum stock to inform Ex: 45",
                    }}
                />
                <NumberInput
                    className="mb-5"
                    value={product.stockAlert}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "stockAlert",
                                value: parseInt(e.target.value),
                            })
                        )
                    }
                    options={{
                        label: "Stock alert",
                        placeholder: "Minimum stock to alert Ex: 20",
                    }}
                />
            </div>
            <div className="p-4 border border-gray-600 mb-4 text-gray-300 text-lg">
                <p>পন্যের নমুনা :</p>
                <p className="border-b-2 my-2 border-dashed border-gray-600"></p>
                <p>নাম : {product.name}</p>
                <p>বর্ননা : {product.description}</p>
                <p>দাম : {product.price} ৳</p>
                <p>মাপ : {product.unit}</p>
            </div>
            {product._id ? (
                <Button
                    disabled={disable}
                    onDoubleClick={handleUpdateProduct}
                    className="w-full py-4"
                >
                    Update Product
                </Button>
            ) : (
                <Button
                    disabled={disable}
                    onDoubleClick={handleCreateProduct}
                    className="w-full py-4"
                >
                    Create Product
                </Button>
            )}
        </div>
    );
}
