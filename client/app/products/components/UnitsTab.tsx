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
import getProductUnitpurchasePrice from "@/app/functions/purchase/getProductUnitPrice";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import getUnits from "@/app/functions/getUnits";
import savedUnits from "../create/units";

export default function UnitsTab() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const units = getUnits(product.units);

    return (
        <div className="tab bg-gray-800 rounded-lg shadow-lg">
            {!product.saleUnitsBase ? (
                <div>
                    <p className="text-lg font-semibold text-gray-200 mb-4">
                        Select units type
                    </p>
                    <div className="tab-titles units-tab flex flex-wrap gap-4">
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "kg",
                                        units: savedUnits.weight,
                                    })
                                )
                            }
                        >
                            <p>Weight</p>
                        </div>
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "pcs",
                                        units: savedUnits.pices,
                                    })
                                )
                            }
                        >
                            <p>Pieces</p>
                        </div>
                        <div
                            className="tab-title cursor-pointer px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                            onDoubleClick={() =>
                                dispatch(
                                    selectUnits({
                                        base: "ltr",
                                        units: savedUnits.volume,
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
                    <div className="tab-contents mt-4">
                        <div
                            className={`tab-content ${
                                product.saleUnitsBase != "" ? "active" : ""
                            }`}
                        >
                            <Units />
                        </div>
                    </div>
                    <p className="bg-green-700 py-3 px-4 mb-3">
                        Others section
                    </p>
                    <div className="grid grid-cols-6 gap-4">
                        {product.sellEnable ? (
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
                                        label: "Display sale price unit",
                                        options: Object.values(units).map(
                                            (unit: Unit) => ({
                                                label: unit.label,
                                                value: unit.unit,
                                            })
                                        ),
                                    }}
                                />
                                <p className="mt-2 text-gray-400">
                                    Display sale price:{" "}
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
                        ) : (
                            ""
                        )}
                        {product.purchaseEnable ? (
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
                                        label: "Display purchase price unit",
                                        options: Object.values(units).map(
                                            (unit: Unit) => ({
                                                label: unit.label,
                                                value: unit.unit,
                                            })
                                        ),
                                    }}
                                />
                                <p className="mt-2 text-gray-400">
                                    Display purchase price:{" "}
                                    <span className="font-semibold text-white">
                                        {getProductUnitpurchasePrice({
                                            ...product,
                                            unit: product.displayPurchaseUnit!,
                                        }) *
                                            units[product.displayPurchaseUnit!]
                                                .value}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
