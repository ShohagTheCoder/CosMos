import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addPrice,
    updatePricePrice,
    updatePriceStart,
    updatePriceUnit,
} from "@/app/store/slices/productSlice";
import { RootState } from "@/app/store/store";

function Prices() {
    const dispatch = useDispatch();
    const product = useSelector((state: RootState) => state.product);
    const prices = product.prices;

    function handleUpdateProductPriceByPricesUnitValue(
        key: number,
        value: number
    ) {
        const divider = product.units[prices[key].unit].value;
        dispatch(updatePricePrice({ key, price: value / divider }));
    }

    return (
        <div className="border border-gray-500 mb-4">
            {prices.map((price, key) => (
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
                        value={price.start}
                        onChange={(e) =>
                            dispatch(
                                updatePriceStart({ key, start: e.target.value })
                            )
                        }
                    />
                    Price : 1 {product.saleUnitsBase} =
                    <input
                        type="number"
                        className="h-[30px] bg-black w-[100px] text-white p-2"
                        value={price.price}
                        onChange={(e) =>
                            dispatch(
                                updatePricePrice({
                                    key,
                                    price: parseFloat(e.target.value),
                                })
                            )
                        }
                    />
                    ৳
                    {price.unit == product.saleUnitsBase ? (
                        ""
                    ) : (
                        <>
                            {" | 1 "}
                            {product.units[price.unit].label}
                            <input
                                type="number"
                                className="h-[30px] bg-black w-[100px] text-white p-2"
                                value={
                                    price.price *
                                    product.units[price.unit].value
                                }
                                onChange={(e) =>
                                    handleUpdateProductPriceByPricesUnitValue(
                                        key,
                                        parseInt(e.target.value)
                                    )
                                }
                            />
                            ৳
                        </>
                    )}
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
