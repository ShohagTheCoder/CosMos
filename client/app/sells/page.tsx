"use client";
import { useEffect, useState } from "react";
import { Product } from "./../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import apiClient from "../utils/apiClient";
import { addToCart } from "../store/slices/cartSlice";
import CartItem from "./components/CartItem";
import ProductCard from "./components/ProductCard";
import SellDetails from "./components/SellDetails";

export default function Sell() {
    let [command, setCommand] = useState("");
    const [products, setproducts] = useState<Record<string, Product>>({});
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);

    const now = new Date();
    // Format date as YYYY-MM-DD
    const date = now.toISOString().split("T")[0];
    // Format time as HH:MM:SS
    const time = now.toTimeString().split(" ")[0];

    const [message, setMessage] = useState("No Message");

    useEffect(() => {
        window.addEventListener("keydown", (e: any) => {
            let command = document.getElementById("command");
            if (
                document.activeElement != command &&
                e.target.tagName != "TEXTAREA"
            ) {
                command?.focus();
            }
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            window.removeEventListener("keydown", () => {});
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
        const filteredProductssObject = filtered.reduce<
            Record<string, Product>
        >((acc, product) => {
            acc[product._id] = product;
            return acc;
        }, {});

        setFilteredProducts(filteredProductssObject);
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

    function handleKeyDown(e: any): void {
        switch (e.key) {
            case "Enter":
                if (Object.entries(filteredProducts).length > 0) {
                    const product = {
                        ...Object.values(filteredProducts)[0],
                        quantity: 1,
                    };
                    console.log(product);
                    dispatch(addToCart(product));
                    setCommand("");
                }
                break;
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
                                onKeyDown={handleKeyDown}
                                type="text"
                                className="bg-black border text-white px-4 py-2 text-lg"
                                autoFocus
                            />
                            <p>{command}</p>
                        </div>
                        <div className="mt-3"></div>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(filteredProducts).map(
                                ([_id, product]) => (
                                    <ProductCard key={_id} product={product} />
                                )
                            )}
                        </div>
                    </div>
                    <div className="border p-4">
                        <div className="cart">
                            {Object.entries(cart.items).map(
                                ([_id, product]) => (
                                    <CartItem key={_id} product={product} />
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
                        <SellDetails />
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
