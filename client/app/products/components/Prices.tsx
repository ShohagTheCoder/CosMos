import React, { useState } from "react";
import Product, { Price } from "../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import {
    addPrice,
    updatePriceMax,
    updatePricePrice,
    updatePriceUnit,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";

function Prices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);

    return (
        <div className="border border-gray-500 mb-4">
            {product.prices.map((price, key) => (
                <div key={key} className="price bg-gray-900 p-2">
                    Unit :{" "}
                    <select
                        className="h-[40px] p-1 bg-black text-white p-2"
                        value={price.unit}
                        onChange={(e) => {
                            console.log(product);
                            dispatch(
                                updatePriceUnit({ key, unit: e.target.value })
                            );
                        }}
                    >
                        {Object.values(product.units).map(
                            (unit: any, key: number) => (
                                <option key={key} value={unit.unit}>
                                    {unit.label}
                                </option>
                            )
                        )}
                    </select>{" "}
                    Max :{" "}
                    <input
                        type="number"
                        className="h-[30px] bg-black w-[60px] text-white p-2"
                        value={price.max}
                        onChange={(e) =>
                            dispatch(
                                updatePriceMax({ key, max: e.target.value })
                            )
                        }
                    />
                    Price :{" "}
                    <input
                        type="number"
                        className="h-[30px] bg-black w-[60px] text-white p-2"
                        value={price.price}
                        onChange={(e) =>
                            dispatch(
                                updatePricePrice({ key, price: e.target.value })
                            )
                        }
                    />
                </div>
            ))}
            <button
                onClick={() => dispatch(addPrice())}
                className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
            >
                Add Price
            </button>
        </div>
    );
}

export default Prices;
