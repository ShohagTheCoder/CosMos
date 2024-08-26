import React, { useEffect, useState } from "react";
import Units from "./Units";
import { units } from "../create/units";
import { Unit } from "../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { selectUnits, updateUnit } from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";

function UnitsTab() {
    const dispatch = useDispatch();
    const [base, setBase] = useState("");
    const product = useSelector((state: RootState) => state.product);

    function handleTabChange(base: string, units: any) {
        setBase(base);
        dispatch(selectUnits(units));
    }

    return (
        <div className="tab">
            {base == "" ? (
                <div>
                    <p>Select units type</p>
                    <div className="tab-titles units-tab flex flex-wrap">
                        <div
                            className="tab-title"
                            onDoubleClick={() =>
                                handleTabChange("weight", units.weight)
                            }
                        >
                            <p>Weight</p>
                        </div>
                        <div
                            className="tab-title"
                            onDoubleClick={() =>
                                handleTabChange("pices", units.pices)
                            }
                        >
                            <p>Pices</p>
                        </div>
                        <div
                            className="tab-title"
                            onDoubleClick={() =>
                                handleTabChange("volume", units.volume)
                            }
                        >
                            <p>Volume</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p>{base}</p>
            )}
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
