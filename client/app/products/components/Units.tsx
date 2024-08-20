import React, { useEffect, useState } from "react";
import Prices from "./Prices";
import Measurements from "./Mesurements";
import { useDispatch, useSelector } from "react-redux";
import { updateUnitsDynamicValue } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";

function Units({ data }: { data: any }) {
    const dispatch = useDispatch();
    const units = useSelector((state: RootState) => state.product.units);
    const unitsAndLabels = Object.values(data).map((unit: any) => ({
        label: unit.label,
        unit: unit.unit,
    }));

    function handleDynamicValue(unit: string, sValue: string) {
        const value = parseInt(sValue);
        if (value > 100 || value < 0) return;
        dispatch(updateUnitsDynamicValue({ key: unit, value }));
    }

    return (
        <div className="scale">
            <div className="border border-gray-500 mb-4">
                {Object.values(units).map((unit: any) => {
                    if (unit.dynamic) {
                        return (
                            <div
                                key={unit.unit}
                                className="unit bg-gray-800 p-2"
                            >
                                <p>
                                    {unit.label} ({unit.unit}) :{" "}
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            handleDynamicValue(
                                                unit.unit,
                                                e.target.value
                                            )
                                        }
                                        className="h-[30px] bg-black w-[60px] text-white p-2"
                                        value={unit.value}
                                    />
                                    {unit.base} = 1 {unit.label}
                                </p>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={unit.unit}
                                className="unit bg-gray-800 p-2"
                            >
                                <p>
                                    {unit.label} ({unit.unit}) : {unit.value}{" "}
                                    {unit.base} = 1 {unit.label}
                                </p>
                            </div>
                        );
                    }
                })}
            </div>
            <Prices />
            <Measurements units={unitsAndLabels} />
        </div>
    );
}

export default Units;
