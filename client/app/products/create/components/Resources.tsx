import SelectProductPopup from "@/app/components/SelectProductPopup";
import {
    addResource,
    toggleProductHasResources,
    updateProductResourceQuantity,
    updateProductResourceUnit,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ProductWithID,
    Resource,
    Unit,
} from "../../interfaces/product.interface";
import Switch from "@/app/elements/switch/Switch";
import Button from "@/app/elements/buttons/Button";
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";
import AddIcon from "@/app/icons/AddIcon";

function Resources() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [products, setProducts] = useState([]);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        apiClient.get("products").then((res) => setProducts(res.data.data));
    }, []);

    function handleAddResource() {
        setPopup(!popup);
    }

    function handleHasResource() {
        dispatch(toggleProductHasResources());
    }

    function handlePopupClose() {
        setPopup(false);
    }

    function handleCallback(res: ProductWithID) {
        handlePopupClose();
        const resource: Resource = {
            _id: res._id,
            unit: res.unit,
            quantity: res.quantity,
            count: res.count,
        };

        dispatch(addResource(resource));
    }

    return (
        <div className="w-[600px]">
            <div>
                {popup == true ? (
                    <SelectProductPopup
                        products={products}
                        callback={handleCallback}
                        handleClose={handlePopupClose}
                    />
                ) : (
                    ""
                )}
                <Switch
                    checked={product.hasResources}
                    onChange={handleHasResource}
                    label="Product Has resources"
                    className="justify-between bg-slate-900 py-4"
                />
                {product.hasResources && product.saleUnitsBase ? (
                    <div className="mt-3">
                        <div>
                            <p className="py-2 px-4 bg-green-700 text-white my-3">
                                Resouce mesurement{" "}
                                <span className="text-xl">
                                    {product.units[product.saleUnitsBase].label}
                                </span>{" "}
                                per of{" "}
                                <span className="text-xl">{product.name}</span>
                            </p>
                        </div>
                        <div className="">
                            {Object.values(product.resources || {}).map(
                                (resource: Resource, key: number) => {
                                    const pro: ProductWithID = products.find(
                                        (p: ProductWithID) => {
                                            return p._id == resource._id;
                                        }
                                    )!;

                                    if (pro) {
                                        return (
                                            <div key={key}>
                                                <div className="p-4 mb-3 bg-slate-900 flex flex-wrap">
                                                    <div className="mr-3">
                                                        <img
                                                            className="w-[80px]"
                                                            src={`/images/products/${
                                                                product.image ||
                                                                "product.jpg"
                                                            }`}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <p className="mb-2">
                                                                {pro.name}
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <div className="flex gap-3 items-center">
                                                                <p> Unit:</p>
                                                                <select
                                                                    value={
                                                                        resource.unit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        dispatch(
                                                                            updateProductResourceUnit(
                                                                                {
                                                                                    key: resource._id,
                                                                                    unit: e
                                                                                        .target
                                                                                        .value,
                                                                                    product:
                                                                                        pro,
                                                                                }
                                                                            )
                                                                        )
                                                                    }
                                                                    className="bg-slate-800 py-2 px-3 mx-2"
                                                                >
                                                                    {Object.values(
                                                                        pro.units ||
                                                                            {}
                                                                    ).map(
                                                                        (
                                                                            unit: Unit,
                                                                            key: number
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    key
                                                                                }
                                                                                value={
                                                                                    unit.unit
                                                                                }
                                                                            >
                                                                                {
                                                                                    unit.label
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <p>
                                                                    {" "}
                                                                    Quantity :
                                                                </p>
                                                                <NumberInputControl
                                                                    inputClassName="w-16"
                                                                    value={
                                                                        resource.quantity
                                                                    }
                                                                    onChange={(
                                                                        quantity
                                                                    ) =>
                                                                        dispatch(
                                                                            updateProductResourceQuantity(
                                                                                {
                                                                                    key: resource._id,
                                                                                    quantity,
                                                                                    product:
                                                                                        pro,
                                                                                }
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return "";
                                    }
                                }
                            )}
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="tertiary"
                                onClick={handleAddResource}
                            >
                                <AddIcon />
                            </Button>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

export default Resources;
