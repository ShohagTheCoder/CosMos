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
} from "@/app/store/slices/purchaseSlice"; // Assuming your purchase slice location
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    convertBnBDToStandard,
    convertStandardToBnBD,
} from "@/app/utils/numberFormat";
import { RootState } from "@/app/store/store";
interface Product {
    _id: string; // MongoDB unique identifier
    name: string;
    price: number;
    description?: string;
    madeIn?: string; // Added based on your document structure
    quantity: number;
}

export default function PurchaseProducts() {
    const dispatch = useDispatch();
    let purchase = useSelector((state: RootState) => state.purchase);

    const handleDecrement = (_id: string) => {
        let product = purchase.products[_id];
        if (product.quantity > 0) {
            dispatch(decrementQuantity(product._id)); // Decrement quantity
        }
    };

    const handleIncrement = (_id: string) => {
        let product = purchase.products[_id];
        dispatch(incrementQuantity(product._id)); // Increment quantity
    };

    return (
        <div className="purchase">
            {Object.values(purchase.products).map((product: ProductWithID) => (
                <div
                    key={product._id}
                    className="mb-3 border-dashed border-2 border-slate-500"
                >
                    <div
                        className={`grid grid-cols-4 p-3 gap-3 ${
                            product._id == purchase.activeProduct
                                ? "bg-green-950"
                                : ""
                        }`}
                    >
                        <div>
                            <img
                                src="/product.jpg"
                                alt={product.name}
                                className="w-100 object-cover mr-4"
                                onClick={() =>
                                    dispatch(changeActiveProduct(product._id))
                                }
                            />
                        </div>
                        <div className="overflow-hidden col-span-3">
                            <div className="flex flex-wrap justify-between">
                                <h3 className="text-lg font-medium">
                                    {product.name}
                                </h3>
                                <div className="flex flex-wrap place-content-end">
                                    <p className="text-lg font-medium">
                                        মোট :{" "}
                                        {product.subTotal.toLocaleString(
                                            "Bn-bd"
                                        )}
                                        <span> ৳</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <p className="text-gray-200">
                                    {`১ ${product.saleUnitsBase} = `}
                                    <input
                                        type="text"
                                        className="bg-slate-900 w-[60px] py-1 px-2 outline-none"
                                        value={convertStandardToBnBD(
                                            product.price
                                        )}
                                        onChange={(e) =>
                                            dispatch(
                                                addDiscount({
                                                    key: product._id,
                                                    amount: convertBnBDToStandard(
                                                        e.target.value
                                                    ),
                                                })
                                            )
                                        }
                                    />
                                    <span> ৳</span>
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center">
                                <p className="">
                                    {`১ ${product.unit} = `}
                                    {convertStandardToBnBD(
                                        product.units[product.unit].value *
                                            product.price
                                    )}
                                    {" ৳ - "}
                                </p>
                                <p className="ms-3">
                                    Dis :
                                    <input
                                        type="text"
                                        className="bg-slate-900 w-[60px] py-1 px-2 outline-none"
                                        value={convertStandardToBnBD(
                                            product.discount
                                        )}
                                        onChange={(e) =>
                                            dispatch(
                                                addDiscount({
                                                    key: product._id,
                                                    amount: convertBnBDToStandard(
                                                        e.target.value
                                                    ),
                                                })
                                            )
                                        }
                                    />
                                </p>
                                <p className="ms-3">
                                    {"= "}
                                    {convertStandardToBnBD(
                                        product.units[product.unit].value *
                                            product.price -
                                            product.discount
                                    )}{" "}
                                    {" ৳"}
                                </p>
                            </div>
                            <p>
                                Extra Discount :
                                <input
                                    type="number"
                                    className="bg-slate-900 w-[60px] py-1 px-2 outline-none"
                                    value={product.extraDiscount}
                                    onChange={(e) =>
                                        dispatch(
                                            addExtraDiscount({
                                                key: product._id,
                                                amount: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        )
                                    }
                                />
                            </p>
                        </div>
                        <div className="col-span-4 flex flex-wrap bg-slate-900">
                            <div className="flex flex-warp">
                                <button
                                    className="h-[40px] w-[40px] select-none hover:bg-green-500 hover:text-white text-2xl bg-gray-300 text-gray-700 border-0"
                                    onClick={() => handleDecrement(product._id)}
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
                                    onClick={() => handleIncrement(product._id)}
                                >
                                    +
                                </button>
                                <div>
                                    <select
                                        className="h-[40px] bg-black text-white px-2 outline-none"
                                        value={product.unit}
                                        onChange={(e) =>
                                            dispatch(
                                                updateUnit({
                                                    key: product._id,
                                                    unit: e.target.value,
                                                })
                                            )
                                        }
                                    >
                                        {Object.values(product.units).map(
                                            (unit) => (
                                                <option
                                                    key={unit.unit}
                                                    value={unit.unit}
                                                >
                                                    {unit.unit}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center ms-3">
                                <div className="">
                                    {product.saleUnitsBase == product.unit ? (
                                        ""
                                    ) : (
                                        <div>
                                            ={" "}
                                            {product.units[product.unit].value +
                                                " " +
                                                product.saleUnitsBase +
                                                " * " +
                                                product.quantity +
                                                " = " +
                                                (
                                                    product.units[product.unit]
                                                        .value *
                                                    product.quantity
                                                ).toLocaleString() +
                                                " " +
                                                product.saleUnitsBase}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
