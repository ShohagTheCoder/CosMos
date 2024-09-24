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
    const [currentCommandId, setCurrentCommandId] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

    async function handleCallback(product: ProductWithID) {
        if (currentCommandId !== null) {
            try {
                setLoading(true);
                const { data } = await apiClient.patch(
                    `commands/${currentCommandId}`,
                    {
                        type: "product",
                        value: product._id,
                    }
                );

                // Update the command in the state to reflect the change in the UI
                setCommands((prevCommands) =>
                    prevCommands.map((cmd) =>
                        cmd._id == currentCommandId
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

    // Filter commands based on search term
    const filteredCommands = commands.filter((command) =>
        command.command.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!commands.length || !Object.keys(products).length) {
        return (
            <div className="h-svh flex justify-center items-center">
                <PulseLoading />
            </div>
        );
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

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search command..."
                    className="p-2 border border-gray-500 rounded bg-gray-800 w-full md:w-1/2 text-white xl:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {/* Command Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredCommands.length > 0 ? (
                    filteredCommands.map((command) => (
                        <div
                            key={command._id}
                            className="h-[100px] grid grid-cols-[auto_1fr_1fr] bg-gray-700 py-3 px-6 rounded-lg"
                        >
                            <div className="flex items-center min-w-[40px]">
                                <p className="text-lg font-bold">
                                    {command.command}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <p>{command.type}</p>
                            </div>

                            {/* Product + Action Column */}
                            <div className="flex items-center justify-center relative group">
                                {/* Product Info */}
                                <div className="group-hover:hidden flex items-center gap-3">
                                    {command.value &&
                                    products[command.value] ? (
                                        <>
                                            <img
                                                src={`/images/products/${
                                                    products[command.value]
                                                        .image
                                                }`}
                                                alt={
                                                    products[command.value].name
                                                }
                                                className="h-[80px] w-[80px] object-cover"
                                            />
                                            <p>
                                                {products[command.value].name}
                                            </p>
                                        </>
                                    ) : (
                                        <p>No product selected</p>
                                    )}
                                </div>

                                {/* Select Button (shown on hover) */}
                                <button
                                    onClick={() => {
                                        setCurrentCommandId(command._id);
                                        setProductsPopup(true);
                                    }}
                                    className="hidden group-hover:flex bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded absolute"
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Select Product"}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 mt-4">
                        No commands found.
                    </p>
                )}
            </div>
        </div>
    );
}
