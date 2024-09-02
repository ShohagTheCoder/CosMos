"use client";

import Sidebar from "@/app/components/Sidebar";
import { Customer, CustomerWithId } from "@/app/interfaces/customer.inerface";
import { Message } from "@/app/interfaces/message.interface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    addCustomer,
    addCustomerAccount,
    addToCart,
    CartActionTypes,
    changeAction,
    changeActiveProduct,
    decrementQuantity,
    incrementQuantity,
    removeFromCart,
    resetSelectedProductIndex,
    selectNexProduct,
    selectPreviousProduct,
    shiftMeasurementTo,
} from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import {
    ERROR,
    INFO,
    NONE,
    SUCCESS,
    WARN,
} from "@/app/utils/constants/message";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerCard from "./components/CustomerCard";
import ProductCard from "./components/ProductCard";
import CartProduct from "./components/CartProduct";
import CustomerDetails from "./components/CustomerDetails";
import SellDetails from "./components/SellDetails";
import SellReceipt from "@/app/components/bills/SellReceipt";
import TextInput from "@/app/elements/inputs/TextInput";
import Notification, {
    NotificationProps,
} from "@/app/elements/notification/Notification";
import SupplierCard from "./components/SupplierCard";
import { fetchCustomers, fetchProducts } from "@/app/utils/apiServices";
import { handleLogout } from "../functions/authHandlers";

export default function Sell() {
    let [command, setCommand] = useState("");
    const [products, setProducts] = useState<
        Record<string, ProductWithID> | undefined
    >({});
    const [customers, setCustomers] = useState<
        Record<string, Customer> | undefined
    >({});
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    let selectedProductIndex = cart.selectedProductIndex;
    let forceOrder = 1;

    const [notification, setNotification] = useState<NotificationProps>({
        type: "none",
        message: "This is a message",
    });

    // Single use effect
    useEffect(() => {
        fetchProducts()
            .then((res) => setProducts(res))
            .catch((error) => {
                console.log(error);
                setNotification({
                    type: "error",
                    message: "Faild to fetch products",
                });
            });

        fetchCustomers()
            .then((res) => setCustomers(res))
            .catch((error) => {
                console.log(error);
                setNotification({
                    type: "error",
                    message: "Faild to fetch customers",
                });
            });

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
        if (command.startsWith(" ") && customers) {
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
        } else if (products) {
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
    }, [
        command,
        products,
        customers,
        dispatch,
        isCustomers,
        selectedProductIndex,
    ]);

    async function handleCompleteSell() {
        try {
            let sell = { ...cart };
            if (!sell.customer) {
                sell.paid = sell.totalPrice;
                sell.due = 0;
            }
            await apiClient.post("/sells", sell);
            setNotification({
                type: SUCCESS,
                message: "Sell created successfully",
            });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (error) {
            setNotification({
                type: ERROR,
                message: "Faild to create sell",
            });
        }
    }
    async function handleAddCustomer() {
        if (filteredCustomers) {
            const customer = Object.values(filteredCustomers)[0];
            const { data } = await apiClient.get(
                `accounts/${customer.account}`
            );
            dispatch(addCustomer(customer));
            dispatch(addCustomerAccount(data));
        }
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
                if (filteredCustomers && filteredProducts) {
                    max = isCustomers
                        ? Object.keys(filteredCustomers).length - 1
                        : Object.keys(filteredProducts).length - 1;
                    if (command.length > 1) {
                        dispatch(selectPreviousProduct(max));
                    } else {
                        dispatch(shiftMeasurementTo(-1));
                    }
                }
                break;

            case "ArrowRight":
                e.preventDefault();
                if (filteredCustomers && filteredProducts) {
                    max = isCustomers
                        ? Object.keys(filteredCustomers).length - 1
                        : Object.keys(filteredProducts).length - 1;
                    if (command.length > 1) {
                        dispatch(selectNexProduct(max));
                    } else {
                        dispatch(shiftMeasurementTo(1));
                    }
                }
                break;

            case "Enter":
                if (
                    !isCustomers &&
                    command.length > 0 &&
                    filteredCustomers &&
                    filteredProducts
                ) {
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
                } else if (command.length > 1 && filteredCustomers) {
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

    return (
        <main>
            <SellReceipt />
            <div className="print:hidden">
                <Sidebar />
                <Notification
                    type={notification.type}
                    message={notification.message}
                    className="justify-center"
                />
                <div className="ps-[94px] 2xl:ps-[150px] pe-3 bg-gray-100 dark:bg-gray-950">
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 gap-4 py-4 min-h-screen">
                        <div className="col-span-8 lg:col-span-5">
                            <div className="p-3 border-2 border-dashed border-slate-500 mb-3">
                                <p className="bg-green-700 inline-block py-2 px-4 me-3">
                                    {cart.action}
                                </p>
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
                            <div className="">
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onKeyUp={handleKeyUp}
                                    type="text"
                                    className="border-2 w-full md:w-1/2 xl:w-1/3 border-dashed border-slate-500 bg-black outline-none focus:border-green-500 text-white px-4 py-2 text-lg"
                                    autoFocus
                                />
                                <div className="flex gap-4 mt-3">
                                    <button
                                        className="py-2 px-3 bg-slate-600"
                                        onDoubleClick={() =>
                                            dispatch(
                                                changeAction(
                                                    CartActionTypes.sell
                                                )
                                            )
                                        }
                                    >
                                        Sell
                                    </button>
                                    <button
                                        className="py-2 px-3 bg-slate-600"
                                        onDoubleClick={() =>
                                            dispatch(
                                                changeAction(
                                                    CartActionTypes.purchase
                                                )
                                            )
                                        }
                                    >
                                        Purchase
                                    </button>
                                    <button
                                        className="py-2 px-3 bg-slate-600"
                                        onDoubleClick={() =>
                                            dispatch(
                                                changeAction(
                                                    CartActionTypes.return
                                                )
                                            )
                                        }
                                    >
                                        Return
                                    </button>
                                </div>
                            </div>
                            <div className="mt-3"></div>
                            {isCustomers ? (
                                <div>
                                    {cart.action == "purchase" ? (
                                        <SupplierCard customers={customers} />
                                    ) : (
                                        <CustomerCard
                                            customers={filteredCustomers}
                                        />
                                    )}
                                </div>
                            ) : (
                                <ProductCard products={filteredProducts} />
                            )}
                        </div>
                        <div className="col-span-8 lg:col-span-3">
                            <CartProduct />
                            <CustomerDetails />
                            <div className="">
                                <textarea
                                    ref={noteRef}
                                    className="w-full resize-none bg-black text-white p-3 outline-none border-dashed border-2 border-gray-600 placeholder-slate-300 mb-1"
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
                                    className="w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white"
                                >
                                    বিক্রয় ও প্রিন্ট
                                </button>
                                <button
                                    onDoubleClick={() => handleCompleteSell()}
                                    className="w-1/2 pt-3 pb-2 border-dashed border-2 border-blue-600 bg-blue-900 hover:bg-blue-700 text-white"
                                >
                                    বিক্রয়
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
