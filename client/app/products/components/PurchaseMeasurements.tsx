import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
    addPurchaseMeasurement,
    removePurchaseMeasurement,
    updateProductField,
    updatePurchaseMeasurementUnit,
    updatePurchaseMeasurementValue,
} from "@/app/store/slices/productSlice";
import sortDraggedItems from "@/app/functions/sortDraggedItems";
import { useRef } from "react";
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";
import getUnits from "@/app/functions/getUnits";
import TrashIcon from "@/app/icons/TrashIcon";

function PurchaseMeasurements() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const purchaseMeasurements = product.purchaseMeasurements;

    // Drag section
    const dragItem = useRef(0);
    const draggedOverItem = useRef(0);

    function handleSort(group: string) {
        if (group != "purchaseMeasurements") {
            return;
        }
        dispatch(
            updateProductField({
                field: "purchaseMeasurements",
                value: sortDraggedItems(
                    purchaseMeasurements,
                    dragItem.current,
                    draggedOverItem.current
                ),
            })
        );
    }

    return (
        <div className="mb-4">
            {product.purchaseEnable ? (
                <div className="pb-4 ps-4 pe-4 bg-pink-950">
                    {purchaseMeasurements.map((measurement, key) => (
                        <div
                            key={key}
                            onDragEnter={() => (draggedOverItem.current = key)}
                            onDragEnd={() => handleSort("purchaseMeasurements")}
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
                                <p>Unit :</p>
                                <select
                                    className="h-[40px] bg-black text-white p-2"
                                    value={measurement.unit}
                                    onChange={(e) =>
                                        dispatch(
                                            updatePurchaseMeasurementUnit({
                                                key,
                                                unit: e.target.value,
                                            })
                                        )
                                    }
                                >
                                    {Object.values(getUnits(product.units)).map(
                                        (unit: any, key: number) => (
                                            <option key={key} value={unit.unit}>
                                                {unit.label}
                                            </option>
                                        )
                                    )}
                                </select>
                                <p>Value :</p>
                                <NumberInputControl
                                    value={measurement.value}
                                    onChange={(value) =>
                                        dispatch(
                                            updatePurchaseMeasurementValue({
                                                key,
                                                value,
                                            })
                                        )
                                    }
                                    inputClassName="w-14"
                                />
                                <button
                                    onDoubleClick={() =>
                                        dispatch(removePurchaseMeasurement(key))
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
                            className="w-full font-bold bg-gray-700 text-white hover:bg-green-700 px-3 py-2"
                            onClick={() => dispatch(addPurchaseMeasurement())}
                        >
                            Add Measurement
                        </button>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default PurchaseMeasurements;
