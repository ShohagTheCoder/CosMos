import React, { useEffect, useState } from "react";
import Units from "./Units";
import { useDispatch, useSelector } from "react-redux";
import { selectUnits, updateUnit } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import { units } from "../../create/units";
import { Unit } from "../../interfaces/product.interface";

function UnitsTab() {
    const dispatch = useDispatch();
    let base;
    const product = useSelector((state: RootState) => state.product);

    if (product.measurements[0].unit == "kg") {
        base = "weight";
    }
    if (product.measurements[0].unit == "pcs") {
        base = "pices";
    }
    if (product.measurements[0].unit == "ltr") {
        base = "volume";
    }

    return (
        <div className="tab">
            <div className="tab-contents">
                <div
                    className={`tab-content ${
                        base == "weight" ? "active" : ""
                    }`}
                >
                    <Units data={units.weight} />
                </div>
                <div
                    className={`tab-content ${base == "pices" ? "active" : ""}`}
                >
                    <Units data={units.pices} />
                </div>
                <div
                    className={`tab-content ${
                        base == "volume" ? "active" : ""
                    }`}
                >
                    <Units data={units.volume} />
                </div>
            </div>
            {base != "" ? (
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Default Unit
                    </label>
                    <select
                        className="h-[40px] p-1 bg-black text-white p-2"
                        value={product.unit}
                        onChange={(e) => dispatch(updateUnit(e.target.value))}
                    >
                        {Object.values(product.units).map((unit: Unit) => (
                            <option key={unit.unit} value={unit.unit}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                    Default Price:{" "}
                    {product.price * product.units[product.unit].value}
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default UnitsTab;
