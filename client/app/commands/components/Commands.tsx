"use client";
import SelectProductPopup from "@/app/components/SelectProductPopup";
import PulseLoading from "@/app/elements/loding/PulseLoading";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

interface Command {
    _id: string;
    command: string;
    type: string;
    value: string;
}

export default function Commands({
    commands: initialCommands,
    products,
}: {
    commands: Command[];
    products: Record<string, ProductWithID>;
}) {
    const [commands, setCommands] = useState(initialCommands);
    const [productsPopup, setProductsPopup] = useState(false);
    const [currentCommandIndex, setCurrentCommandIndex] = useState<
        number | null
    >(null);
    const [loading, setLoading] = useState(false);

    async function handleCallback(product: ProductWithID) {
        if (currentCommandIndex !== null) {
            const commandId = commands[currentCommandIndex]._id;
            try {
                setLoading(true);
                const { data } = await apiClient.patch(
                    `commands/${commandId}`,
                    {
                        type: "product",
                        value: product._id,
                    }
                );

                // Update the command in the state to reflect the change in the UI
                setCommands((prevCommands) =>
                    prevCommands.map((cmd, index) =>
                        index === currentCommandIndex
                            ? { ...cmd, value: product._id, type: "product" }
                            : cmd
                    )
                );
                console.log(data);
            } catch (error) {
                console.error("Failed to save command", error);
            } finally {
                setLoading(false);
                setProductsPopup(false);
            }
        }
    }

    if (!commands.length || !Object.keys(products).length) {
        return (
            <div className="h-svh flex justify-center items-center">
                <PulseLoading />
            </div>
        );
    }

    function getProduct(command: Command) {
        if (command.value && products[command.value]) {
            const product = products[command.value];
            return (
                <div className="flex gap-3 items-center">
                    <div>
                        <img
                            src={`/images/products/${product.image}`}
                            alt={product.name}
                            className="h-[80px] w-[80px] object-cover"
                        />
                    </div>
                    <p>{product.name}</p>
                </div>
            );
        }
        return <p>No product selected</p>;
    }

    return (
        <div>
            {productsPopup && (
                <SelectProductPopup
                    products={Object.values(products)}
                    callback={handleCallback}
                    handleClose={() => setProductsPopup(false)}
                />
            )}

            {/* Title Row (Table Headers) */}
            <div className="flex justify-between bg-gray-800 p-3 rounded-t-lg text-white font-bold">
                <div className="flex-1">
                    <p>Command</p>
                </div>
                <div className="flex-1">
                    <p>Type</p>
                </div>
                <div className="flex-1">
                    <p>Product / Action</p>
                </div>
            </div>

            {/* Command Rows */}
            <div>
                {commands.map((command, index) => (
                    <div
                        key={command._id}
                        className="h-[100px] mb-4 flex justify-between bg-gray-700 py-3 px-6 rounded-lg"
                    >
                        <div className="flex-1 flex items-center">
                            <p className="text-lg font-bold">
                                {command.command}
                            </p>
                        </div>

                        <div className="flex-1 flex items-center">
                            <p>{command.type}</p>
                        </div>

                        {/* Product + Action Column */}
                        <div className="flex-1 flex items-center justify-center relative group">
                            {/* Product Info */}
                            <div className="group-hover:hidden flex items-center gap-3">
                                {command.value && products[command.value] ? (
                                    <>
                                        <img
                                            src={`/images/products/${
                                                products[command.value].image
                                            }`}
                                            alt={products[command.value].name}
                                            className="h-[80px] w-[80px] object-cover"
                                        />
                                        <p>{products[command.value].name}</p>
                                    </>
                                ) : (
                                    <p>No product selected</p>
                                )}
                            </div>

                            {/* Select Button (shown on hover) */}
                            <button
                                onClick={() => {
                                    setCurrentCommandIndex(index);
                                    setProductsPopup(true);
                                }}
                                className="hidden group-hover:flex bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded absolute"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Select Product"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
