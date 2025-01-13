"use client";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import React from "react";
import "./print.css";

export default function Print({ sale }: { sale: any }) {
    console.log(sale);
    return (
        <div className="container mx-auto">
            <div
                className="p-4 border border-slate-400 w-[300px] mx-auto text-sm font-mono"
                style={{ fontFamily: "monospace" }} // Ensures compatibility with POS printers
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-lg font-bold">Mr. Kitchen</p>
                    <p>Bancharampur</p>
                    <p>Phone : .............</p>
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
                    <p>Thank you for dining with us!</p>
                    <p>"Savor the Flavor, Love Every Bite!"</p>
                </div>
            </div>
        </div>
    );
}
