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
                <div className="mb-3">
                    <p className="text-center text-lg font-bold">
                        {printSetting.name || "Name"}
                    </p>
                    <p className="text-center text-sm">
                        {printSetting.title || "Title"}
                    </p>
                </div>

                {/* Date and Sale Info */}
                <div className="mb-4">
                    <p>
                        {new Date(sale.createdAt).toDateString() +
                            " - " +
                            new Date(sale.createdAt).toLocaleTimeString()}
                    </p>
                    {sale.customer == undefined ? (
                        ""
                    ) : (
                        <p>Customer : {sale.customer?.name}</p>
                    )}
                </div>

                {/* Product List */}
                <table className="border-t border-b border-black w-full">
                    <thead>
                        <tr className="text-left">
                            <th className="py-1">Product</th>
                            <th className="py-1 px-2">P x Q</th>
                            <th className="py-1 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(
                            sale.products as Record<string, ProductWithID>
                        ).map((product: ProductWithID) => (
                            <tr key={product._id}>
                                <td className="py-1">
                                    {product.name.length > 10
                                        ? product.name.substring(0, 12) + ".."
                                        : product.name}
                                </td>
                                <td className="py-1 px-2 min-w-[110px]">
                                    {product.price.toFixed(0)} x{" "}
                                    {product.quantity}
                                    {product.unit}
                                </td>
                                <td className="py-1 text-right">
                                    {product.subTotal.toFixed(0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total */}
                <div className="mt-4">
                    {printSetting.discount == true ? (
                        <>
                            <div className="flex justify-between">
                                <strong>Subtotal:</strong>
                                <span>{sale.totalPrice.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <strong>Discount:</strong>
                                <span>0</span>
                            </div>
                        </>
                    ) : (
                        ""
                    )}

                    <div className="flex justify-between">
                        <strong>Total:</strong>
                        <span>{sale.totalPrice.toFixed(0)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mb-3 mt-3 text-center">
                    <p>Address : {printSetting.address || "Address"}</p>
                    <p>Phone : {printSetting.phone || "00000000000"}</p>
                </div>
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
