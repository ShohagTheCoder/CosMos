"use client";
import DiscountIcon from "@/app/icons/DiscountIcon";
import ExtraDiscountIcon from "@/app/icons/ExtraDiscountIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import NotImageIcon from "@/app/icons/NotImageIcon";
import PriceTagIcon from "@/app/icons/PriceTagIcon";
import TrashIcon from "@/app/icons/TrashIcon";
import apiClient from "@/app/utils/apiClient";
import React from "react";

export default function CartSettingsBar({
    settingState,
    setSettingState,
    stateManager,
    handleUpdateProductPrice,
}: {
    settingState: any;
    setSettingState: any;
    stateManager: any;
    handleUpdateProductPrice: (amount: number) => void;
}) {
    function updateSetting(payload: any) {
        apiClient
            .patch(`/settings/${settingState._id}`, payload)
            .then(() => {
                console.log("Setting updated successfully");
                setSettingState((state: any) => ({ ...state, ...payload }));
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className="flex flex-wrap justify-between items-center py-2 px-2 bg-gray-300 dark:bg-gray-800 mb-3">
            <button
                className="flex items-center p-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                onClick={() => {
                    stateManager
                        .increment("products.{{activeProduct}}.extraDiscount")
                        .save();
                }}
            >
                <ExtraDiscountIcon />+
            </button>
            <button
                className="flex items-center p-1 py-2 px-3 rounded-lg select-none hover:bg-red-800"
                onClick={() => {
                    stateManager
                        .decrement("products.{{activeProduct}}.extraDiscount")
                        .save();
                }}
            >
                <ExtraDiscountIcon /> -
            </button>
            <button
                className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                onClick={() => {
                    stateManager
                        .increment("products.{{activeProduct}}.discount")
                        .save();
                }}
            >
                <DiscountIcon height="16" /> +
            </button>
            <button
                className="flex gap-1 items-center py-2 px-3 rounded-lg select-none hover:bg-red-800"
                onClick={() => {
                    stateManager
                        .decrement("products.{{activeProduct}}.discount")
                        .save();
                }}
            >
                <DiscountIcon height="16" /> -
            </button>
            <button
                className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-green-800"
                onClick={() => handleUpdateProductPrice(1)}
            >
                <PriceTagIcon /> +
            </button>
            <button
                className="flex items-center gap-1 py-2 px-3 rounded-lg select-none hover:bg-red-800"
                onClick={() => handleUpdateProductPrice(-1)}
            >
                <PriceTagIcon /> -
            </button>
            <button
                className="py-2 px-3 rounded-lg select-none hover:bg-red-800"
                onDoubleClick={() => {
                    stateManager.removeTo(undefined).save();
                }}
            >
                <TrashIcon height="20" width="20" />
            </button>
            <button
                className="py-2 px-3 rounded-lg select-none hover:bg-green-800"
                onClick={() => {
                    updateSetting({ cartImage: !settingState.cartImage });
                }}
            >
                {settingState.cartImage ? (
                    <NotImageIcon />
                ) : (
                    <ImageIcon height="20" />
                )}
            </button>
        </div>
    );
}
