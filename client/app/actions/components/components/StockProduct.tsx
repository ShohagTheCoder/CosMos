import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { RootState } from "@/app/store/store";
import getUnits from "@/app/functions/getUnits";
import TrashIcon from "@/app/icons/TrashIcon";
import formatNumber from "@/app/functions/formatNumber";
import NotImageIcon from "@/app/icons/NotImageIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import PriceTagIcon from "@/app/icons/PriceTagIcon";
import DiscountIcon from "@/app/icons/DiscountIcon";
import ExtraDiscountIcon from "@/app/icons/ExtraDiscountIcon";
import InfoIcon from "@/app/icons/InfoIcon";
import apiCall from "@/app/common/apiCall";
import useStockManager from "@/app/store/providers/stockProvider";
import NoteIcon from "@/app/icons/NoteIcon";
import fixFloatingPoint from "@/app/functions/fixFloatingPoint";

function StockProduct({
    setProductUpdateShortcut,
    setting,
    handleUpdateProductPrice,
}: {
    // eslint-disable-next-line no-unused-vars
    setProductUpdateShortcut: (productId: string) => void;
    setting: any;
    // eslint-disable-next-line no-unused-vars
    handleUpdateProductPrice: (amount: number) => void;
}) {
    let stock = useSelector((state: RootState) => state.stock);
    const [settingState, setSettingState] = useState(setting);

    const stockManager = useStockManager();

    function getProductForStock(p: ProductWithID) {
        let product: any = { ...p };
        let units = product.units;
        product.saleUnitsBase = units[product.saleUnitsBase];
        product.unit = units[product.unit];
        product.baseDiscount = product.discount / product.unit.value;
        product.discountPrice = product.price - product.baseDiscount;
        return product;
    }

    function updateSetting(payload: any) {
        apiCall
            .patch(`/settings/${setting._id}`, payload)
            .success(() => {
                console.log("Setting updated successfully");
                setSettingState((state: any) => ({ ...state, ...payload }));
            })
            .error((error) => console.log(error));
    }

    return (
        <div className="stock">
            <div className="flex flex-wrap justify-between items-center py-2 px-2 bg-gray-800 mb-3">
                <button
                    className="flex items-center p-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => {
                        stockManager
                            .increment(
                                "products.{{activeProduct}}.extraDiscount"
                            )
                            .save();
                    }}
                >
                    <ExtraDiscountIcon />+
                </button>
                <button
                    className="flex items-center p-1 py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onClick={() => {
                        stockManager
                            .decrement(
                                "products.{{activeProduct}}.extraDiscount"
                            )
                            .save();
                    }}
                >
                    <ExtraDiscountIcon /> -
                </button>
                <button
                    className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => {
                        stockManager
                            .increment("products.{{activeProduct}}.discount")
                            .save();
                    }}
                >
                    <DiscountIcon height="16" /> +
                </button>
                <button
                    className="flex gap-1 items-center py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onClick={() => {
                        stockManager
                            .decrement("products.{{activeProduct}}.discount")
                            .save();
                    }}
                >
                    <DiscountIcon height="16" /> -
                </button>
                <button
                    className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => handleUpdateProductPrice(1)}
                >
                    <PriceTagIcon /> +
                </button>
                <button
                    className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onClick={() => handleUpdateProductPrice(-1)}
                >
                    <PriceTagIcon /> -
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onDoubleClick={() => {
                        stockManager.removeTo(undefined).save();
                    }}
                >
                    <TrashIcon height="20" width="20" />
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => {
                        updateSetting({ stockImage: !settingState.stockImage });
                    }}
                >
                    {settingState.stockImage ? (
                        <NotImageIcon />
                    ) : (
                        <ImageIcon height="20" />
                    )}
                </button>
            </div>
            {Object.values(stock.products).map((p: ProductWithID) => {
                let product = getProductForStock(p);
                if (product._id == stock.activeProduct) {
                    return (
                        <div
                            key={product._id}
                            className="mb-3 border-dashed border-2 border-slate-500"
                        >
                            <div
                                className={`p-3 flex flex-col gap-3 ${
                                    product._id == stock.activeProduct
                                        ? "bg-green-950"
                                        : ""
                                }`}
                            >
                                {product.note ? (
                                    <div className="flex gap-3">
                                        <NoteIcon height="20" /> {product.note}
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="overflow-hidden flex">
                                    {settingState.stockImage ? (
                                        <div className="w-[160px] h-auto relative">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setProductUpdateShortcut(
                                                        product._id
                                                    );
                                                }}
                                                className="absolute right-0 p-1 text-white bg-green-600"
                                            >
                                                <InfoIcon />
                                            </button>
                                            <img
                                                src={`/images/products/${
                                                    product.image ||
                                                    "product.jpg"
                                                }`}
                                                alt={product.name}
                                                className="h-full object-cover"
                                                onClick={() => {
                                                    stockManager
                                                        .set(
                                                            "activeProduct",
                                                            product._id
                                                        )
                                                        .save();
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="flex flex-wrap w-full">
                                        <table className="text-left text-sm w-full">
                                            <tbody>
                                                <tr className="odd:bg-gray-700 ">
                                                    <td className="px-3 py-3">
                                                        1{" "}
                                                        {
                                                            product
                                                                .saleUnitsBase
                                                                .label
                                                        }
                                                    </td>
                                                    <td className="pe-3">
                                                        {fixFloatingPoint(
                                                            product.price
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3 text-center">
                                                        <p className="no-spin py-1 w-[46px] bg-gray-900 text-center outline-none">
                                                            {fixFloatingPoint(
                                                                product.baseDiscount
                                                            )}
                                                        </p>
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {fixFloatingPoint(
                                                            product.discountPrice
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                </tr>
                                                <tr className="even:bg-gray-800">
                                                    <td className="px-3 py-3">
                                                        1 {product.unit.label}
                                                    </td>
                                                    <td className="pe-3">
                                                        {fixFloatingPoint(
                                                            product.price *
                                                                product.unit
                                                                    .value
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3">
                                                        <input
                                                            type="number"
                                                            value={fixFloatingPoint(
                                                                product.discount
                                                            )}
                                                            step={
                                                                product.unit
                                                                    .value
                                                            }
                                                            onChange={(e) => {
                                                                stockManager
                                                                    .set(
                                                                        `products.${product._id}.discount`,
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                    .save();
                                                            }}
                                                            className="no-spin h-[30px] w-[46px] bg-gray-900 text-center outline-none"
                                                        />
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {fixFloatingPoint(
                                                            product.discountPrice *
                                                                product.unit
                                                                    .value
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                </tr>
                                                <tr className="odd:bg-gray-700">
                                                    <td className="px-3 py-3">
                                                        {product.quantity +
                                                            " " +
                                                            product.unit.label}
                                                    </td>
                                                    <td className="pe-3">
                                                        {fixFloatingPoint(
                                                            product.subTotal -
                                                                product.extraDiscount
                                                        )}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3">
                                                        <input
                                                            type="number"
                                                            value={fixFloatingPoint(
                                                                product.extraDiscount
                                                            )}
                                                            onChange={(e) => {
                                                                stockManager
                                                                    .set(
                                                                        `products.${product._id}.extraDiscount`,
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                    .save();
                                                            }}
                                                            className="no-spin h-[30px] w-[46px] bg-gray-900 text-center outline-none"
                                                        />
                                                    </td>
                                                    <td className="pe-3 text-lg text-end">
                                                        {fixFloatingPoint(
                                                            product.subTotal
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="flex justify-between bg-slate-900 pe-3">
                                    <div className="flex flex-warp">
                                        <button
                                            className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                            onClick={() => {
                                                stockManager
                                                    .decrement(
                                                        `products.${product._id}.quantity`
                                                    )
                                                    .save();
                                            }}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="no-spin h-[40px] w-[70px] bg-black  outline-none text-white text-center"
                                            value={product.quantity}
                                            onChange={(e) => {
                                                stockManager
                                                    .set(
                                                        `products.${product._id}.quantity`,
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                    .save();
                                            }}
                                        />

                                        <button
                                            className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                            onClick={() => {
                                                stockManager
                                                    .increment(
                                                        `products.${product._id}.quantity`
                                                    )
                                                    .save();
                                            }}
                                        >
                                            +
                                        </button>
                                        <div>
                                            <select
                                                className="h-[40px] bg-black text-white px-2 outline-none"
                                                value={product.unit.unit}
                                                onChange={(e) => {
                                                    stockManager
                                                        .set(
                                                            `products.${product._id}.unit`,
                                                            e.target.value
                                                        )
                                                        .save();
                                                }}
                                            >
                                                {Object.values(
                                                    getUnits(product.units)
                                                ).map((unit) => (
                                                    <option
                                                        key={unit.unit}
                                                        value={unit.unit}
                                                    >
                                                        {unit.unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-auto ms-3">
                                        {product.saleUnitsBase ==
                                        product.unit ? (
                                            ""
                                        ) : (
                                            <div className="w-auto h-full gap-3 flex flex-wrap justify-end items-center">
                                                <p>=</p>
                                                <p>{product.unit.value}</p>
                                                <p>
                                                    {
                                                        product.saleUnitsBase
                                                            .label
                                                    }
                                                </p>
                                                <p>*</p>
                                                <p>{product.quantity}</p>
                                                <p>=</p>
                                                <p>
                                                    {formatNumber(
                                                        product.unit.value *
                                                            product.quantity,
                                                        3
                                                    )}
                                                </p>
                                                <p>
                                                    {
                                                        product.saleUnitsBase
                                                            .label
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div
                            key={p._id}
                            className="border-2 border-dashed border-gray-600 p-2 mb-2"
                        >
                            {product.note ? (
                                <div className="mb-2 flex gap-3">
                                    <NoteIcon height="20" /> {product.note}
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="flex gap-3">
                                {settingState.stockImage ? (
                                    <div className="">
                                        <img
                                            onClick={() => {
                                                stockManager
                                                    .set(
                                                        "activeProduct",
                                                        product._id
                                                    )
                                                    .save();
                                            }}
                                            src={`/images/products/${
                                                product.image || "product.jpg"
                                            }`}
                                            className="h-[50px] w-[50px] object-cover"
                                            alt={product.image}
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="w-full">
                                    <p>{product.name}</p>
                                    <div className="flex justify-between">
                                        <p className="text-end">
                                            {product.quantity}{" "}
                                            {product.unit.label}
                                        </p>
                                        <p className="text-end">
                                            {product.subTotal} ৳
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default StockProduct;
