"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { RootState } from "../store/store";
import apiClient from "../utils/apiClient";
import {
    addCustomer,
    addCustomerAccount,
    addToCart,
    changeActiveProduct,
    decrementQuantity,
    incrementQuantity,
    removeFromCart,
    resetSelectedProductIndex,
    selectNexProduct,
    selectPreviousProduct,
    shiftMeasurementTo,
} from "../store/slices/cartSlice";
import CartProduct from "./components/CartProduct";
import ProductCard from "./components/ProductCard";
import SellDetails from "./components/SellDetails";
import Link from "next/link";
import { Customer, CustomerWithId } from "../interfaces/customer.inerface";
import CustomerCard from "./components/CustomerCard";
import CustomerDetails from "./components/CustomerDetails";
import { ProductWithID } from "../products/interfaces/product.interface";
import { Message } from "../interfaces/message.interface";
import { ERROR, INFO, NONE, SUCCESS, WARN } from "../utils/constants/message";
import axios from "axios";

export default function Sell() {
    let [command, setCommand] = useState("");
    const [products, setProducts] = useState<Record<string, ProductWithID>>({});
    const [customers, setCustomers] = useState<Record<string, Customer>>({});
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    let selectedProductIndex = cart.selectedProductIndex;
    let forceOrder = 1;

    const [message, setMessage] = useState<Message>({
        type: NONE,
        data: "Faild to create message",
    });

    useEffect(() => {
        window.addEventListener("keydown", (e: any) => {
            if (e.key == "Tab") e.preventDefault();
            let command = document.getElementById("command");
            if (
                document.activeElement != command &&
                e.target.tagName != "TEXTAREA" &&
                e.target.tagName != "INPUT"
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
                const response = await apiClient<ProductWithID[]>("products");
                const productsArray = response.data;

                const products = productsArray.reduce<
                    Record<string, ProductWithID>
                >((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {});
                setProducts(products);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await apiClient<CustomerWithId[]>("customers");
                const customersArray = response.data;

                const customers = customersArray.reduce<
                    Record<string, CustomerWithId>
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
                    return customer.name
                        .toLowerCase()
                        .includes(command.trim().toLowerCase());
                }
            );

            // Convert filtered array back to object
            const filteredCustomersObject = tempFilteredCustomers.reduce<
                Record<string, CustomerWithId>
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
                Record<string, ProductWithID>
            >((acc, product) => {
                acc[product._id] = product;
                return acc;
            }, {});

            setFilteredProducts(filteredProductsObject);
        }

        // Reset selected product index
        if (selectedProductIndex > 0) {
            dispatch(resetSelectedProductIndex());
        }
    }, [command, products]);

    async function handleCompleteSell() {
        try {
            const result = await apiClient.post("/sells", cart);
            setMessage({
                type: SUCCESS,
                data: "Sell created successfully",
            });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (error) {
            setMessage({
                type: ERROR,
                data: "Faild to create sell",
            });
        }
    }
    async function handleAddCustomer() {
        const customer = Object.values(filteredCustomers)[0];
        const { data } = await apiClient.get(`accounts/${customer.account}`);
        dispatch(addCustomer(customer));
        dispatch(addCustomerAccount(data));
    }

    function handleNoteKeyDown(e: any) {
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                document.getElementById("command")?.focus();
                break;
        }
    }

    function changeCartActiveProductTo(val: number) {
        const cartProductsKey = Object.keys(cart.products);
        if (cart.activeProduct && cartProductsKey.length > 1) {
            let key = cartProductsKey.indexOf(cart.activeProduct) + val;
            if (key < 0) {
                key = cartProductsKey.length - 1;
            } else if (key >= cartProductsKey.length) {
                key = 0;
            }

            dispatch(changeActiveProduct(cartProductsKey[key]));
        }
    }

    let [isShift, setIsShift] = useState(false);

    function handleKeyDown(e: any): void {
        // console.log(e.key);
        let max = 0;
        switch (e.key) {
            case "Shift":
                setIsShift(true);
                break;

            case "Tab":
                e.preventDefault();
                noteRef.current?.focus();
                break;

            case "ArrowUp":
                if (isShift) {
                    changeCartActiveProductTo(-1);
                } else {
                    dispatch(incrementQuantity(false));
                }
                break;

            case "ArrowDown":
                if (isShift) {
                    changeCartActiveProductTo(+1);
                } else {
                    dispatch(decrementQuantity(false));
                }
                break;

            case "ArrowLeft":
                e.preventDefault();
                max = isCustomers
                    ? Object.keys(filteredCustomers).length - 1
                    : Object.keys(filteredProducts).length - 1;
                if (command.length > 1) {
                    dispatch(selectPreviousProduct(max));
                } else {
                    dispatch(shiftMeasurementTo(-1));
                }
                break;

            case "ArrowRight":
                e.preventDefault();
                max = isCustomers
                    ? Object.keys(filteredCustomers).length - 1
                    : Object.keys(filteredProducts).length - 1;
                if (command.length > 1) {
                    dispatch(selectNexProduct(max));
                } else {
                    dispatch(shiftMeasurementTo(1));
                }
                break;

            case "Enter":
                if (!isCustomers && command.length > 0) {
                    if (Object.keys(filteredProducts).length > 0) {
                        const product = {
                            ...Object.values(filteredProducts)[
                                selectedProductIndex
                            ],
                            quantity: 1,
                        };
                        dispatch(addToCart(product));
                        setCommand("");
                    }
                } else if (command.length > 1) {
                    if (Object.keys(filteredCustomers).length > 0) {
                        handleAddCustomer();
                        setCommand("");
                    }
                } else {
                    if (cart.totalPrice == 0) break;
                    if (forceOrder >= 5) {
                        handleCompleteSell();
                    } else {
                        forceOrder++;
                    }
                }
                break;
            case "Delete":
                e.preventDefault();
                dispatch(removeFromCart(cart.activeProduct));
                break;
        }
    }

    function handleKeyUp(e: any): void {
        switch (e.key) {
            case "Shift":
                setIsShift(false);
                break;
        }
    }

    async function handleLogout() {
        await axios.get("/api/auth/logout");
        window.location.reload();
    }

    return (
        <main>
            <div className="2xl:container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4 py-4 min-h-screen">
                    <div className="col-span-2">
                        <div className="p-3 border border-2 border-dashed border-slate-500 mb-3">
                            <Link href={"/"}>Home</Link>
                            <Link className="ms-3" href={"/products"}>
                                Products
                            </Link>
                            <Link className="ms-3" href={"/customers"}>
                                Customers
                            </Link>
                            <button
                                onDoubleClick={handleLogout}
                                className="bg-red-700 text-white py-1 px-3 rounded ms-[20px]"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            <input
                                id="command"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onKeyUp={handleKeyUp}
                                type="text"
                                className="border border-2 border-dashed border-slate-500 bg-black outline-none focus:border-green-500 text-white px-4 py-2 text-lg"
                                autoFocus
                            />
                            <div className="message">
                                {message.type == ERROR ? (
                                    <div className="error bg-red-600 p-3">
                                        {message.data}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {message.type == SUCCESS ? (
                                    <div className="success bg-green-600 p-3">
                                        {message.data}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {message.type == WARN ? (
                                    <div className="warn bg-yellow-600 p-3">
                                        {message.data}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {message.type == INFO ? (
                                    <div className="info bg-blue-600 p-3">
                                        {message.data}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="mt-3"></div>
                        {isCustomers ? (
                            <CustomerCard customers={filteredCustomers} />
                        ) : (
                            <ProductCard products={filteredProducts} />
                        )}
                    </div>
                    <div className="">
                        <CartProduct />
                        <CustomerDetails />
                        <div className="">
                            <textarea
                                ref={noteRef}
                                className="w-full resize-none bg-black text-white p-3 outline-none border border-dashed border-2 border-gray-600 placeholder-slate-300 mb-1"
                                value={note}
                                onKeyDown={handleNoteKeyDown}
                                onChange={(e) => setNote(e.target.value)}
                                rows={2}
                                cols={50}
                                placeholder="বিক্রি সম্পর্কে কিছু মনে রাখার আছে কি?"
                            ></textarea>
                        </div>
                        <SellDetails />
                        <div className="flex gap-4">
                            <button
                                onDoubleClick={() => handleCompleteSell()}
                                className="w-1/2 pt-3 pb-2 border border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white"
                            >
                                বিক্রয় ও প্রিন্ট
                            </button>
                            <button
                                onDoubleClick={() => handleCompleteSell()}
                                className="w-1/2 pt-3 pb-2 border border-dashed border-2 border-blue-600 bg-blue-900 hover:bg-blue-700 text-white"
                            >
                                বিক্রয়
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
