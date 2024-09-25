"use client";
import ImageInput from "@/app/elements/inputs/ImageInput";
import NumberInput from "@/app/elements/inputs/NumberInput";
import TagsInput from "@/app/elements/inputs/TagsInput";
import TextInput from "@/app/elements/inputs/TextInput";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import SearchableSelectInput from "@/app/elements/select/SearchableSelectInput";
import Textarea from "@/app/elements/textarea/Textarea";
import { updateProductField } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function General({ image, setImage }: any) {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsResponse, categoriesResponse] = await Promise.all([
                    apiClient.get("brands"),
                    apiClient.get("categories"),
                ]);

                setBrands(
                    brandsResponse.data.map((item: any) => ({
                        value: item._id,
                        label: item.name,
                    }))
                );

                setCategories(
                    categoriesResponse.data.map((item: any) => ({
                        value: item._id,
                        label: item.name,
                    }))
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[500px] w-[600px]">
                <PulseLoading />
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg w-[600px] mx-auto">
            <div className="grid grid-cols-2 gap-5">
                <TextInput
                    className="mb-3"
                    value={product.SKU}
                    onChange={(e) => {
                        dispatch(
                            updateProductField({
                                field: "SKU",
                                value: e.target.value,
                            })
                        );
                        if (image) {
                            dispatch(
                                updateProductField({
                                    field: "image",
                                    value: e.target.value + "-" + image.name,
                                })
                            );
                        }
                    }}
                    options={{
                        label: "SKU",
                        validate: (value) => value.length >= 6,
                        validMessage: "SKU looks good!",
                        invalidMessage: "Please enter a valid SKU",
                        placeholder: "Ex: K4674D",
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
                        label: "Product Priority",
                        validate: (value) =>
                            parseInt(value) >= 1 && parseInt(value) <= 10,
                        validMessage: "Priority accepted!",
                        invalidMessage: "Priority must be between 1 and 10",
                        placeholder: "Ex: 0 or 3",
                    }}
                />
            </div>
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
                    invalidMessage: "Please enter a valid name",
                    placeholder: "Ex: Orange",
                }}
            />
            <div className="grid grid-cols-2 gap-5">
                <SearchableSelectInput
                    value={
                        typeof product.category == "string"
                            ? product.category
                            : ""
                    }
                    onChange={(e) =>
                        dispatch(
                            updateProductField({
                                field: "category",
                                value: e,
                            })
                        )
                    }
                    options={{
                        options: categories,
                        label: "Select Category",
                    }}
                    className="mb-3"
                />
                <SearchableSelectInput
                    value={
                        typeof product.brand == "string" ? product.brand : ""
                    }
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
                        label: "Select Brand",
                    }}
                    className="mb-3"
                />
            </div>

            {product.SKU.length > 4 ? (
                <ImageInput
                    image={image}
                    previewImageUrl={
                        product.image
                            ? `/images/products/${product.image}`
                            : null
                    }
                    callback={(file: File) => {
                        setImage(file);
                        dispatch(
                            updateProductField({
                                field: "image",
                                value: product.SKU + "-" + file.name,
                            })
                        );
                    }}
                    options={{
                        label: "Product image",
                    }}
                />
            ) : (
                ""
            )}

            <TagsInput
                value={product.keywords}
                onChange={(keywords) =>
                    dispatch(
                        updateProductField({
                            field: "keywords",
                            value: keywords,
                        })
                    )
                }
                options={{
                    validate: (keywords) => keywords.length >= 3,
                    label: "Keywords",
                    placeholder: "Enter keywords...",
                    validMessage: "Valid keyword!",
                    invalidMessage:
                        "Keyword must be at least 3 characters long.",
                    inputClassName: "text-lg",
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
                    placeholder: "Ex: A product from Bangladesh",
                    rows: 2,
                }}
            />
        </div>
    );
}

export default General;
