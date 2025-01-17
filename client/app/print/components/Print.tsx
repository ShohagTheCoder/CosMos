"use client";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import React, { useEffect } from "react";
import "./print.css";

export default function Print({
    sale,
    printSetting,
}: {
    sale: any;
    printSetting: any;
}) {
    // Listen for enter click and open print dialog
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const keysToTriggerPrint = ["Enter", "0", "1", "2", "+"];
            if (keysToTriggerPrint.includes(event.key)) {
                event.preventDefault();
                window.print();
                // Check if there is a history to go back to
                if (window.history.length > 1) {
                    window.history.back(); // Navigate back
                } else {
                    window.close(); // Close the tab
                }
            }

            // Define keys that will trigger the close or go back behavior
            const keysToCloseOrGoBack = ["Escape", "Backspace"];
            if (keysToCloseOrGoBack.includes(event.key)) {
                event.preventDefault();

                // Check if there is a history to go back to
                if (window.history.length > 1) {
                    window.history.back(); // Navigate back
                } else {
                    window.close(); // Close the tab
                }
            }
        };

        // Add event listener
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="container mx-auto bg-white text-black">
            <div
                className="px-4 py-6 border border-slate-400 w-[300px] mx-auto text-sm font-mono"
                style={{ fontFamily: "monospace" }} // Ensures compatibility with POS printers
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-lg font-bold">
                        {printSetting.title || "Title"}
                    </p>
                    <p>{printSetting.address || "Address"}</p>
                    <p>Phone : {printSetting.phone || "00000000000"}</p>
                </div>

                {/* Date and Sale Info */}
                <div className="mb-4">
                    <p>
                        {new Date(sale.createdAt).toDateString() +
                            " - " +
                            new Date(sale.createdAt).toLocaleTimeString()}
                    </p>
                    <p>Customer : {sale.customer?.name ?? "unknown"}</p>
                </div>

                {/* Product List */}
                <div className="border-t border-b border-dashed py-2">
                    {Object.values(
                        sale.products as Record<string, ProductWithID>
                    ).map((product: ProductWithID) => (
                        <div key={product._id} className="flex justify-between">
                            <span>
                                {product.name.length > 10
                                    ? product.name.substring(0, 12) + ".."
                                    : product.name}
                            </span>
                            <span>
                                {product.price.toFixed(0)} x {product.quantity}{" "}
                                {product.unit} = {product.subTotal.toFixed(0)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="mt-4">
                    {/* <div className="flex justify-between">
                        <strong>Subtotal:</strong>
                        <span>{sale.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <strong>Discount:</strong>
                        <span>0</span>
                    </div> */}
                    <div className="flex justify-between">
                        <strong>Total:</strong>
                        <span>{sale.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p>
                        {printSetting.message ||
                            "Thank you for dining with us!"}
                    </p>
                </div>
            </div>
        </div>
    );
}
