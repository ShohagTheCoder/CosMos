"use client";
import Brands from "@/app/brands/page";
import ImageInput from "@/app/elements/inputs/ImageInput";
import NumberInput from "@/app/elements/inputs/NumberInput";
import TextInput from "@/app/elements/inputs/TextInput";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import SearchableSelectInput from "@/app/elements/select/SearchableSelectInput";
import SelectInput from "@/app/elements/select/SelectInput";
import Textarea from "@/app/elements/textarea/Textarea";
import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function General() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [brands, setBrands] = useState([]);

    let src: string | undefined = undefined;
    if (
        product.product &&
        product.image &&
        product.image == product.product.image
    ) {
        src = "/images/products/" + product.image;
    } else if (product.image) {
        src = "updated";
    }

    useEffect(() => {
        localStorage.setItem("selectedProductImage", "");
        apiClient
            .get("brands")
            .then((res) => {
                setBrands(
                    res.data.reduce((acc: any[], item: any) => {
                        acc.push({
                            value: item._id,
                            label: item.name,
                        });
                        return acc; // Return the accumulator after pushing the item
                    }, [])
                );
            })
            .catch((err) => console.log(err));
    }, []);

    if (brands.length == 0) {
        return (
            <div className="h-svh">
                <PulseLoading />
            </div>
        );
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
            <div className="grid grid-cols-2 gap-5">
                <SearchableSelectInput
                    value={product.brand || ""}
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "brand",
                                value: e,
                            })
                        )
                    }
                    options={{
                        options: brands,
                        label: "Select brand",
                    }}
                    className="mb-3"
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
            </div>
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
