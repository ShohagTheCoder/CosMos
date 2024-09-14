import React from "react";
import Prices from "./Prices";
import Measurements from "./Mesurements";
import { useDispatch, useSelector } from "react-redux";
import {
    addDynamicUnit,
    changeSaleUnitsBase,
    remapDynamicUnitUnit,
    removeUnit,
    toggleUnitEnable,
    updateDynamicUnitLabel,
    updateDynamicUnitUnit,
    updateUnitsDynamicValue,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import { Unit } from "../interfaces/product.interface";
import PurchasePrices from "./PurchasePrices";
import PurchaseMeasurements from "./PurchaseMeasurements";
import SelectInput from "@/app/elements/select/SelectInput";
import Switch from "@/app/elements/switch/Switch";

function Units() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = product.units;

    function handleDynamicValue(unit: string, sValue: string) {
        const value = parseInt(sValue);
        if (value > 100 || value < 0) return;
        dispatch(updateUnitsDynamicValue({ key: unit, value }));
    }

    function handleAddDynamicUnit() {
        dispatch(
            addDynamicUnit({
                unit: "unit-" + Math.round(Math.random() * 1000),
                label: "Label",
                value: 1,
            })
        );
    }

    return (
        <div className="scale">
            <div className="grid grid-cols-3">
                <SelectInput
                    value={product.saleUnitsBase}
                    onChange={(e) =>
                        dispatch(changeSaleUnitsBase(e.target.value))
                    }
                    options={{
                        label: "Product base unit",
                        options: Object.values(units).map((unit: Unit) => ({
                            label: unit.label,
                            value: unit.unit,
                        })),
                    }}
                    className="mb-3"
                />
            </div>
            <div className="border border-gray-500 mb-4">
                <table className="w-full border-collapse border-gray-600">
                    <thead>
                        <tr>
                            <th className="py-1 px-2 border">Unit</th>
                            <th className="py-1 px-2 border">Label</th>
                            <th className="py-1 px-2 border">Value * base</th>
                            <th className="py-1 px-2 border">Compare</th>
                            <th className="py-1 pe-5 border text-end">
                                Enable
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(units).map(([key, unit]) => (
                            <tr key={key} className="unit bg-gray-800 p-2">
                                {unit.dynamic ? (
                                    <>
                                        <td className="py-1 px-2 border">
                                            <input
                                                type="text"
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateDynamicUnitUnit({
                                                            key,
                                                            value: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
                                                onBlur={() =>
                                                    dispatch(
                                                        remapDynamicUnitUnit(
                                                            key
                                                        )
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
                                                    dispatch(
                                                        updateDynamicUnitLabel({
                                                            key: unit.unit,
                                                            value: e.target
                                                                .value,
                                                        })
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
                                        <td className="py-1 px-2 border">
                                            <button
                                                onDoubleClick={() =>
                                                    dispatch(removeUnit(key))
                                                }
                                                className="h-[30px] w-[30px] bg-gray-700 text-white flex items-center justify-center mr-3 rounded ms-auto"
                                            >
                                                <span className="text-l">
                                                    &#x1F534;
                                                </span>
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
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
                                        <td className="border">
                                            <Switch
                                                checked={unit.enable}
                                                label=""
                                                onChange={(enable) =>
                                                    dispatch(
                                                        toggleUnitEnable({
                                                            key,
                                                            enable,
                                                        })
                                                    )
                                                }
                                                className="!m-0 !gap-0 !justify-end"
                                            />
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    onClick={handleAddDynamicUnit}
                    className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                >
                    Add Unit
                </button>
            </div>
            <p className="bg-yellow-700 py-3 px-4 mb-3">Sell section</p>
            <Prices />
            <Measurements />
            <p className="bg-yellow-700 py-3 px-4 mb-3">Purchase section</p>
            <PurchasePrices />
            <PurchaseMeasurements />
        </div>
    );
}

export default Units;
