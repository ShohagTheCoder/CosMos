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
import getUnits from "@/app/functions/getUnits";
import TrashIcon from "@/app/icons/TrashIcon";

function PurchasePrices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const purchasePrices = product.purchasePrices;
    const units = getUnits(product.units);

    function handleUpdateProductPriceByPurchasePricesUnitValue(
        key: number,
        value: number
    ) {
        const divider = units[purchasePrices[key].unit].value;
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
        <div className="bg-gray-700 mb-4">
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
                    className="justify-between bg-gray-700 !mb-0 !py-3"
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
                            <div className="bg-gray-900 p-2 flex flex-wrap gap-3 justify-start items-center">
                                <button
                                    draggable
                                    onDragStart={() => (dragItem.current = key)}
                                    className="h-[30px] w-[30px] bg-gray-800 rounded"
                                >
                                    &#x2630;
                                </button>
                                <p>Unit : </p>
                                <select
                                    className="h-[40px] bg-black text-white p-2"
                                    value={price.unit}
                                    onChange={(e) => {
                                        dispatch(
                                            updatePurchasePriceUnit({
                                                key,
                                                unit: e.target.value,
                                            })
                                        );
                                    }}
                                >
                                    {Object.values(units).map(
                                        (unit: any, key: number) => (
                                            <option key={key} value={unit.unit}>
                                                {unit.label}
                                            </option>
                                        )
                                    )}
                                </select>{" "}
                                <p>Max : </p>
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
                                <p>Price : 1 {product.saleUnitsBase} =</p>
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
                                <p>৳</p>
                                {price.unit == product.saleUnitsBase ? (
                                    ""
                                ) : (
                                    <div className="flex gap-3 items-center">
                                        <p>| 1 {price.unit} = </p>
                                        <NumberInputControl
                                            value={Math.ceil(
                                                price.price *
                                                    units[price.unit].value
                                            )}
                                            onChange={(value) =>
                                                handleUpdateProductPriceByPurchasePricesUnitValue(
                                                    key,
                                                    value
                                                )
                                            }
                                            inputClassName="w-20"
                                            step={units[price.unit].value / 2}
                                        />
                                        <p>৳</p>
                                    </div>
                                )}
                                <button
                                    onDoubleClick={() =>
                                        dispatch(removePurchasePrice(key))
                                    }
                                    className="h-[30px] w-[30px] text-white hover:text-red-500 flex items-center justify-center mr-3 rounded ms-auto"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div>
                        <button
                            onClick={() => dispatch(addPurchasePrice())}
                            className="w-full font-bold bg-gray-700 text-white hover:bg-green-700 px-3 py-2"
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
