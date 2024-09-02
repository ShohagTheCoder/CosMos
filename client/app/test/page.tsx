"use client";
import React from "react";
import Tab from "../elements/tab/Tab";
import CreateProduct from "../products/create/components/CreateProduct";

const ExamplePage: React.FC = () => {
    const tabs = [
        {
            id: "tab1",
            title: "Tab 1",
            content: <div>Content for Tab 1</div>,
        },
        {
            id: "tab2",
            title: "Tab 2",
            content: <div>Content for Tab 2</div>,
        },
        {
            id: "tab3",
            title: "Tab 3",
            content: <CreateProduct />,
        },
    ];

    const options: {
        navigator?: boolean;
        classes?: {
            container?: string;
            tabButton?: string;
            tabHeader?: string;
            tabContent?: string;
            buttonContainer?: string;
            button?: string;
        };
        titleAlignment?: "start" | "center" | "end"; // Correct type
    } = {
        navigator: true,
        classes: {
            container: "my-custom-container-class",
            tabButton: "my-custom-tab-button-class",
            tabHeader: "my-custom-tab-header-class",
            tabContent: "my-custom-tab-content-class",
            buttonContainer: "my-custom-button-container-class",
            button: "my-custom-button-class",
        },
        titleAlignment: "center", // Ensure this value matches the allowed types
    };

    return (
        <div className="p-4">
            <Tab tabs={tabs} options={options} />
        </div>
    );
};

export default ExamplePage;
