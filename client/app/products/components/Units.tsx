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
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";
import TrashIcon from "@/app/icons/TrashIcon";

function Units() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = product.units;

    function handleDynamicValue(unit: string, value: number) {
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
            <div className="mb-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="odd:bg-gray-900">
                            <th className="py-3 px-4 text-start">Unit</th>
                            <th className="py-3 px-2 text-start">Label</th>
                            <th className="py-3 px-2 text-start">
                                Value * base
                            </th>
                            <th className="py-3 px-2 text-start">Compare</th>
                            <th className="py-3 pe-5 text-end">Enable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(units).map(([key, unit], index) => (
                            <tr
                                key={key}
                                className={`unit p-2 ${
                                    index % 2 === 0
                                        ? "bg-gray-700"
                                        : "bg-gray-900"
                                }`}
                            >
                                {unit.dynamic ? (
                                    <>
                                        <td className="py-3 ps-4 pe-2">
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
                                        <td className="py-1 px-2">
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
                                        <td className="py-1 px-2">
                                            <NumberInputControl
                                                value={unit.value}
                                                onChange={(value) =>
                                                    handleDynamicValue(
                                                        unit.unit,
                                                        value
                                                    )
                                                }
                                                inputClassName="!w-12"
                                                buttonClassName="!bg-green-700"
                                            />
                                        </td>
                                        <td className="py-1 px-2">
                                            {"1 " +
                                                unit.label +
                                                " = " +
                                                unit.value +
                                                " " +
                                                product.saleUnitsBase}
                                        </td>
                                        <td className="py-1 px-2">
                                            <button
                                                onDoubleClick={() =>
                                                    dispatch(removeUnit(key))
                                                }
                                                className="h-[30px] w-[30px] text-white hover:text-red-500 flex items-center justify-center mr-3 rounded ms-auto"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-1 px-4">
                                            {unit.unit}
                                        </td>
                                        <td className="py-1 px-2">
                                            {unit.label}
                                        </td>
                                        <td className="py-1 px-2">
                                            {unit.dynamicValue ? (
                                                <NumberInputControl
                                                    value={unit.value}
                                                    onChange={(value) =>
                                                        handleDynamicValue(
                                                            unit.unit,
                                                            value
                                                        )
                                                    }
                                                    inputClassName="!w-12"
                                                    buttonClassName="!bg-green-700"
                                                />
                                            ) : (
                                                unit.value
                                            )}
                                        </td>
                                        <td className="py-1 px-2">
                                            {"1 " +
                                                unit.label +
                                                " = " +
                                                unit.value +
                                                " " +
                                                product.saleUnitsBase}
                                        </td>
                                        <td className="py-1 px-2">
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
                    className="w-full font-bold bg-yellow-700 text-white hover:bg-green-700 px-3 py-2"
                >
                    Add Unit
                </button>
            </div>
            <p className="bg-green-700 py-3 px-4">Sell section</p>
            <div className="mt-3">
                <Prices />
                <Measurements />
            </div>
            <p className="bg-green-700 py-3 px-4 mt-3">Purchase section</p>
            <div className="mt-3 mb-3">
                <PurchasePrices />
                <PurchaseMeasurements />
            </div>
        </div>
    );
}

export default Units;
