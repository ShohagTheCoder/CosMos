"use client";
import Button from "@/app/elements/buttons/Button";
import NumberInput from "@/app/elements/inputs/NumberInput";
import Notification from "@/app/elements/notification/Notification";
import handleImageUpload from "@/app/functions/handleImageUpload";
import useNotification from "@/app/hooks/useNotification";
import {
    setProductProduct,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StockManagement({ image, setImage }: any) {
    const dispatch = useDispatch();
    let product = useSelector((state: RootState) => state.product);
    const [disable, setDisable] = useState(false);
    const { notification, notifySuccess, notifyError } = useNotification();

    async function handleCreateProduct() {
        setDisable(true);
        if (product.SKU.length < 4) {
            return console.log("Please enter SKU");
        }

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
            notifyError("Failed to update product.");
            console.error(error);
        } finally {
            setDisable(false);
        }
    }

    async function handleUpdateProduct() {
        setDisable(true);

        const update = Object.entries(product).reduce(
            (acc: any, [key, value]) => {
                if (value !== product.product[key] && key !== "product") {
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
            dispatch(setProductProduct({ ...product, ...result.data }));
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
            <Notification
                type={notification.type}
                message={notification.message}
                className="mb-3"
            />
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
            {product._id ? (
                <Button disabled={disable} onDoubleClick={handleUpdateProduct}>
                    Update Product
                </Button>
            ) : (
                <Button disabled={disable} onDoubleClick={handleCreateProduct}>
                    Create Product
                </Button>
            )}
        </div>
    );
}
