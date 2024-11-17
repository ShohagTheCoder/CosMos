import React, { useState } from "react";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import getUnits from "@/app/functions/getUnits";
import formatNumber from "@/app/functions/formatNumber";
import InfoIcon from "@/app/icons/InfoIcon";
import NoteIcon from "@/app/icons/NoteIcon";
import CartSettingsBar from "./CartSettingsBar";

function CartProduct({
    stateManager,
    setProductUpdateShortcut,
    setting,
    handleUpdateProductPrice,
}: {
    stateManager: any;
    // eslint-disable-next-line no-unused-vars
    setProductUpdateShortcut: (productId: string) => void;
    setting: any;
    // eslint-disable-next-line no-unused-vars
    handleUpdateProductPrice: (amount: number) => void;
}) {
    let cart = stateManager.getData();

    const [settingState, setSettingState] = useState(setting);

    function getProductForCart(p: ProductWithID) {
        let product: any = { ...p };
        let units = product.units;
        product.saleUnitsBase = units[product.saleUnitsBase];
        product.unit = units[product.unit];
        product.baseDiscount = product.discount / product.unit.value;
        product.discountPrice = product.price - product.baseDiscount;
        return product;
    }

    return (
        <div className="cart">
            <CartSettingsBar
                settingState={settingState}
                setSettingState={setSettingState}
                stateManager={stateManager}
                handleUpdateProductPrice={handleUpdateProductPrice}
            />

            {/* Restaurant cart */}
            <div className={`${cart.totalOnly ? "hidden" : "visible"}`}>
                {Object.values(cart.products).map((p: any) => {
                    let product = getProductForCart(p);
                    if (product._id == cart.activeProduct) {
                        return (
                            <div
                                key={product._id}
                                className="mb-3 border-dashed border-2 border-slate-500"
                            >
                                <div className="flex">
                                    <div>
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
                                                    src={`/images/products/${
                                                        product.image ||
                                                        "product.jpg"
                                                    }`}
                                                    alt={product.name}
                                                    className="h-full object-cover"
                                                    onClick={() => {
                                                        stateManager
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
                                    </div>
                                    <div className="p-3 flex flex-col gap-2 justify-between">
                                        <div>
                                            {product.note ? (
                                                <div className="flex gap-3">
                                                    {product.name}
                                                    <NoteIcon height="20" />
                                                    {product.note}
                                                </div>
                                            ) : (
                                                product.name
                                            )}
                                        </div>
                                        <div className="flex gap-3 justify-between items-center">
                                            <p className="text-2xl font-bold text-green-500">
                                                {(
                                                    product.price -
                                                    product.discount
                                                ).toLocaleString()}{" "}
                                                ৳
                                            </p>
                                            <p>Total :</p>
                                            <p className="text-2xl font-bold text-green-500">
                                                {product.subTotal.toLocaleString()}{" "}
                                                ৳
                                            </p>
                                        </div>
                                        <div className=" bg-gray-200 dark:bg-slate-900">
                                            <div className="flex flex-warp">
                                                <button
                                                    className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                                    onClick={() => {
                                                        stateManager
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
                                                        stateManager
                                                            .set(
                                                                `products.${product._id}.quantity`,
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ) || 0
                                                            )
                                                            .save();
                                                    }}
                                                />

                                                <button
                                                    className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                                    onClick={() => {
                                                        stateManager
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
                                                        value={
                                                            product.unit.unit
                                                        }
                                                        onChange={(e) => {
                                                            stateManager
                                                                .set(
                                                                    `products.${product._id}.unit`,
                                                                    e.target
                                                                        .value
                                                                )
                                                                .save();
                                                        }}
                                                    >
                                                        {Object.keys(
                                                            getUnits(
                                                                product.units
                                                            )
                                                        ).map((unit) => (
                                                            <option
                                                                key={unit}
                                                                value={unit}
                                                            >
                                                                {unit}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={p._id}
                                className="border-2 border-dashed dark:hover:bg-green-950 border-gray-600 p-2 mb-2"
                                onClick={() => {
                                    stateManager
                                        .set("activeProduct", product._id)
                                        .save();
                                }}
                            >
                                {product.note ? (
                                    <div className="mb-2 flex gap-3">
                                        <NoteIcon height="20" /> {product.note}
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="flex gap-3">
                                    {settingState.cartImage ? (
                                        <div className="">
                                            <img
                                                src={`/images/products/${
                                                    product.image ||
                                                    "product.jpg"
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
                                                {product.subTotal.toLocaleString(
                                                    "en-US"
                                                )}{" "}
                                                ৳
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default CartProduct;
