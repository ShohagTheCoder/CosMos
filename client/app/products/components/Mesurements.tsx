import React, { useState } from "react";
import { Measurement } from "../interfaces/product.interface";

function Measurements({ units }: { units: any }) {
    const [measurements, setMeasurements] = useState<Measurement[]>([
        { unit: units[0].unit, value: 0 },
    ]);

    function handleUnitChange(key: number, unit: string) {
        const updated = measurements.map((item, index) =>
            index === key ? { ...item, unit } : item
        );

        setMeasurements(updated);
    }

    function handleValueChange(key: number, value: any) {
        const updated = measurements.map((item, index) =>
            index === key ? { ...item, value } : item
        );

        setMeasurements(updated);
    }

    function handleAddMeasurement() {
        const last = measurements[measurements.length - 1];
        setMeasurements((state: any) => [
            ...state,
            {
                unit: last.unit,
                value: last.value,
            },
        ]);
    }

    return (
        <div className="border border-gray-500 mb-4">
            {measurements.map((measurement, key) => (
                <div key={key}>
                    <div className="measurement bg-gray-900 p-2">
                        Unit :{" "}
                        <select
                            className="h-[40px] p-1 bg-black text-white p-2"
                            value={measurement.unit}
                            onChange={(e) =>
                                handleUnitChange(key, e.target.value)
                            }
                        >
                            {units.map((unit: any, key: number) => (
                                <option key={key} value={unit.unit}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                        Value :{" "}
                        <input
                            type="number"
                            className="h-[30px] bg-black w-[60px] text-white p-2"
                            value={measurement.value}
                            onChange={(e) =>
                                handleValueChange(key, e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}
            <button
                className="font-bold bg-green-800 text-white border border-green-700 rounded-md px-3 py-1 my-2"
                onClick={handleAddMeasurement}
            >
                Add Measurement
            </button>
        </div>
    );
}

export default Measurements;
