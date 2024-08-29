import React, { useState } from "react";
import Main from "./Main";
import UnitsTab from "../../components/UnitsTab";
import CreateProduct from "./CreateProduct";
import Resources from "./Resources";

function CreateProductTabs() {
    const [active, setActive] = useState("Main");
    const tabTitles = ["Main", "Units", "Resources", "Prices"];

    function getTabTitles() {
        return tabTitles.map((title) => (
            <div
                key={title}
                onClick={() => setActive(title)}
                className={`tab-title ${active == title ? "active" : ""}`}
            >
                {title}
            </div>
        ));
    }

    function getTabNavigationButton(index: number) {
        let prevIndex;
        let nextIndex;
        if (index == 0) {
            prevIndex = tabTitles.length - 1;
            nextIndex = 1;
        } else if (index == tabTitles.length - 1) {
            prevIndex = index - 1;
            nextIndex = 0;
        } else {
            prevIndex = index - 1;
            nextIndex = index + 1;
        }

        return (
            <div className="tab-navigations bg-slate-800 p-2 rounded mt-4">
                <button
                    className="py-2 px-3 hover:bg-green-700 rounded"
                    onClick={() => setActive(tabTitles[prevIndex])}
                >{`<- ${tabTitles[prevIndex]}`}</button>
                <button
                    className="py-2 px-3 hover:bg-green-700 rounded"
                    onClick={() => setActive(tabTitles[nextIndex])}
                >{`${tabTitles[nextIndex]} ->`}</button>
            </div>
        );
    }

    return (
        <div>
            <div className="tab">
                <div className="p-3 bg-slate-900 tab-titles mb-3">
                    {getTabTitles()}
                </div>
                <div className="tab-contents">
                    <div
                        className={`tab-content ${
                            active == "Main" ? "active" : ""
                        }`}
                    >
                        <Main />

                        {getTabNavigationButton(0)}
                    </div>
                    <div
                        className={`tab-content ${
                            active == "Units" ? "active" : ""
                        }`}
                    >
                        <UnitsTab />
                        {getTabNavigationButton(1)}
                    </div>
                    <div
                        className={`tab-content ${
                            active == "Resources" ? "active" : ""
                        }`}
                    >
                        <Resources />
                        {getTabNavigationButton(2)}
                    </div>
                    <div
                        className={`tab-content ${
                            active == "Prices" ? "active" : ""
                        }`}
                    >
                        <CreateProduct />
                        {getTabNavigationButton(3)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProductTabs;
