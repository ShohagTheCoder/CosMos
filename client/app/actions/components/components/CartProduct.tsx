import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementQuantity,
    decrementQuantity,
    changeActiveProduct,
    updateQuantity,
    addDiscount,
    addExtraDiscount,
    updateUnit,
    updateDiscountAmount,
    removeFromCart,
    updateExtraDiscountAmount,
} from "@/app/store/slices/cartSlice"; // Assuming your cart slice location
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { RootState } from "@/app/store/store";
import getUnits from "@/app/functions/getUnits";
import NumberInputControl from "@/app/elements/inputs/NumberInputControl";
import TrashIcon from "@/app/icons/TrashIcon";

function CartProduct() {
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);

    // console.log("Cart product page");

    const handleDecrement = (_id: string) => {
        let product = cart.products[_id];
        if (product.quantity > 0) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = (_id: string) => {
        let product = cart.products[_id];
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    function getProductForCart(p: ProductWithID) {
        let product: any = { ...p };
        let units = product.units;
        product.mainPrice = product.price - product.updatePrice;
        product.saleUnitsBase = units[product.saleUnitsBase];
        product.unit = units[product.unit];
        product.price =
            product.mainPrice - product.discount / product.unit.value;
        return product;
    }

    return (
        <div className="cart">
            <div className="flex justify-between items-center py-2 px-2 bg-gray-800 mb-3">
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() =>
                        dispatch(
                            updateExtraDiscountAmount({
                                key: undefined,
                                amount: 1,
                            })
                        )
                    }
                >
                    ED+
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() =>
                        dispatch(
                            updateExtraDiscountAmount({
                                key: undefined,
                                amount: -1,
                            })
                        )
                    }
                >
                    ED-
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() =>
                        dispatch(
                            updateDiscountAmount({ key: undefined, amount: 1 })
                        )
                    }
                >
                    D+
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                    onClick={() =>
                        dispatch(
                            updateDiscountAmount({ key: undefined, amount: -1 })
                        )
                    }
                >
                    D-
                </button>
                <button
                    className="py-2 px-3 rounded-lg select-none hover:bg-red-800"
                    onDoubleClick={() => dispatch(removeFromCart(undefined))}
                >
                    <TrashIcon height="20" width="20" />
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
                                    <div className="w-[160px] h-auto">
                                        <img
                                            src={`/images/products/${product.image}`}
                                            alt={product.name}
                                            className="h-full object-cover"
                                            onClick={() =>
                                                dispatch(
                                                    changeActiveProduct(
                                                        product._id
                                                    )
                                                )
                                            }
                                        />
                                    </div>
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
                                                        {product.mainPrice} ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3 text-center">
                                                        <p className="no-spin py-1 w-[46px] bg-gray-900 text-center outline-none">
                                                            {(
                                                                product.discount /
                                                                product.unit
                                                                    .value
                                                            ).toFixed(0)}
                                                        </p>
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {Math.ceil(
                                                            product.price
                                                        )}{" "}
                                                        ৳
                                                    </td>
                                                </tr>
                                                <tr className="even:bg-gray-800">
                                                    <td className="px-3 py-3">
                                                        1 {product.unit.label}
                                                    </td>
                                                    <td className="pe-3">
                                                        {product.mainPrice *
                                                            product.unit
                                                                .value}{" "}
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
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    addDiscount(
                                                                        {
                                                                            key: product._id,
                                                                            amount: parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            className="no-spin h-[30px] w-[46px] bg-gray-900 text-center outline-none"
                                                        />
                                                    </td>
                                                    <td className="pe-3 text-end">
                                                        {product.price *
                                                            product.unit
                                                                .value}{" "}
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
                                                        {product.price *
                                                            product.count}{" "}
                                                        ৳
                                                    </td>
                                                    <td className="pe-3">%</td>
                                                    <td className="pe-3">
                                                        <input
                                                            type="number"
                                                            value={
                                                                product.extraDiscount
                                                            }
                                                            onChange={(e) =>
                                                                dispatch(
                                                                    addExtraDiscount(
                                                                        {
                                                                            key: product._id,
                                                                            amount: parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            ),
                                                                        }
                                                                    )
                                                                )
                                                            }
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
                                            onClick={() =>
                                                handleDecrement(product._id)
                                            }
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="no-spin h-[40px] w-[70px] bg-black  outline-none text-white text-center"
                                            value={product.quantity}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateQuantity({
                                                        key: product._id,
                                                        quantity: parseFloat(
                                                            e.target.value
                                                        ),
                                                    })
                                                )
                                            }
                                        />

                                        <button
                                            className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                            onClick={() =>
                                                handleIncrement(product._id)
                                            }
                                        >
                                            +
                                        </button>
                                        <div>
                                            <select
                                                className="h-[40px] bg-black text-white px-2 outline-none"
                                                value={product.unit.unit}
                                                onChange={(e) =>
                                                    dispatch(
                                                        updateUnit({
                                                            key: product._id,
                                                            unit: e.target
                                                                .value,
                                                        })
                                                    )
                                                }
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
                                                    {product.unit.value *
                                                        product.quantity}
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
                            <div className="">
                                <img
                                    onClick={() =>
                                        dispatch(
                                            changeActiveProduct(product._id)
                                        )
                                    }
                                    src={`/images/products/${product.image}`}
                                    className="h-[50px] w-[50px] object-cover"
                                    alt={product.image}
                                />
                            </div>
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
