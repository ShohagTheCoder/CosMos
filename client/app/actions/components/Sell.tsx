"use client";
import Sidebar from "@/app/components/Sidebar";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    addCustomer,
    addCustomerAccount,
    addToCart,
    changeActiveProduct,
    decrementQuantity,
    incrementQuantity,
    removeFromCart,
    resetSalePrice,
    resetSelectedProductIndex,
    selectNexProduct,
    selectPreviousProduct,
    setUser,
    shiftMeasurementTo,
    updateDiscountAmount,
    updateExtraDiscountAmount,
    updateQuantity,
    updateSalePrice,
} from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import { ERROR, SUCCESS } from "@/app/utils/constants/message";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerCard from "./components/CustomerCard";
import CartProduct from "./components/CartProduct";
import CustomerDetails from "./components/CustomerDetails";
import SellDetails from "./components/SellDetails";
import SellReceipt from "@/app/components/bills/SellReceipt";
import Notification, {
    NotificationProps,
} from "@/app/elements/notification/Notification";
import SupplierCard from "./components/SupplierCard";
import { logout } from "../functions/authHandlers";
import ProductsCard from "./ProductsCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";

interface SellProps {
    productsArray: ProductWithID[];
    customersArray: CustomerWithId[];
    user: any;
}

export default function Sell({
    productsArray,
    customersArray,
    user,
}: SellProps) {
    const products = arrayToObjectById(
        productsArray,
        (item) => !item.sellEnable
    );
    const customers = arrayToObjectById(customersArray);
    let [command, setCommand] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    let forceOrder = 1;

    const [notification, setNotification] = useState<NotificationProps>({
        type: "none",
        message: "This is a message",
    });

    // Single use effect
    useEffect(() => {
        if (user) {
            dispatch(setUser(user));
        }

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
    }, [user]);

    useEffect(() => {
        if (command.length == 3 && /^[1-9]+$/.test(command)) {
            switch (command) {
                case "111":
                    dispatch(addToCart(products["66d0a671156ec0fcee3d488d"]));
                    break;
                case "121":
                    dispatch(addToCart(products["66d0aa8f156ec0fcee3d4919"]));
                    break;
                default:
                    break;
            }
            setCommand("");
        }

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
        if (cart.selectedProductIndex > 0) {
            dispatch(resetSelectedProductIndex());
        }
    }, [command]);

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

    // Use useRef to persist pressedKeys
    let [isShift, setIsShift] = useState(false);
    const pressedKeys = useRef(new Set<string>());
    let keyPressTimer: any;
    let longPressed = useRef(false);
    let groupPressed = useRef(false);
    let stopKeyUpHandler = useRef(false);
    const longPressDuration = 600;

    const handleLongKeyPress = (e: KeyboardEvent) => {
        longPressed.current = true;
        e.preventDefault();
        switch (e.code) {
            case "NumpadAdd":
                changeCartActiveProductTo(-1);
                break;
            case "NumpadEnter":
                changeCartActiveProductTo(1);
                break;
        }
    };
    const clearKeyPressTimer = () => {
        if (keyPressTimer) clearTimeout(keyPressTimer);
    };

    const handleGroupPressed = () => {
        groupPressed.current = true;
        console.log("special command");
    };

    function handleKeyDown(e: KeyboardEvent): void {
        // console.log("---------------------------------");
        // console.log(e.key);
        // console.log(e.code);

        if (pressedKeys.current.has(e.code)) {
            e.preventDefault();
            return;
        }

        // Add to pressed keys
        pressedKeys.current.add(e.code);
        groupPressed.current = false;

        if (e.code == "NumpadSubtract") {
            e.preventDefault();
            setCommand(command.slice(0, -1));
            return;
        }

        if (!keyPressTimer) {
            switch (e.code) {
                case "NumpadAdd":
                case "NumpadEnter":
                    e.preventDefault();
                    keyPressTimer = setTimeout(
                        () => handleLongKeyPress(e),
                        longPressDuration
                    );
                    break;
            }
        }

        // Detect special key press
        if (
            (pressedKeys.current.has("NumpadEnter") && e.code == "NumpadAdd") ||
            (pressedKeys.current.has("NumpadAdd") && e.code == "NumpadEnter")
        ) {
            e.preventDefault();
            handleGroupPressed();
            return;
        }
        if (
            (pressedKeys.current.has("PageUp") && e.code == "PageDown") ||
            (pressedKeys.current.has("PageDown") && e.code == "PageUp")
        ) {
            e.preventDefault();
            groupPressed.current = true;
            dispatch(resetSalePrice(null));
            return;
        }

        if (/^\.\d*$/.test(command)) {
            switch (e.code) {
                case "ArrowUp":
                case "NumpadAdd":
                    e.preventDefault();
                    dispatch(
                        updateExtraDiscountAmount({ key: null, amount: 1 })
                    );
                    break;
                case "ArrowDown":
                case "NumpadEnter":
                    e.preventDefault();
                    dispatch(
                        updateExtraDiscountAmount({ key: null, amount: -1 })
                    );
                    break;
            }
            return;
        }

        if (/^\.\.\d*$/.test(command)) {
            switch (e.code) {
                case "ArrowUp":
                case "NumpadAdd":
                    e.preventDefault();
                    dispatch(updateDiscountAmount({ key: null, amount: 1 }));
                    break;
                case "ArrowDown":
                case "NumpadEnter":
                    e.preventDefault();
                    dispatch(updateDiscountAmount({ key: null, amount: -1 }));
                    break;
            }
            return;
        }

        if (e.key == "Enter") {
            if (command.length <= 4) {
                if (/^0[1-9][0-9]*$/.test(command)) {
                    e.preventDefault();
                    const quantity = parseInt(command.slice(1));
                    setCommand("");
                    dispatch(updateQuantity({ key: null, quantity }));
                }
            }
        }

        if (e.key == "Enter" && command.length > 0) {
            stopKeyUpHandler.current = true;
        }

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
                    changeCartActiveProductTo(1);
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
                    if (command.length > 0) {
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
                    if (command.length > 0) {
                        dispatch(selectNexProduct(max));
                    } else {
                        dispatch(shiftMeasurementTo(1));
                    }
                }
                break;
            case "F9":
                e.preventDefault();
                window.location.href = "./purchase";
                break;
            case "F10":
                e.preventDefault();
                window.location.href = "./return";
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
                                cart.selectedProductIndex
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
                }
                break;
            case "Delete":
                e.preventDefault();
                dispatch(removeFromCart(cart.activeProduct));
                break;
        }
    }

    function handleKeyUp(e: any): void {
        clearKeyPressTimer();
        keyPressTimer = null;
        pressedKeys.current.clear();

        // console.log("Log pressed : ", longPressed.current);
        if (longPressed.current) {
            longPressed.current = false;
            return;
        }

        // console.log("Group pressed : ", groupPressed.current);
        if (groupPressed.current) {
            return;
        }

        switch (e.key) {
            case "Shift":
                setIsShift(false);
                break;
        }

        switch (e.key) {
            case "PageUp":
                dispatch(updateSalePrice({ key: null, amount: -1 }));
                break;
            case "PageDown":
                dispatch(updateSalePrice({ key: null, amount: 1 }));
                break;
        }

        if (stopKeyUpHandler.current) {
            stopKeyUpHandler.current = false;
            return;
        }

        if (command.length == 0) {
            switch (e.code) {
                case "NumpadAdd":
                    e.preventDefault();
                    dispatch(incrementQuantity(null));
                    break;

                case "NumpadEnter":
                    e.preventDefault();
                    dispatch(decrementQuantity(null));
                    break;
            }
        }
    }

    function handleAddToCart(product: ProductWithID) {
        dispatch(addToCart(product));
    }

    return (
        <main>
            <SellReceipt />
            <div className="print:hidden">
                <Sidebar active="sell" />
                <Notification
                    type={notification.type}
                    message={notification.message}
                    className="justify-center"
                />
                <div className="ps-[94px] 2xl:ps-[150px] pe-3 bg-white dark:bg-gray-950">
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 gap-6 py-4 min-h-screen">
                        <div className="col-span-8 lg:col-span-5">
                            <div className="p-3 border-2 border-dashed border-slate-500 mb-3">
                                <Link href={"/"}>Home</Link>
                                <Link
                                    className="ms-3"
                                    href={"/actions/purchase"}
                                >
                                    Purchase
                                </Link>
                                <Link className="ms-3" href={"/products"}>
                                    Products
                                </Link>
                                <Link className="ms-3" href={"/customers"}>
                                    Customers
                                </Link>
                                <p className="inline-block mx-4 bg-green-700 py-2 px-3">
                                    {user.name}
                                </p>
                                <button
                                    onDoubleClick={logout}
                                    className="bg-red-700 text-white py-1 px-3 rounded"
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
                            </div>
                            <div className="mt-3">
                                {/* <ProductsCard selected={} /> */}
                            </div>

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
                                // <ProductCard products={filteredProducts} />
                                <ProductsCard
                                    selected={cart.selectedProductIndex}
                                    callback={handleAddToCart}
                                    products={filteredProducts}
                                />
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
                                    placeholder="বিক্রি সম্পর্কে কিছু লিখুন"
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
