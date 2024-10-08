"use client";
import PurchasesList from "@/app/components/common/PurchasesList";
import SellsList from "@/app/components/common/SellsList";
import TransactionsList from "@/app/components/common/TransactionsList";
import Tab from "@/app/elements/tab/Tab";
import React from "react";

export default function Details() {
    const tabContents = [
        { id: "sales", title: "Sales", content: <SellsList /> },
        { id: "purchases", title: "Purchases", content: <PurchasesList /> },
        {
            id: "transactions",
            title: "Transactions",
            content: <TransactionsList />,
        },
    ];

    return (
        <div className="container max-w-[1000px] mx-auto py-4">
            <Tab
                tabs={tabContents}
                options={{
                    classes: {
                        container: "bg-slate-900",
                        tabContent: "",
                    },
                }}
            />
        </div>
    );
}
