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
import useCartManager from "@/app/store/providers/cartProvider";

function CartProduct({
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
    let cart = useSelector((state: RootState) => state.cart);
    const [settingState, setSettingState] = useState(setting);

    const cartManager = useCartManager();

    function getProductForCart(p: ProductWithID) {
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
        <div className="cart">
            <div className="flex flex-wrap justify-between items-center py-2 px-2 bg-gray-800 mb-3">
                <button
                    className="flex items-center p-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => {
                        cartManager
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
                        cartManager
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
                        cartManager
                            .increment("products.{{activeProduct}}.discount")
                            .save();
                    }}
                >
                    <DiscountIcon height="16" /> +
                </button>
                <button
                    className="flex gap-1 items-center py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onClick={() => {
                        cartManager
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
                        cartManager.removeToCart(undefined).save();
                    }}
                >
                    <TrashIcon height="20" width="20" />
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() => {
                        updateSetting({ cartImage: !settingState.cartImage });
                    }}
                >
                    {settingState.cartImage ? (
                        <NotImageIcon />
                    ) : (
                        <ImageIcon height="20" />
                    )}
                </button>
            </div>
            {Object.values(cart.products).map((p: ProductWithID) => {
                let product = getProductForCart(p);
                if (product._id == cart.activeProduct) {
                    return (
                        <div
                            key={product._id}
                            className="mb-3 border-dashed border-2 border-slate-500"
                        >
                            <div
                                className={`p-3 flex flex-col gap-3 ${
                                    product._id == cart.activeProduct
                                        ? "bg-green-950"
                                        : ""
                                }`}
                            >
                                <div className="overflow-hidden flex">
                                    {settingState.cartImage ? (
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
                                                src={`/images/products/${product.image}`}
                                                alt={product.name}
                                                className="h-full object-cover"
                                                onClick={() => {
                                                    cartManager
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
                                                        {product.price.toFixed(
                                                            0
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3 text-center">
                                                        <p className="no-spin py-1 w-[46px] bg-gray-900 text-center outline-none">
                                                            {product.baseDiscount.toFixed(
                                                                0
                                                            )}
                                                        </p>
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {Math.ceil(
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
                                                        {(
                                                            product.price *
                                                            product.unit.value
                                                        ).toFixed(0)}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3">
                                                        <input
                                                            type="number"
                                                            value={
                                                                product.discount
                                                            }
                                                            step={
                                                                product.unit
                                                                    .value
                                                            }
                                                            onChange={(e) => {
                                                                cartManager
                                                                    .set(
                                                                        `products.${product._id}.discount`,
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                    .save();
                                                            }}
                                                            className="no-spin h-[30px] w-[46px] bg-gray-900 text-center outline-none"
                                                        />
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {(
                                                            product.price *
                                                                product.unit
                                                                    .value -
                                                            product.discount
                                                        ).toFixed(0)}{" "}
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
                                                        {(
                                                            product.price *
                                                            product.count
                                                        ).toFixed(0)}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3">
                                                        <input
                                                            type="number"
                                                            value={
                                                                product.extraDiscount
                                                            }
                                                            onChange={(e) => {
                                                                cartManager
                                                                    .set(
                                                                        `products.${product._id}.extraDiscount`,
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                    .save();
                                                            }}
                                                            className="no-spin h-[30px] w-[46px] bg-gray-900 text-center outline-none"
                                                        />
                                                    </td>
                                                    <td className="pe-3 text-lg text-end">
                                                        {product.subTotal} ৳
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
                                                cartManager
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
                                                cartManager
                                                    .set(
                                                        `products.${product._id}.quantity`,
                                                        parseInt(e.target.value)
                                                    )
                                                    .save();
                                            }}
                                        />

                                        <button
                                            className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                            onClick={() => {
                                                cartManager
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
                                                    cartManager
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
                            className="flex gap-3 border-2 border-dashed border-gray-600 p-2 mb-2"
                        >
                            {settingState.cartImage ? (
                                <div className="">
                                    <img
                                        onClick={() => {
                                            cartManager
                                                .set(
                                                    "activeProduct",
                                                    product._id
                                                )
                                                .save();
                                        }}
                                        src={`/images/products/${product.image}`}
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
                                        {product.quantity} {product.unit.label}
                                    </p>
                                    <p className="text-end">
                                        {product.subTotal} ৳
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
}

export default CartProduct;
