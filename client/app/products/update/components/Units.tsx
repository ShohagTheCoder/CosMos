import React, { useEffect, useState } from "react";
import Prices from "./Prices";
import Measurements from "./Mesurements";
import { useDispatch, useSelector } from "react-redux";
import {
    changeSaleUnitsBase,
    remapDynamicUnitUnit,
    updateDynamicUnitLabel,
    updateDynamicUnitUnit,
    updateUnitsDynamicValue,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import PurchasePrices from "./PurchasePrices";
import PurchaseMeasurements from "./PurchaseMeasurements";
import { Unit } from "../../interfaces/product.interface";

function Units({ data }: { data: any }) {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = product.units;
    const unitsAndLabels = Object.values(data).map((unit: any) => ({
        label: unit.label,
        unit: unit.unit,
    }));

    function handleDynamicValue(unit: string, sValue: string) {
        const value = parseInt(sValue);
        if (value > 100 || value < 0) return;
        dispatch(updateUnitsDynamicValue({ key: unit, value }));
    }

    function handleDynamicUnitUnit(unit: string, value: string) {
        dispatch(updateDynamicUnitUnit({ key: unit, value }));
    }

    function handleDynamicUnitUnitRemap(unit: string) {
        for (const prevUnit in units) {
            if (prevUnit == units[unit].unit) {
                dispatch(updateDynamicUnitUnit({ key: unit, value: "none" }));
                return;
            }
        }

        dispatch(remapDynamicUnitUnit(unit));
    }
    function handleDynamicUnitLabel(unit: string, value: string) {
        dispatch(updateDynamicUnitLabel({ key: unit, value }));
    }

    function handleChangeSaleUnitsBase(e: any) {
        dispatch(changeSaleUnitsBase(e.target.value));
    }

    return (
        <div className="scale">
            <div className="select">
                <div className="mb-4">
                    <label
                        className="block text-gray-300 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Product sale base
                    </label>
                    <select
                        className="h-[40px] p-1 bg-black text-white p-2"
                        value={product.saleUnitsBase}
                        onChange={handleChangeSaleUnitsBase}
                    >
                        {Object.values(units).map((unit: Unit) => (
                            <option key={unit.unit} value={unit.unit}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="border border-gray-500 mb-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="py-1 px-2 border">Unit</th>
                            <th className="py-1 px-2 border">Label</th>
                            <th className="py-1 px-2 border">Value * base</th>
                            <th className="py-1 px-2 border">Compare</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(units).map(([key, unit]) => {
                            if (unit.dynamic) {
                                return (
                                    <tr
                                        key={key}
                                        className="unit bg-gray-800 p-2"
                                    >
                                        <td className="py-1 px-2 border">
                                            <input
                                                type="text"
                                                onChange={(e) =>
                                                    handleDynamicUnitUnit(
                                                        key,
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={() =>
                                                    handleDynamicUnitUnitRemap(
                                                        key
                                                    )
                                                }
                                                className="h-[30px] bg-black w-[100px] text-white p-2"
                                                value={unit.unit}
                                            />
                                        </td>
                                        <td className="py-1 px-2 border">
                                            <input
                                                type="text"
                                                onChange={(e) =>
                                                    handleDynamicUnitLabel(
                                                        unit.unit,
                                                        e.target.value
                                                    )
                                                }
                                                className="h-[30px] bg-black w-[100px] text-white p-2"
                                                value={unit.label}
                                            />
                                        </td>
                                        <td className="py-1 px-2 border">
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
                                        </td>
                                        <td className="py-1 px-2 border">
                                            {"1 " +
                                                unit.label +
                                                " = " +
                                                unit.value +
                                                " " +
                                                product.saleUnitsBase}
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr
                                        key={unit.unit}
                                        className="unit bg-gray-800 p-2"
                                    >
                                        {unit.dynamicValue == true ? (
                                            <>
                                                <td className="py-1 px-2 border">
                                                    {unit.unit}
                                                </td>
                                                <td className="py-1 px-2 border">
                                                    {unit.label}
                                                </td>
                                                <td className="py-1 px-2 border">
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
                                                </td>
                                                <td className="py-1 px-2 border">
                                                    {"1 " +
                                                        unit.label +
                                                        " = " +
                                                        unit.value +
                                                        " " +
                                                        product.saleUnitsBase}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-1 px-2 border">
                                                    {unit.unit}
                                                </td>
                                                <td className="py-1 px-2 border">
                                                    {unit.label}
                                                </td>
                                                <td className="py-1 px-2 border">
                                                    {unit.value}
                                                </td>
                                                <td className="py-1 px-2 border">
                                                    {"1 " +
                                                        unit.label +
                                                        " = " +
                                                        unit.value +
                                                        " " +
                                                        product.saleUnitsBase}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
                <button
                    // onClick={() => dispatch(addUnit())}
                    className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                >
                    Add Unit
                </button>
            </div>
            <Prices />
            <Measurements units={unitsAndLabels} />
            <p className="bg-yellow-700 py-3 px-4 mb-3">Purchase section</p>
            <PurchasePrices />
            <PurchaseMeasurements units={unitsAndLabels} />
        </div>
    );
}

export default Units;
