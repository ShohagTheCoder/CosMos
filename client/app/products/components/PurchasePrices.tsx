import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPurchasePrice,
    removePurchasePrice,
    updateProductField,
    updatePurchasePriceMax,
    updatePurchasePricePrice,
    updatePurchasePriceUnit,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import Switch from "@/app/elements/switch/Switch";
import sortDraggedItems from "@/app/functions/sortDraggedItems";
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";

function PurchasePrices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const purchasePrices = product.purchasePrices;

    function handleUpdateProductPriceByPurchasePricesUnitValue(
        key: number,
        value: number
    ) {
        const divider = product.units[purchasePrices[key].unit].value;
        dispatch(updatePurchasePricePrice({ key, price: value / divider }));
    }

    // Drag section
    const dragItem = useRef(0);
    const draggedOverItem = useRef(0);

    function handleSort(group: string) {
        if (group != "purchasePrices") {
            return;
        }
        dispatch(
            updateProductField({
                field: "purchasePrices",
                value: sortDraggedItems(
                    purchasePrices,
                    dragItem.current,
                    draggedOverItem.current
                ),
            })
        );
    }

    return (
        <div className="border border-gray-500 mb-4">
            <div>
                <Switch
                    checked={product.purchaseEnable}
                    onChange={(value) =>
                        dispatch(
                            updateProductField({
                                field: "purchaseEnable",
                                value,
                            })
                        )
                    }
                    label="This product will be purchased"
                    className="justify-between bg-gray-900"
                />
            </div>
            {product.purchaseEnable ? (
                <div>
                    {purchasePrices.map((price, key) => (
                        <div
                            key={key}
                            onDragEnter={() => (draggedOverItem.current = key)}
                            onDragEnd={() => handleSort("purchasePrices")}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="bg-gray-900 p-2 flex flex-wrap justify-start items-center">
                                <button
                                    draggable
                                    onDragStart={() => (dragItem.current = key)}
                                    className="h-[30px] w-[30px] bg-gray-800 rounded"
                                >
                                    &#x2630;
                                </button>
                                <p className="mx-3">Unit : </p>
                                <select
                                    className="h-[40px] bg-black text-white p-2"
                                    value={price.unit}
                                    onChange={(e) => {
                                        console.log(product);
                                        dispatch(
                                            updatePurchasePriceUnit({
                                                key,
                                                unit: e.target.value,
                                            })
                                        );
                                    }}
                                >
                                    {Object.values(product.units).map(
                                        (unit: any, key: number) => (
                                            <option key={key} value={unit.unit}>
                                                {unit.label}
                                            </option>
                                        )
                                    )}
                                </select>{" "}
                                <p className="mx-3">Max : </p>
                                <NumberInputControl
                                    value={price.max}
                                    onChange={(max) =>
                                        dispatch(
                                            updatePurchasePriceMax({
                                                key,
                                                max,
                                            })
                                        )
                                    }
                                />
                                <p className="mx-3">
                                    Price : 1 {product.saleUnitsBase} =
                                </p>
                                <NumberInputControl
                                    value={price.price}
                                    onChange={(price) =>
                                        dispatch(
                                            updatePurchasePricePrice({
                                                key,
                                                price,
                                            })
                                        )
                                    }
                                />
                                <p className="mx-3">৳</p>
                                {price.unit == product.saleUnitsBase ? (
                                    ""
                                ) : (
                                    <>
                                        {" | 1 "}
                                        {product.units[price.unit].label}
                                        <input
                                            type="number"
                                            className="h-[30px] bg-black w-[100px] text-white p-2"
                                            value={
                                                price.price *
                                                product.units[price.unit].value
                                            }
                                            step={
                                                product.units[price.unit]
                                                    .value / 2
                                            }
                                            onChange={(e) =>
                                                handleUpdateProductPriceByPurchasePricesUnitValue(
                                                    key,
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                        ৳
                                    </>
                                )}
                                <button
                                    onDoubleClick={() =>
                                        dispatch(removePurchasePrice(key))
                                    }
                                    className="h-[30px] w-[30px] bg-gray-700 text-white flex items-center justify-center mr-3 rounded ms-auto"
                                >
                                    <span className="text-l">&#x1F534;</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div>
                        <button
                            onClick={() => dispatch(addPurchasePrice())}
                            className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                        >
                            Add Price
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default PurchasePrices;
