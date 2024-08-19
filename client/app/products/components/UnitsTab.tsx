import React, { useState } from "react";
import Units from "./Units";
import { units } from "../create/units";

function UnitsTab() {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div className="tab">
            <div className="tab-header flex flex-wrap">
                <div
                    className={`tab-header-item ${
                        tabIndex == 0 ? "active" : ""
                    }`}
                    onClick={() => setTabIndex(0)}
                >
                    <p>Weight</p>
                </div>
                <div
                    className={`tab-header-item ${
                        tabIndex == 1 ? "active" : ""
                    }`}
                    onClick={() => setTabIndex(1)}
                >
                    <p>Pices</p>
                </div>
                <div
                    className={`tab-header-item ${
                        tabIndex == 2 ? "active" : ""
                    }`}
                    onClick={() => setTabIndex(2)}
                >
                    <p>Volume</p>
                </div>
            </div>
            <div className="tab-contents">
                <div className={`tab-content ${tabIndex == 0 ? "active" : ""}`}>
                    <Units data={units.weight} />
                </div>
                <div className={`tab-content ${tabIndex == 1 ? "active" : ""}`}>
                    <Units data={units.pice} />
                </div>
                <div className={`tab-content ${tabIndex == 2 ? "active" : ""}`}>
                    <Units data={units.volume} />
                </div>
            </div>
        </div>
    );
}

export default UnitsTab;
