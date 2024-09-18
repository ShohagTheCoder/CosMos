"use client";
import React, { useState } from "react";

interface TabProps {
    tabs: {
        id: string;
        title: string;
        content: React.ReactNode;
    }[];
    options?: {
        navigator?: boolean;
        classes?: {
            container?: string;
            tabButton?: string;
            tabHeader?: string;
            tabContent?: string;
            buttonContainer?: string;
            button?: string;
            hiddenContent?: string; // Additional class for hidden content
        };
        titleAlignment?: "start" | "center" | "end";
    };
}

const Tab: React.FC<TabProps> = ({ tabs, options }) => {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");

    const handleNext = () => {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].id);
    };

    const handlePrev = () => {
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].id);
    };

    const tabHeaderAlignment =
        options?.titleAlignment === "center"
            ? "justify-center"
            : options?.titleAlignment === "end"
            ? "justify-end"
            : "justify-start";

    return (
        <div
            className={`w-full mx-auto bg-gray-800 text-white rounded-lg shadow-md overflow-hidden ${options?.classes?.container}`}
        >
            <div
                className={`flex border-b border-gray-600 ${tabHeaderAlignment} ${options?.classes?.tabHeader}`}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-4 text-sm font-medium focus:outline-none ${
                            activeTab === tab.id
                                ? "text-blue-400 border-b-2 border-blue-400"
                                : "text-gray-400"
                        } ${options?.classes?.tabButton}`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className="relative">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`p-4 ${
                            tab.id === activeTab
                                ? ""
                                : `hidden ${options?.classes?.hiddenContent}`
                        } ${options?.classes?.tabContent}`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
            {options?.navigator && (
                <div
                    className={`flex justify-between border-t border-gray-600 p-2 bg-gray-700 ${options?.classes?.buttonContainer}`}
                >
                    <button
                        onClick={handlePrev}
                        className={`py-1 px-3 text-sm font-medium text-gray-300 hover:text-white ${options?.classes?.button}`}
                    >
                        Prev
                    </button>
                    <button
                        onClick={handleNext}
                        className={`py-1 px-3 text-sm font-medium text-gray-300 hover:text-white ${options?.classes?.button}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tab;
