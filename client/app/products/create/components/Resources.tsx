import SelectProductPopup from "@/app/components/SelectProductPopup";
import {
    addResource,
    toggleProductHasResources,
    updateProductResourceQuantity,
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

    function handleCallback(product: ProductWithID) {
        handlePopupClose();
        const resource: Resource = {
            _id: product._id,
            SKU: product.SKU,
            name: product.name,
            hasResources: product.hasResources,
            resourcesCost: product.resourcesCost,
            unit: product.unit,
            price: product.price,
            quantity: product.quantity,
            subTotal: product.subTotal,
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
                <div className="flex items-center mb-3">
                    <p className="inline-block mr-3">Product has resources</p>
                    <div className="pt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                onChange={handleHasResource}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
                {product.hasResources ? (
                    <div className="border p-3">
                        <button
                            onClick={() => handleAddResource()}
                            className="py-2 px-3 me-3 bg-slate-900"
                        >
                            Add Resource
                        </button>
                        <div className="products border">
                            {product.resources.map(
                                (product: ProductWithID, key: number) => (
                                    <div key={key}>
                                        <div className="product">
                                            <p>{product.name}</p>
                                            Unit:
                                            <select
                                                value={product.unit}
                                                className="bg-slate-900 py-2 px-3 mx-2"
                                            >
                                                {Object.values(
                                                    product.units
                                                ).map(
                                                    (
                                                        unit: Unit,
                                                        key: number
                                                    ) => (
                                                        <option
                                                            key={key}
                                                            value={unit.unit}
                                                        >
                                                            {unit.label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            Quantity :
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateProductResourceQuantity(
                                                            {
                                                                key,
                                                                quantity:
                                                                    parseFloat(
                                                                        e.target
                                                                            .value
                                                                    ),
                                                            }
                                                        )
                                                    )
                                                }
                                                className="bg-slate-900 py-1 px-3 mx-2 w-[120px]"
                                            />
                                        </div>
                                    </div>
                                )
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
