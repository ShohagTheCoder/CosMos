"use client";
import { useEffect, useState } from "react";
import { Product } from "./../interfaces/product.interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import apiClient from "../utils/apiClient";
import {
    addCustomer,
    addToCart,
    decrementQuantity,
    incrementQuantity,
} from "../store/slices/cartSlice";
import CartItem from "./components/CartItem";
import ProductCard from "./components/ProductCard";
import SellDetails from "./components/SellDetails";
import Link from "next/link";
import { Customer } from "../interfaces/customer.inerface";
import CustomerCard from "./components/CustomerCard";
import CustomerDetails from "./components/CustomerDetails";

export default function Sell() {
    let [command, setCommand] = useState("");
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [customers, setCustomers] = useState<Record<string, Customer>>({});
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);

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
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await apiClient<Customer[]>("customers");
                const customersArray = response.data;

                const customers = customersArray.reduce<
                    Record<string, Customer>
                >((acc, customer) => {
                    acc[customer._id] = customer;
                    return acc;
                }, {});
                setCustomers(customers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (command.startsWith(" ")) {
            setIsCustomers(true);

            const tempFilteredCustomers = Object.values(customers).filter(
                (customer) => {
                    return customer.fullName
                        .toLowerCase()
                        .includes(command.trim().toLowerCase());
                }
            );

            // Convert filtered array back to object
            const filteredCustomersObject = tempFilteredCustomers.reduce<
                Record<string, Customer>
            >((acc, customer) => {
                acc[customer._id] = customer;
                return acc;
            }, {});

            setFilteredCustomers(filteredCustomersObject);
        } else {
            if (isCustomers) {
                setIsCustomers(false);
            }

            const tempFilteredProducts = Object.values(products).filter(
                (product) => {
                    return product.name
                        .toLowerCase()
                        .includes(command.toLowerCase());
                }
            );

            // Convert filtered array back to object
            const filteredProductsObject = tempFilteredProducts.reduce<
                Record<string, Product>
            >((acc, product) => {
                acc[product._id] = product;
                return acc;
            }, {});

            setFilteredProducts(filteredProductsObject);
        }
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
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            setMessage("Error has occured");
        }
    }

    function handleKeyDown(e: any): void {
        console.log(e.key);
        switch (e.key) {
            case "ArrowUp":
                dispatch(incrementQuantity(false));
                break;
            case "ArrowDown":
                dispatch(decrementQuantity(false));
                break;
            case "Enter":
                if (!isCustomers) {
                    if (Object.keys(filteredProducts).length > 0) {
                        const product = {
                            ...Object.values(filteredProducts)[0],
                            quantity: 1,
                        };
                        dispatch(addToCart(product));
                        setCommand("");
                    }
                } else {
                    if (Object.keys(filteredCustomers).length > 0) {
                        dispatch(
                            addCustomer(Object.values(filteredCustomers)[0])
                        );
                        setCommand("");
                    }
                }
                break;
        }
    }

    return (
        <main>
            <div className="2xl:container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 py-4 min-h-screen">
                    <div className="border col-span-2 p-4">
                        <div className="header border p-3 mb-3">
                            <Link href={"/"}>Home</Link>
                            <Link className="ms-3" href={"/products"}>
                                Products
                            </Link>
                            <Link className="ms-3" href={"/customers"}>
                                Customers
                            </Link>
                        </div>
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
                        {isCustomers ? (
                            <CustomerCard customers={filteredCustomers} />
                        ) : (
                            <ProductCard products={filteredProducts} />
                        )}
                    </div>
                    <div className="border p-4">
                        <CartItem />
                        <div className="mt-4"></div>
                        <SellDetails />
                        <CustomerDetails />
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
                        <div className="flex gap-4">
                            <button
                                onDoubleClick={() => handleCompleteSell()}
                                className="border p-3 mt-3 bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Complete Sell
                            </button>
                            <button
                                onDoubleClick={() => handleCompleteSell()}
                                className="border p-3 mt-3 bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Complete and Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
