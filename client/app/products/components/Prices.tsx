import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPrice,
    removePrice,
    updatePriceStart,
    updatePricePrice,
    updatePriceUnit,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import Switch from "@/app/elements/switch/Switch";
import sortDraggedItems from "@/app/functions/sortDraggedItems";
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";
import getUnits from "@/app/functions/getUnits";
import TrashIcon from "@/app/icons/TrashIcon";

function Prices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = getUnits(product.units);
    const prices = product.prices;
    const pricesLength = prices.length - 1;

    function handleUpdateProductPriceByPricesUnitValue(
        key: number,
        value: number
    ) {
        const divider = units[prices[key].unit].value;
        dispatch(updatePricePrice({ key, price: value / divider }));
    }

    // Drag section
    const dragItem = useRef(0);
    const draggedOverItem = useRef(0);

    function handleSort(group: string) {
        if (group != "prices") {
            return;
        }
        dispatch(
            updateProductField({
                field: "prices",
                value: sortDraggedItems(
                    prices,
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
                    checked={product.sellEnable}
                    onChange={(value) =>
                        dispatch(
                            updateProductField({
                                field: "sellEnable",
                                value,
                            })
                        )
                    }
                    label="This product is for sell"
                    className="justify-between bg-gray-700 !mb-0 !py-3"
                />
            </div>
            {product.sellEnable ? (
                <div>
                    {prices.map((price, key) => (
                        <div
                            key={key}
                            onDragEnter={() => (draggedOverItem.current = key)}
                            onDragEnd={() => handleSort("prices")}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="bg-gray-900 p-2 flex flex-wrap justify-start items-center gap-3">
                                <button
                                    draggable
                                    onDragStart={() => (dragItem.current = key)}
                                    className="h-[30px] w-[30px] bg-gray-800 rounded"
                                >
                                    &#x2630;
                                </button>
                                <p>Unit :</p>
                                <select
                                    className="h-[40px] bg-black text-white p-2"
                                    value={price.unit}
                                    onChange={(e) => {
                                        dispatch(
                                            updatePriceUnit({
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
                                </select>
                                {key == 0 ? (
                                    ""
                                ) : (
                                    <>
                                        <p>Start :</p>
                                        <NumberInputControl
                                            value={price.start}
                                            onChange={(start) =>
                                                dispatch(
                                                    updatePriceStart({
                                                        key,
                                                        start,
                                                    })
                                                )
                                            }
                                            inputClassName="w-14"
                                        />
                                    </>
                                )}
                                <p>Price : 1 {product.saleUnitsBase} =</p>
                                <NumberInputControl
                                    value={price.price}
                                    onChange={(price) =>
                                        dispatch(
                                            updatePricePrice({
                                                key,
                                                price,
                                            })
                                        )
                                    }
                                    inputClassName="w-[70px]"
                                />
                                <p>৳</p>
                                {price.unit == product.saleUnitsBase ? (
                                    ""
                                ) : (
                                    <div className="flex gap-3 items-center">
                                        <p>| 1 {price.unit}</p>
                                        <NumberInputControl
                                            value={Math.ceil(
                                                price.price *
                                                    units[price.unit].value
                                            )}
                                            onChange={(value) =>
                                                handleUpdateProductPriceByPricesUnitValue(
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
                                        dispatch(removePrice(key))
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
                            onClick={() => dispatch(addPrice())}
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

export default Prices;
