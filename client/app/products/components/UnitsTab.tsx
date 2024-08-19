import React, { useState } from "react";
import Units from "./Units";
import { units } from "../create/units";
import { Unit } from "../interfaces/product.interface";
import { useDispatch } from "react-redux";
import { updatePrices, updateUnits } from "@/app/store/slices/productSlice";

function UnitsTab() {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    function handleTabChange(index: number, units: any) {
        setTabIndex(index);
        dispatch(updateUnits(units));
        dispatch(
            updatePrices([
                {
                    unit: Object.keys(units)[0],
                    max: 0,
                    price: 0,
                },
            ])
        );
    }

    return (
        <div className="tab">
            <div className="tab-header flex flex-wrap">
                <div
                    className={`tab-header-item ${
                        tabIndex == 0 ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(0, units.weight)}
                >
                    <p>Weight</p>
                </div>
                <div
                    className={`tab-header-item ${
                        tabIndex == 1 ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(1, units.pices)}
                >
                    <p>Pices</p>
                </div>
                <div
                    className={`tab-header-item ${
                        tabIndex == 2 ? "active" : ""
                    }`}
                    onClick={() => handleTabChange(2, units.volume)}
                >
                    <p>Volume</p>
                </div>
            </div>
            <div className="tab-contents">
                <div className={`tab-content ${tabIndex == 0 ? "active" : ""}`}>
                    <Units data={units.weight} />
                </div>
                <div className={`tab-content ${tabIndex == 1 ? "active" : ""}`}>
                    <Units data={units.pices} />
                </div>
                <div className={`tab-content ${tabIndex == 2 ? "active" : ""}`}>
                    <Units data={units.volume} />
                </div>
            </div>
        </div>
    );
}

export default UnitsTab;
