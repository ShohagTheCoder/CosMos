"use client";
import Button from "@/app/elements/buttons/Button";
import NumberInput from "@/app/elements/inputs/NumberInput";
import Notification, {
    NotificationType,
} from "@/app/elements/notification/Notification";
import handleImageUpload from "@/app/functions/handleImageUpload";
import {
    setProductProduct,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CreateProduct({ image }: any) {
    const dispatch = useDispatch();
    let product = useSelector((state: RootState) => state.product);
    const [initialImage, setInitialImage] = useState<File | undefined>(image);
    const [disable, setDisable] = useState(false);
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
    }>({
        type: "none",
        message: "This is a message",
    });

    useEffect(() => {
        setInitialImage(image); // Store the initial image when the component mounts or image changes
    }, [image]);

    async function handleCreateProduct() {
        setDisable(true);
        if (product.SKU.length < 4) {
            return console.log("Please enter SKU");
        }

        try {
            if (image) {
                await handleImageUpload(image, () => product.image);
            }

            const result = await apiClient.post("products", product);
            dispatch(setProductProduct(result.data));

            setNotification({
                type: "success",
                message: "Product created successfully!",
            });
            console.log(result.data);
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to create product.",
            });
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
            // Check if the image has changed
            if (image && image !== initialImage) {
                await handleImageUpload(image, () => product.image);
            }

            const result = await apiClient.patch(
                `products/${product._id}`,
                update
            );
            setNotification({
                type: "success",
                message: "Product updated successfully!",
            });
            console.log(result.data);
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to update product.",
            });
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

export default CreateProduct;
