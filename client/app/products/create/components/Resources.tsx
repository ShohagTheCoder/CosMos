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
import { count } from "console";

function Resources() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const [products, setProducts] = useState([]);
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        apiClient.get("products").then((res) => setProducts(res.data));
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
        <div>
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
                <div className="flex items-center mb-3 bg-slate-900 py-2 px-4">
                    <p className="inline-block mr-3">Product has resources</p>
                    <div className="pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={product.hasResources}
                                onChange={handleHasResource}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
                {product.hasResources && product.saleUnitsBase ? (
                    <div className="">
                        <button
                            onClick={() => handleAddResource()}
                            className="py-2 px-3 me-3 bg-slate-900"
                        >
                            + Add Resource +
                        </button>
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
                            {Object.values(product.resources).map(
                                (resource: Resource, key: number) => {
                                    const pro: ProductWithID = products.find(
                                        (p: ProductWithID) => {
                                            return p._id == resource._id;
                                        }
                                    );

                                    if (pro) {
                                        return (
                                            <div key={key}>
                                                <div className="p-3 mb-3 bg-slate-800 flex flex-wrap">
                                                    <div className="mr-3">
                                                        <img
                                                            className="w-[80px]"
                                                            src="/product.jpg"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <p className="mb-2">
                                                                {pro.name}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            Unit:
                                                            <select
                                                                value={
                                                                    resource.unit
                                                                }
                                                                onChange={(e) =>
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
                                                                className="bg-slate-900 py-2 px-3 mx-2"
                                                            >
                                                                {Object.values(
                                                                    pro.units
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
                                                            Quantity :
                                                            <input
                                                                type="number"
                                                                value={
                                                                    resource.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    dispatch(
                                                                        updateProductResourceQuantity(
                                                                            {
                                                                                key: resource._id,
                                                                                quantity:
                                                                                    parseFloat(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ),
                                                                                product:
                                                                                    pro,
                                                                            }
                                                                        )
                                                                    )
                                                                }
                                                                className="bg-slate-900 py-1 px-3 mx-2 w-[120px]"
                                                            />
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
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

export default Resources;
