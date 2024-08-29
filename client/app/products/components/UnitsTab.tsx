import React from "react";
import Units from "./Units";
import { units } from "../create/units";
import { Unit } from "../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { selectUnits, updateUnit } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";

function UnitsTab() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    return (
        <div className="tab p-4 bg-gray-800 rounded-lg shadow-lg">
            {!product.saleUnitsBase ? (
                <div>
                    <p className="text-lg font-semibold text-gray-200 mb-4">
                        Select units type
                    </p>
                    <div className="tab-titles units-tab flex flex-wrap gap-4">
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "kg",
                                        units: units.weight,
                                    })
                                )
                            }
                        >
                            <p>Weight</p>
                        </div>
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "pcs",
                                        units: units.pices,
                                    })
                                )
                            }
                        >
                            <p>Pieces</p>
                        </div>
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "ltr",
                                        units: units.volume,
                                    })
                                )
                            }
                        >
                            <p>Volume</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="tab-contents mt-4">
                        <div
                            className={`tab-content ${
                                product.saleUnitsBase != "" ? "active" : ""
                            }`}
                        >
                            <Units />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-semibold mb-2"
                            htmlFor="name"
                        >
                            Default Unit
                        </label>
                        <select
                            className="h-[40px] w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={product.unit}
                            onChange={(e) =>
                                dispatch(updateUnit(e.target.value))
                            }
                        >
                            {Object.values(product.units).map((unit: Unit) => (
                                <option
                                    key={unit.unit}
                                    value={unit.unit}
                                    className="bg-gray-800 text-white"
                                >
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-gray-400">
                            Default Price:{" "}
                            <span className="font-semibold text-white">
                                {product.price *
                                    product.units[product.saleUnitsBase].value}
                            </span>
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

export default UnitsTab;
