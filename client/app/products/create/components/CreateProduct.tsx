import Button from "@/app/elements/buttons/Button";
import NumberInput from "@/app/elements/inputs/NumberInput";
import Notification, {
    NotificationType,
} from "@/app/elements/notification/Notification";
import {
    setProductProduct,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CreateProduct() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [notification, setNotification] = useState<{
        type: NotificationType;
        message: string;
    }>({
        type: "none",
        message: "This is a message",
    });

    async function handleCreateProduct() {
        console.log(product);
        // return;
        try {
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
        }
    }

    async function handleUpdateProduct() {
        console.log(product);
        // return;
        const update = Object.entries(product).reduce(
            (acc: any, [key, value]) => {
                if (value != product.product[key] && key != "product") {
                    acc[key] = value;
                }

                return acc;
            },
            {}
        );
        try {
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
        }
    }

    return (
        <div>
            <Notification
                type={notification.type}
                message={notification.message}
            />
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
                    label: "Stock low",
                    placeholder: "Minimum stock to alert Ex: 20",
                }}
            />

            {product._id ? (
                <Button onDoubleClick={handleUpdateProduct}>
                    Update Product
                </Button>
            ) : (
                <Button onDoubleClick={handleCreateProduct}>
                    Create Product
                </Button>
            )}
        </div>
    );
}

export default CreateProduct;
