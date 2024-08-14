"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "./../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import useAddToCart from "./functions/addToCart";
import apiClient from "../utils/apiClient";
// import { completeSell } from "./functions/completeSell";
import { MessageType } from "../utils/enums/MessageType";

export default function Sell() {
    let [command, setCommand] = useState("");
    const [products, setproducts] = useState<Record<string, Product>>({});
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const addToCart = useAddToCart();
    const [note, setNote] = useState("");
    const [filteredProduct, setFilteredProduct] = useState(products);

    const now = new Date();
    // Format date as YYYY-MM-DD
    const date = now.toISOString().split("T")[0];
    // Format time as HH:MM:SS
    const time = now.toTimeString().split(" ")[0];

    const [message, setMessage] = useState("No Message");

    useEffect(() => {
        window.addEventListener("keypress", () => {
            let command = document.getElementById("command");
            if (document.activeElement != command) {
                command?.focus();
            }
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            window.removeEventListener("keypress", () => {});
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiClient<Product[]>("products");
                const productsArray = response.data;

                const products = productsArray.reduce<Record<string, Product>>(
                    (acc, product) => {
                        acc[product._id] = product;
                        return acc;
                    },
                    {}
                );
                setproducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = Object.values(products).filter((product) => {
            return product.name.toLowerCase().includes(command.toLowerCase());
        });

        // Convert filtered array back to object
        const filteredProductsObject = filtered.reduce<Record<string, Product>>(
            (acc, product) => {
                acc[product._id] = product;
                return acc;
            },
            {}
        );

        setFilteredProduct(filteredProductsObject);
    }, [command, products]);

    async function handleCompleteSell() {
        try {
            const result = await apiClient.post("/sells", {
                totalPrice: cart.totalPrice,
                user: {
                    name: "Shohag Ahmed",
                    age: 22,
                },
                cart: cart.items,
                note: note,
            });
            setMessage("Sell created successfully");
        } catch (error) {
            setMessage("Error has occured");
        }
    }

    return (
        <main>
            <div className="2xl:container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 py-4 min-h-screen">
                    <div className="border col-span-2 p-4">
                        <div className="message">{message}</div>
                        <div>
                            <input
                                id="command"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                type="text"
                                className="bg-black border text-white px-4 py-2 text-lg"
                                autoFocus
                            />
                            <p>{command}</p>
                        </div>
                        <div className="mt-3"></div>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(filteredProduct).map(
                                ([_id, product]) => (
                                    <div
                                        onDoubleClick={() => addToCart(product)}
                                        key={_id}
                                        className="product border w-[200px]"
                                    >
                                        <img src="product.jpeg" alt="Product" />
                                        <p>{product.name}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="border p-4">
                        <div className="cart">
                            {Object.entries(cart.items).map(
                                ([_id, product]) => (
                                    <div key={_id} className="product border">
                                        <img
                                            src="product.jpeg"
                                            alt="Product"
                                            className="w-[80px]"
                                        />
                                        <p>{product.name}</p>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="note">
                            <textarea
                                className="w-full bg-black text-white border mt-4 p-2 focus:outline-none"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                                cols={50}
                                placeholder="Leave a note about the sell"
                            ></textarea>
                        </div>
                        <div className="place-sell">
                            <button
                                onDoubleClick={() => handleCompleteSell()}
                                className="btn border p-3 mt-3"
                            >
                                Complete sell
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
