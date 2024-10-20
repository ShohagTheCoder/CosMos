import React from "react";
import Units from "./Units";
import { Unit } from "../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import {
    selectUnits,
    updateProductField,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";
import SelectInput from "@/app/elements/select/SelectInput";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import getUnits from "@/app/functions/getUnits";
// import defaultUnits from "../common/defaultUnits";
import getProductUnitPurchasePrice from "@/app/functions/purchase/getProductUnitPurchasePrice";
import { productUnits } from "../generate/data/productUnits";

export default function UnitsTab() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = getUnits(product.units);

    return (
        <div className="tab bg-gray-800 rounded-lg shadow-lg w-[800px]">
            {!product.saleUnitsBase ? (
                <div>
                    <p className="text-xl font-semibold text-gray-200 mb-4">
                        Select Units Type
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div
                            className="cursor-pointer px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "kg",
                                        units: productUnits.weight,
                                    })
                                )
                            }
                        >
                            <p>Weight</p>
                        </div>
                        <div
                            className="cursor-pointer px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "pcs",
                                        units: productUnits.pieces,
                                    })
                                )
                            }
                        >
                            <p>Pieces</p>
                        </div>
                        <div
                            className="cursor-pointer px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "ltr",
                                        units: productUnits.volume,
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
                    <div className="mt-6">
                        <div
                            className={`tab-content ${
                                product.saleUnitsBase ? "active" : ""
                            }`}
                        >
                            <Units />
                        </div>
                    </div>

                    <div className=" bg-gray-950">
                        <p className="bg-green-700 py-2 px-4 text-white font-semibold">
                            Pricing Section
                        </p>
                        <div className="grid grid-cols-6 gap-6 p-4">
                            {product.sellEnable && (
                                <div className="col-span-3">
                                    <SelectInput
                                        value={product.displaySaleUnit!}
                                        onChange={(e) =>
                                            dispatch(
                                                updateProductField({
                                                    field: "displaySaleUnit",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        options={{
                                            label: "Display Sale Price Unit",
                                            options: Object.values(units).map(
                                                (unit: Unit) => ({
                                                    label: unit.label,
                                                    value: unit.unit,
                                                })
                                            ),
                                        }}
                                    />
                                    <p className="mt-2 text-gray-400">
                                        Display Sale Price:{" "}
                                        <span className="font-semibold text-white">
                                            {getProductUnitPrice({
                                                ...product,
                                                unit: product.displaySaleUnit!,
                                            }) *
                                                units[product.displaySaleUnit!]
                                                    .value}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {product.purchaseEnable && (
                                <div className="col-span-3">
                                    <SelectInput
                                        value={product.displayPurchaseUnit!}
                                        onChange={(e) =>
                                            dispatch(
                                                updateProductField({
                                                    field: "displayPurchaseUnit",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        options={{
                                            label: "Display Purchase Price Unit",
                                            options: Object.values(units).map(
                                                (unit: Unit) => ({
                                                    label: unit.label,
                                                    value: unit.unit,
                                                })
                                            ),
                                        }}
                                    />
                                    <p className="mt-2 text-gray-400">
                                        Display Purchase Price:{" "}
                                        <span className="font-semibold text-white">
                                            {getProductUnitPurchasePrice({
                                                ...product,
                                                unit: product.displayPurchaseUnit!,
                                            }) *
                                                units[
                                                    product.displayPurchaseUnit!
                                                ].value}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
