import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
    addPurchaseMeasurement,
    updateProductField,
    updatePurchaseMeasurementUnit,
    updatePurchaseMeasurementValue,
} from "@/app/store/slices/productSlice";
import sortDraggedItems from "@/app/functions/sortDraggedItems";
import { useRef } from "react";

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
        <div className="border border-gray-500 mb-4">
            {product.purchaseEnable ? (
                <div>
                    {purchaseMeasurements.map((measurement, key) => (
                        <div
                            key={key}
                            onDragEnter={() => (draggedOverItem.current = key)}
                            onDragEnd={() => handleSort("purchaseMeasurements")}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="measurement bg-gray-900 p-2">
                                <button
                                    draggable
                                    onDragStart={() => (dragItem.current = key)}
                                    className="h-[30px] w-[30px] bg-gray-800 mr-3 rounded"
                                >
                                    &#x2630;
                                </button>
                                Purchase Unit :{" "}
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
                                    {Object.values(product.units).map(
                                        (unit: any, key: number) => (
                                            <option key={key} value={unit.unit}>
                                                {unit.label}
                                            </option>
                                        )
                                    )}
                                </select>
                                Value :{" "}
                                <input
                                    type="number"
                                    className="h-[30px] bg-black w-[60px] text-white p-2"
                                    value={measurement.value}
                                    onChange={(e) =>
                                        dispatch(
                                            updatePurchaseMeasurementValue({
                                                key,
                                                value: parseInt(e.target.value),
                                            })
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                    <div>
                        <button
                            className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
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
