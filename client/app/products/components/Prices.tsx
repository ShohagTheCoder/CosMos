import React from "react";

function Prices() {
    return (
        <div className="border border-gray-500 mb-4">
            <div className="price bg-gray-900 p-2">
                Max :{" "}
                <input
                    type="number"
                    className="h-[30px] bg-black w-[60px] text-white p-2"
                    value={50}
                />
                Value :{" "}
                <input
                    type="number"
                    className="h-[30px] bg-black w-[60px] text-white p-2"
                    value={50}
                />
            </div>
            <button className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2">
                Add Price
            </button>
        </div>
    );
}

export default Prices;
