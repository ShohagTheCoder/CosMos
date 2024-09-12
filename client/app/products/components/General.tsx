"use client";
import ImageInput from "@/app/elements/inputs/ImageInput";
import NumberInput from "@/app/elements/inputs/NumberInput";
import TextInput from "@/app/elements/inputs/TextInput";
import Textarea from "@/app/elements/textarea/Textarea";
import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductWithID } from "../interfaces/product.interface";

function General() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    let src: string | undefined | null = "/images/products/" + product.image;
    if (product.product && product.image != product.product.image) {
        src = null;
    }

    if (product.image != "product.jpg") {
        src = null;
    }

    return (
        <div className=" bg-gray-800 rounded-lg shadow-lg">
            <TextInput
                className="mb-3"
                value={product.SKU}
                onChange={(e) =>
                    dispatch(
                        updateProductField({
                            field: "SKU",
                            value: e.target.value,
                        })
                    )
                }
                options={{
                    label: "SKU",
                    validate: (value) => value.length >= 6,
                    validMessage: "SKU looks good!",
                    invalidMessage: "Plesase enter a valid SKU",
                    placeholder: "Ex: K4674D",
                }}
            />
            <TextInput
                className="mb-3"
                value={product.name}
                onChange={(e) =>
                    dispatch(
                        updateProductField({
                            field: "name",
                            value: e.target.value,
                        })
                    )
                }
                options={{
                    label: "Product Name",
                    validate: (value) => value.length >= 6,
                    validMessage: "Name looks good!",
                    invalidMessage: "Plesase enter a valid name",
                    placeholder: "Ex: Orange",
                }}
            />
            <NumberInput
                className="mb-3"
                value={product.priority}
                onChange={(e) =>
                    dispatch(
                        updateProductField({
                            field: "priority",
                            value: e.target.value,
                        })
                    )
                }
                options={{
                    label: "Product priority",
                    validate: (value) =>
                        parseInt(value) >= 1 && parseInt(value) <= 10,
                    validMessage: "Priority accepted!",
                    invalidMessage:
                        "Priority cannot be more then 10 or less then 1",
                    placeholder: "Ex: 0 or 3",
                }}
            />
            <ImageInput
                src={src}
                localTempName="selectedProductImage"
                callback={(image: File) => {
                    const imageName = product.SKU + "-" + image.name;
                    dispatch(
                        updateProductField({ field: "image", value: imageName })
                    );
                }}
            />
            <Textarea
                value={product.description}
                onChange={(e) =>
                    dispatch(
                        updateProductField({
                            field: "description",
                            value: e.target.value,
                        })
                    )
                }
                options={{
                    label: "Description",
                    textareaClassName: "resize-none",
                    placeholder: "Ex: A product of Banglades",
                    rows: 2,
                }}
            />
        </div>
    );
}

export default General;
