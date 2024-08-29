import React from "react";
import Prices from "./Prices";
import Measurements from "./Mesurements";
import { useDispatch, useSelector } from "react-redux";
import {
    addDynamicUnit,
    changeSaleUnitsBase,
    remapDynamicUnitUnit,
    updateDynamicUnitLabel,
    updateDynamicUnitUnit,
    updateUnitsDynamicValue,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import { Unit } from "../interfaces/product.interface";
import PurchasePrices from "./PurchasePrices";
import PurchaseMeasurements from "./PurchaseMeasurements";

function Units() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = product.units;

    function handleDynamicValue(unit: string, sValue: string) {
        const value = parseInt(sValue);
        if (value > 100 || value < 0) return;
        dispatch(updateUnitsDynamicValue({ key: unit, value }));
    }

    function handleDynamicUnitUnit(unit: string, value: string) {
        dispatch(updateDynamicUnitUnit({ key: unit, value }));
    }

    function handleDynamicUnitUnitRemap(unit: string) {
        dispatch(remapDynamicUnitUnit(unit));
    }
    function handleDynamicUnitLabel(unit: string, value: string) {
        dispatch(updateDynamicUnitLabel({ key: unit, value }));
    }

    function handleChangeSaleUnitsBase(e: any) {
        dispatch(changeSaleUnitsBase(e.target.value));
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
        <div className="scale p-6 bg-gray-900 text-gray-200 rounded-lg shadow-md">
            <div className="mb-6">
                <label
                    className="block text-gray-400 text-sm font-semibold mb-2"
                    htmlFor="sale-base"
                >
                    Product Sale Base
                </label>
                <select
                    className="w-full h-10 bg-gray-800 text-gray-200 rounded-md p-2 focus:ring focus:ring-blue-500"
                    value={product.saleUnitsBase}
                    onChange={handleChangeSaleUnitsBase}
                    id="sale-base"
                >
                    {Object.values(units).map((unit: Unit) => (
                        <option key={unit.unit} value={unit.unit}>
                            {unit.label}
                        </option>
                    ))}
                </select>
            </div>{" "}
            <div className="border border-gray-500 mb-4">
                {" "}
                <table className="w-full border-collapse">
                    {" "}
                    <thead>
                        {" "}
                        <tr>
                            <th className="py-1 px-2 border">Unit</th>
                            <th className="py-1 px-2 border">Label</th>{" "}
                            <th className="py-1 px-2 border">Value * base</th>
                            <th className="py-1 px-2 border">Compare</th>{" "}
                        </tr>{" "}
                    </thead>{" "}
                    <tbody>
                        {" "}
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
                    onClick={handleAddDynamicUnit}
                    className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                >
                    Add Unit
                </button>
            </div>
            <Prices />
            <Measurements />
            <p className="bg-yellow-700 py-3 px-4 mb-3">Purchase section</p>
            <PurchasePrices />
            <PurchaseMeasurements />
        </div>
    );
}

export default Units;

// import React from "react";
// import Prices from "./Prices";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     addDynamicUnit,
//     changeSaleUnitsBase,
//     remapDynamicUnitUnit,
//     updateDynamicUnitLabel,
//     updateDynamicUnitUnit,
//     updateUnitsDynamicValue,
// } from "@/app/store/slices/productSlice";
// import { RootState } from "@/app/store/store";
// import { Unit } from "../interfaces/product.interface";
// import PurchasePrices from "./PurchasePrices";
// import PurchaseMeasurements from "./PurchaseMeasurements";
// import Measurements from "./Mesurements";

// function Units() {
//     const dispatch = useDispatch();
//     const product = useSelector((state: RootState) => state.product);
//     const units = product.units;

//     function handleDynamicValue(unit: string, sValue: string) {
//         const value = parseInt(sValue);
//         if (value > 100 || value < 0) return;
//         dispatch(updateUnitsDynamicValue({ key: unit, value }));
//     }

//     function handleDynamicUnitUnit(unit: string, value: string) {
//         dispatch(updateDynamicUnitUnit({ key: unit, value }));
//     }

//     function handleDynamicUnitUnitRemap(unit: string) {
//         dispatch(remapDynamicUnitUnit(unit));
//     }
//     function handleDynamicUnitLabel(unit: string, value: string) {
//         dispatch(updateDynamicUnitLabel({ key: unit, value }));
//     }

//     function handleChangeSaleUnitsBase(e: any) {
//         dispatch(changeSaleUnitsBase(e.target.value));
//     }

//     function handleAddDynamicUnit() {
//         dispatch(
//             addDynamicUnit({
//                 unit: "unit-" + Math.round(Math.random() * 1000),
//                 label: "Label",
//                 value: 1,
//             })
//         );
//     }

//     return (
//         <div className="p-6 bg-gray-900 text-gray-200 rounded-lg shadow-md">

//             <div className="overflow-x-auto mb-6">
//                 <table className="min-w-full bg-gray-800 rounded-lg">
//                     <thead>
//                         <tr className="text-gray-400">
//                             <th className="py-2 px-4">Unit</th>
//                             <th className="py-2 px-4">Label</th>
//                             <th className="py-2 px-4">Value * Base</th>
//                             <th className="py-2 px-4">Compare</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Object.entries(units).map(([key, unit]) => (
//                             <tr key={key} className="text-gray-300">
//                                 <td className="py-2 px-4">
//                                     <input
//                                         type="text"
//                                         onChange={(e) =>
//                                             handleDynamicUnitUnit(
//                                                 key,
//                                                 e.target.value
//                                             )
//                                         }
//                                         onBlur={() =>
//                                             handleDynamicUnitUnitRemap(key)
//                                         }
//                                         className="w-full bg-gray-700 text-gray-200 rounded-md p-2 focus:ring focus:ring-blue-500"
//                                         value={unit.unit}
//                                     />
//                                 </td>
//                                 <td className="py-2 px-4">
//                                     <input
//                                         type="text"
//                                         onChange={(e) =>
//                                             handleDynamicUnitLabel(
//                                                 unit.unit,
//                                                 e.target.value
//                                             )
//                                         }
//                                         className="w-full bg-gray-700 text-gray-200 rounded-md p-2 focus:ring focus:ring-blue-500"
//                                         value={unit.label}
//                                     />
//                                 </td>
//                                 <td className="py-2 px-4">
//                                     <input
//                                         type="number"
//                                         onChange={(e) =>
//                                             handleDynamicValue(
//                                                 unit.unit,
//                                                 e.target.value
//                                             )
//                                         }
//                                         className="w-full bg-gray-700 text-gray-200 rounded-md p-2 focus:ring focus:ring-blue-500"
//                                         value={unit.value}
//                                     />
//                                 </td>
//                                 <td className="py-2 px-4">
//                                     {"1 " +
//                                         unit.label +
//                                         " = " +
//                                         unit.value +
//                                         " " +
//                                         product.saleUnitsBase}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <button
//                     onClick={handleAddDynamicUnit}
//                     className="mt-4 bg-green-700 text-white font-semibold rounded-md px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500"
//                 >
//                     Add Unit
//                 </button>
//             </div>

//             <Prices />
//             <Measurements />
//             <p className="bg-yellow-700 text-gray-900 font-semibold rounded-md py-3 px-4 mb-3">
//                 Purchase Section
//             </p>
//             <PurchasePrices />
//             <PurchaseMeasurements />
//         </div>
//     );
// }

// export default Units;
