import React from "react";

function Measurements() {
    return (
        <div className="border border-gray-500 mb-4">
            <div className="measurement bg-gray-900 p-2">
                Unit :{" "}
                <select className="h-[30px] bg-black w-[60px] text-white p-2" />
                Value :{" "}
                <input
                    type="number"
                    className="h-[30px] bg-black w-[60px] text-white p-2"
                    value={50}
                />
            </div>
            <button className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2">
                Add Measurement
            </button>
        </div>
    );
}

export default Measurements;
