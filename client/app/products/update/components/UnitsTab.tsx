import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUnit } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import { Unit } from "../../interfaces/product.interface";
import defaultUnits from "../../common/defaultUnits";
import Units from "./Units";

export default function UnitsTab() {
    const dispatch = useDispatch();
    let base;
    const product = useSelector((state: RootState) => state.product);

    if (product.measurements[0].unit == "kg") {
        base = "weight";
    }
    if (product.measurements[0].unit == "pcs") {
        base = "pieces";
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
                    <Units data={defaultUnits.weight} />
                </div>
                <div
                    className={`tab-content ${
                        base == "pieces" ? "active" : ""
                    }`}
                >
                    <Units data={defaultUnits.pieces} />
                </div>
                <div
                    className={`tab-content ${
                        base == "volume" ? "active" : ""
                    }`}
                >
                    <Units data={defaultUnits.volume} />
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
                        className="h-[40px] bg-black text-white p-2"
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
