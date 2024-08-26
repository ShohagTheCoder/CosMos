import React, { useState } from "react";
import Main from "./Main";
import CreateProduct from "./UpdateProduct";
import UnitsTab from "./UnitsTab";
import UpdateProduct from "./UpdateProduct";

function UpdateProductTabs() {
    const [active, setActive] = useState("Main");
    const tabTitles = ["Main", "Units", "Prices"];

    function getTabTitles() {
        return tabTitles.map((title) => (
            <div
                key={title}
                className={`tab-title ${active == title ? "active" : ""}`}
            >
                {title}
            </div>
        ));
    }

    return (
        <div>
            <div className="tab">
                <div className="p-3 border tab-titles">{getTabTitles()}</div>
                <div className="tab-contents p-3 border">
                    <div
                        className={`tab-content ${
                            active == "Main" ? "active" : ""
                        }`}
                    >
                        <Main />
                        <div className="tab-navigations">
                            <button
                                className="ms-auto"
                                onClick={() => setActive("Units")}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div
                        className={`tab-content ${
                            active == "Units" ? "active" : ""
                        }`}
                    >
                        <UnitsTab />
                        <div className="tab-navigations">
                            <button onClick={() => setActive("Main")}>
                                Previous
                            </button>
                            <button onClick={() => setActive("Prices")}>
                                Next
                            </button>
                        </div>
                    </div>
                    <div
                        className={`tab-content ${
                            active == "Prices" ? "active" : ""
                        }`}
                    >
                        <UpdateProduct />
                        <div className="tab-navigations">
                            <button onClick={() => setActive("Units")}>
                                Previous
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProductTabs;
