import React from "react";
import Prices from "./Prices";
import Measurements from "./Mesurements";

function Units() {
    return (
        <div className="scale">
            <div className="border border-gray-500 mb-4">
                <div className="unit bg-gray-900 p-2">
                    <p>Gram (g) : 0.01kg = 1 Gram</p>
                </div>
                <div className="unit bg-gray-800 p-2">
                    <p>Kilogram (kg) : 1kg = 1 Kilogaram</p>
                </div>
                <div className="unit bg-gray-900 p-2">
                    <p>Quintal (qt) : 100kg = 1 Uintal</p>
                </div>
                <div className="unit bg-gray-800 p-2">
                    <p>
                        Bag (bg) :{" "}
                        <input
                            type="number"
                            className="h-[30px] bg-black w-[60px] text-white p-2"
                            value={50}
                        />
                        kg = 1 Bag
                    </p>
                </div>
            </div>
            <Prices />
            <Measurements />
        </div>
    );
}

export default Units;
