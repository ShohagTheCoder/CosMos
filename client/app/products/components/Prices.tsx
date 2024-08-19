import React, { useState } from "react";
import { Price } from "../interfaces/product.interface";

function Prices({ units }: { units: any }) {
    const [prices, setPrices] = useState<Price[]>([
        { unit: units[0].unit, max: 0, price: 0 },
    ]);

    function handleUnitChange(key: number, unit: any) {
        const updated = prices.map((item, index) =>
            index === key ? { ...item, unit } : item
        );

        setPrices(updated);
    }

    function handleMaxChange(key: number, max: any) {
        const updated = prices.map((item, index) =>
            index === key ? { ...item, max } : item
        );

        setPrices(updated);
    }

    function handlePriceChange(key: number, price: any) {
        const updated = prices.map((item, index) =>
            index === key ? { ...item, price } : item
        );

        setPrices(updated);
    }

    function handleAddPrice() {
        const last = prices[prices.length - 1];
        setPrices((state: any) => [
            ...state,
            {
                unit: last.unit,
                max: last.max,
                price: last.price,
            },
        ]);
    }

    return (
        <div className="border border-gray-500 mb-4">
            {prices.map((price, key) => (
                <div key={key} className="price bg-gray-900 p-2">
                    Unit :{" "}
                    <select
                        className="h-[40px] p-1 bg-black text-white p-2"
                        value={price.unit}
                        onChange={(e) => handleUnitChange(key, e.target.value)}
                    >
                        {units.map((unit: any, key: number) => (
                            <option key={key} value={unit.unit}>
                                {unit.label}
                            </option>
                        ))}
                    </select>{" "}
                    Max :{" "}
                    <input
                        type="number"
                        className="h-[30px] bg-black w-[60px] text-white p-2"
                        value={price.max}
                        onChange={(e) => handleMaxChange(key, e.target.value)}
                    />
                    Price :{" "}
                    <input
                        type="number"
                        className="h-[30px] bg-black w-[60px] text-white p-2"
                        value={price.price}
                        onChange={(e) => handlePriceChange(key, e.target.value)}
                    />
                </div>
            ))}
            <button
                onClick={handleAddPrice}
                className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
            >
                Add Price
            </button>
        </div>
    );
}

export default Prices;
