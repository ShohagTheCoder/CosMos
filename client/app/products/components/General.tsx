"use client";
import ImageInput from "@/app/elements/inputs/ImageInput";
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
import { ProductWithID } from "../interfaces/product.interface";
import CreateCategory from "@/app/categories/create/page";
import CreateBrand from "@/app/brands/create/page";

function General({ image, setImage, validationHandler }: any) {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [products, setProducts] = useState<ProductWithID[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [createBrandPopup, setCreateBrandPopup] = useState<boolean>(false);
    const [createCategoryPopup, setCreateCategoryPopup] =
        useState<boolean>(false);

    async function handlePopupClose() {
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
        }
        setCreateBrandPopup(false);
        setCreateCategoryPopup(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, brandsResponse, categoriesResponse] =
                    await Promise.all([
                        apiClient.get("products"),
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

                setProducts(productsResponse.data.data);
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
            {createCategoryPopup || createBrandPopup ? (
                <div className="h-auto w-screen fixed z-50 left-0 top-0">
                    <div className="flex w-full justify-end p-5">
                        <button
                            onClick={() => handlePopupClose()}
                            className="h-[40px] w-[40px] text-2xl bg-red-500 text-white"
                        >
                            x
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}
            {createCategoryPopup ? (
                <div className="bg-gray-800 fixed top-0 left-0 h-screen w-screen z-20">
                    <CreateCategory />
                </div>
            ) : (
                ""
            )}
            {createBrandPopup ? (
                <div className="bg-gray-800 fixed top-0 left-0 h-screen w-screen z-30">
                    <CreateBrand />
                </div>
            ) : (
                ""
            )}
            <div className="mb-3">
                <TextInput
                    className=""
                    value={product.barcode}
                    onChange={(e) => {
                        dispatch(
                            updateProductField({
                                field: "barcode",
                                value: e.target.value,
                            })
                        );
                    }}
                    options={{
                        label: "Barcode",
                        validate: (barcode) =>
                            validationHandler.validate("barcode", barcode, [
                                () =>
                                    products.some((p) => p.barcode === barcode)
                                        ? "Barcode is already exist"
                                        : true,
                            ]),
                        validMessage: "Barcode looks good!",
                        invalidMessage: validationHandler.errors["barcode"],
                        placeholder: "Ex: 158485678",
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
                            value:
                                e.target.value.charAt(0).toUpperCase() +
                                e.target.value.slice(1),
                        })
                    )
                }
                options={{
                    label: "Product Name *",
                    validate: (value) =>
                        validationHandler.validate("Name", value, [
                            () =>
                                value.length >= 3 ? true : "Name is too short",
                        ]),
                    validMessage: "Name looks good!",
                    invalidMessage: validationHandler.errors["Name"],
                    placeholder: "Ex: Orange",
                }}
            />
            <div className="grid grid-cols-2 gap-5">
                <div className="flex justify-between items-start">
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
                        className="mb-3 flex-grow"
                    />
                    <button
                        onClick={() => setCreateCategoryPopup(true)}
                        className="text-gray-300 text-xl"
                    >
                        +
                    </button>
                </div>
                <div className="flex justify-between items-start">
                    <SearchableSelectInput
                        value={
                            typeof product.brand == "string"
                                ? product.brand
                                : ""
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
                        className="mb-3 flex-grow"
                    />
                    <button
                        onClick={() => setCreateBrandPopup(true)}
                        className="text-gray-300 text-xl"
                    >
                        +
                    </button>
                </div>
            </div>

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

            <div className="mt-3">
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
                        containerClassName: "w-full",
                    }}
                />
            </div>
        </div>
    );
}

export default General;
