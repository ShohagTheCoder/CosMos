import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
    addMeasurement,
    updateMeasurementUnit,
    updateMeasurementValue,
} from "@/app/store/slices/productSlice";

function Measurements({ units }: { units: any }) {
    const dispatch = useDispatch();
    const measurements = useSelector(
        (state: RootState) => state.product.measurements
    );

    return (
        <div className="border border-gray-500 mb-4">
            {measurements.map((measurement, key) => (
                <div key={key}>
                    <div className="measurement bg-gray-900 p-2">
                        Unit :{" "}
                        <select
                            className="h-[40px] p-1 bg-black text-white p-2"
                            value={measurement.unit}
                            onChange={(e) =>
                                dispatch(
                                    updateMeasurementUnit({
                                        key,
                                        unit: e.target.value,
                                    })
                                )
                            }
                        >
                            {units.map((unit: any, key: number) => (
                                <option key={key} value={unit.unit}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                        Value :{" "}
                        <input
                            type="number"
                            className="h-[30px] bg-black w-[60px] text-white p-2"
                            value={measurement.value}
                            onChange={(e) =>
                                dispatch(
                                    updateMeasurementValue({
                                        key,
                                        value: parseInt(e.target.value),
                                    })
                                )
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                onClick={() => dispatch(addMeasurement())}
            >
                Add Measurement
            </button>
        </div>
    );
}

export default Measurements;
