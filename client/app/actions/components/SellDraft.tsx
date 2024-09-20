"use client";
import Sidebar from "@/app/components/Sidebar";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    addCustomer,
    addCustomerAccount,
    addDiscount,
    addExtraDiscount,
    addToCart,
    addToCartWith,
    CartState,
    changeActiveProduct,
    decrementQuantity,
    incrementQuantity,
    initialCartState,
    removeFromCart,
    resetSalePrice,
    resetSelectedProductIndex,
    selectNexProduct,
    selectPreviousProduct,
    setUser,
    setWholeCart,
    shiftMeasurementTo,
    updateDiscountAmount,
    updateExtraDiscountAmount,
    updatePaid,
    updateQuantity,
    updateSalePrice,
} from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerCard from "./components/CustomerCard";
import CartProduct from "./components/CartProduct";
import CustomerDetails from "./components/CustomerDetails";
import SellDetails from "./components/SellDetails";
import SellReceipt from "@/app/components/bills/SellReceipt";
import Notification from "@/app/elements/notification/Notification";
import SupplierCard from "./components/SupplierCard";
import { logout } from "../functions/authHandlers";
import ProductsCard from "./ProductsCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";
import productsMap from "@/app/utils/productsMap";
import { updateHelperField } from "@/app/store/slices/helperSlice";
import { productArrayToObject } from "../functions/productArrayToObject";
import useNotification from "@/app/hooks/useNotification";
import FinalView from "../sell/components/FinalView";

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
    const products = useMemo(
        () => productArrayToObject(productsArray, (item) => !item.sellEnable),
        [productsArray]
    );

    const customers = useMemo(
        () => arrayToObjectById(customersArray),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [productsArray]
    );
    let [command, setCommand] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    const helper = useSelector((state: RootState) => state.helper);
    const activeSellPage = useRef("F5");

    const { notification, success, error } = useNotification();

    const commandCounter = useRef({
        name: "unknown",
        value: 0,
    });

    // Single use effect
    useEffect(() => {
        if (user) {
            dispatch(setUser(user));
        }

        window.addEventListener("keydown", (e: any) => {
            // Return if already focused on another input or textare
            if (["TEXTAREA", "INPUT"].includes(e.target.tagName)) {
                return;
            }

            const usedKeys = [
                "F5",
                "F6",
                "F7",
                "F8",
                "F9",
                "PageUp",
                "PageDown",
            ];
            if (usedKeys.includes(e.key)) {
                e.preventDefault(); // Prevent tab default behavior
            }
            let command = document.getElementById("command");
            command?.focus(); // Focus the command input element
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            window.removeEventListener("keydown", () => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (/^[1-9]{3}$/.test(command)) {
            const productKey = command.slice(0, -1);
            const quantity = parseInt(command.slice(2));
            const productId = productsMap[productKey];

            if (productId) {
                setCommand("");
                dispatch(
                    addToCartWith({
                        product: products[productId],
                        quantity,
                    })
                );
                return;
            }
        }

        if (/^\s+/.test(command) && customers) {
            setIsCustomers(true);
            // Convert filtered array back to object
            const filteredCustomersObject = Object.entries(customers).reduce<
                Record<string, CustomerWithId>
            >((acc, [key, customer]) => {
                if (
                    customer.name
                        .toLowerCase()
                        .includes(command.trim().toLowerCase())
                ) {
                    acc[key] = customer;
                }
                return acc;
            }, {});

            setFilteredCustomers(filteredCustomersObject);
        } else if (/^(?![0-9\s.])[a-zA-Z]{2,15}/.test(command) && products) {
            if (isCustomers) {
                setIsCustomers(false);
            }

            let filteredProductsObject = Object.entries(products).reduce<
                Record<string, ProductWithID>
            >((acc, [key, value]) => {
                if (value.name.toLowerCase().includes(command.toLowerCase())) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            setFilteredProducts(filteredProductsObject);
        } else if (command.length == 0) {
            if (isCustomers) {
                setIsCustomers(false);
            }
            setFilteredProducts(products);
        } else if (command == " ") {
            if (!isCustomers) {
                setIsCustomers(true);
            }
            setFilteredCustomers(customers);
        }

        // Reset selected product index
        if (cart.selectedProductIndex > 0) {
            dispatch(resetSelectedProductIndex());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command]);

    async function handleCompleteSell() {
        try {
            let sell = { ...cart };
            if (!sell.customer) {
                sell.paid = sell.totalPrice;
                sell.due = 0;
            }
            await apiClient.post("/sells", sell);
            success("Sell created successfully");
        } catch (e) {
            error("Faild to create sell");
        }
    }
    async function handleAddCustomer() {
        if (filteredCustomers) {
            const customer =
                Object.values(filteredCustomers)[cart.selectedProductIndex];
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
    let keyPressTimer: any = undefined;
    let longPressed = useRef(false);
    let groupPressed = useRef(false);
    let stopKeyUpHandler = useRef(false);
    const longPressDuration = 600;

    const handleLongKeyPress = (e: KeyboardEvent) => {
        longPressed.current = true;
        e.preventDefault();
        switch (e.code) {
            case "NumpadAdd":
            case "ArrowUp":
                changeCartActiveProductTo(-1);
                break;
            case "NumpadEnter":
            case "ArrowDown":
                changeCartActiveProductTo(1);
                break;
        }
    };

    function stopLongPress() {
        if (keyPressTimer !== undefined) {
            clearTimeout(keyPressTimer);
            keyPressTimer = undefined;
        }
    }

    function handleKeyDown(e: KeyboardEvent): void {
        // console.log("---------------------------------");
        // console.log(e.key);
        // console.log(e.code);

        if (e.code == "Minus") {
            e.preventDefault();
            setCommand("");
            return;
        }

        const repeatableKeys = ["Backspace", "Space", "Numpad0"];
        if (!repeatableKeys.includes(e.code)) {
            if (pressedKeys.current.has(e.code)) {
                e.preventDefault();
                return;
            }
        }

        if (
            command.length == 1 &&
            /^[a-zA-Z]$/.test(command) &&
            command == e.key
        ) {
            let productKey = productsMap[command];
            if (!productKey) return;
            let product = products[productKey];
            if (!product) return;
            e.preventDefault();
            setCommand("");
            dispatch(addToCart(product));
            return;
        }

        // Add to pressed keys
        pressedKeys.current.add(e.code);
        // Remove previous saved key so we can click again if keyup even occur in the keyup handler
        groupPressed.current = false;

        // Important: preventDefault special keys
        const specialKeys = [
            "Enter",
            "NumpadAdd",
            "NumpadSubtract",
            "ArrowUp",
            "ArrowDown",
        ];
        if (specialKeys.includes(e.code)) {
            e.preventDefault();
        }

        // Handle sell page navigation
        const sellPageNavigationKeys = ["F5", "F6", "F7", "F8"];
        if (sellPageNavigationKeys.includes(e.key)) {
            e.preventDefault();
            stopKeyUpHandler.current = true;
            handleSellPageChange(e.key);
            return;
        }

        const longPressKeys = [
            "NumpadAdd",
            "NumpadEnter",
            "F9",
            "Delete",
            "ArrowUp",
            "ArrowDown",
            "NumpadSubtract",
        ];
        if (longPressKeys.includes(e.code) && keyPressTimer == undefined) {
            switch (e.code) {
                case "NumpadAdd":
                case "NumpadEnter":
                case "ArrowUp":
                case "ArrowDown":
                    e.preventDefault();
                    keyPressTimer = setTimeout(
                        () => handleLongKeyPress(e),
                        longPressDuration
                    );
                    break;
                case "NumpadSubtract":
                    e.preventDefault();
                    keyPressTimer = setTimeout(() => {
                        longPressed.current = true;
                        setCommand("");
                    }, longPressDuration);
                    break;
                case "Delete":
                    e.preventDefault();
                    keyPressTimer = setTimeout(() => {
                        longPressed.current = true;
                        dispatch(removeFromCart(undefined));
                    }, longPressDuration);
                    break;
            }
        }

        if (e.key == "/") {
            setCommand("");
        }
        if (e.key == "*") {
            setCommand("");
        }

        // Complete sell
        if (
            ["Numpad0", "Numpad1"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            setCommand("");
            stopKeyUpHandler.current = true;
            groupPressed.current = true;

            if (commandCounter.current.name === "completeSell") {
                commandCounter.current.value += 1;
                if (commandCounter.current.value >= 3) {
                    commandCounter.current = { name: "unknown", value: 0 };
                    console.log("Complete sell");
                }
            } else {
                commandCounter.current = { name: "completeSell", value: 1 };
            }

            return;
        }
        // Chage cart active product to previous
        if (pressedKeys.current.has("NumpadEnter") && e.code == "NumpadAdd") {
            e.preventDefault();
            groupPressed.current = true;
            if (keyPressTimer) {
                clearTimeout(keyPressTimer);
                keyPressTimer = null;
            }
            changeCartActiveProductTo(-1);
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Chage cart active product to next
        if (pressedKeys.current.has("NumpadAdd") && e.code == "NumpadEnter") {
            e.preventDefault();
            groupPressed.current = true;
            if (keyPressTimer) {
                clearTimeout(keyPressTimer);
                keyPressTimer = null;
            }
            changeCartActiveProductTo(1);
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Increase discount
        if (
            ["Numpad2", "Numpad5"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            dispatch(updateDiscountAmount({ key: undefined, amount: 1 }));
            setCommand("");
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Decrease discount
        if (
            ["Numpad8", "Numpad5"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            dispatch(updateDiscountAmount({ key: undefined, amount: -1 }));
            setCommand("");
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Increase extra discount
        if (
            ["Numpad1", "Numpad4"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            dispatch(updateExtraDiscountAmount({ key: undefined, amount: 1 }));
            setCommand("");
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Decrease extra discount
        if (
            ["Numpad4", "Numpad7"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            dispatch(updateExtraDiscountAmount({ key: undefined, amount: -1 }));
            setCommand("");
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            return;
        }

        // Rrset product price
        if (
            ["PageUp", "PageDown"].every((key) => pressedKeys.current.has(key))
        ) {
            e.preventDefault();
            groupPressed.current = true;
            stopKeyUpHandler.current = true;
            dispatch(resetSalePrice(undefined));
            return;
        }

        // Dont go down. Work has done
        const notToHandleKeys = ["PageUp", "PageDown"];
        if (notToHandleKeys.includes(e.key)) {
            e.preventDefault();
            return;
        }

        if (e.code == "NumpadDecimal") {
            if (command == "..") {
                stopKeyUpHandler.current = true;
                e.preventDefault();
                setCommand("");
                return;
            }
        }

        if (e.code == "Numpad0") {
            switch (command) {
                case ".":
                    e.preventDefault();
                    setCommand("");
                    dispatch(updatePaid(0));
                    return;
            }
        }

        if (e.key == "Enter" || e.code == "NumpadAdd") {
            if (/^[1-9]$/.test(command)) {
                stopLongPress();
                stopKeyUpHandler.current = true;
                e.preventDefault();
                setCommand("");
                dispatch(
                    updateQuantity({
                        key: undefined,
                        quantity: parseInt(command),
                    })
                );
                return;
            }

            if (/^[a-zA-Z]$/.test(command)) {
                let productKey = productsMap[command];
                if (!productKey) return;
                let product = products[productKey];
                if (!product) return;
                stopKeyUpHandler.current = true;
                stopLongPress();
                e.preventDefault();
                setCommand("");
                dispatch(addToCart(product));
                return;
            }

            if (/^\.[1-9]*[0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandler.current = true;
                e.preventDefault();
                setCommand("");

                if (command == ".") {
                    dispatch(updatePaid(cart.totalPrice));
                    return;
                }

                if (command.length > 1) {
                    let amount = parseInt(command.slice(1));
                    if (amount) {
                        dispatch(updatePaid(amount));
                    }
                    return;
                }
            }

            if (command.length <= 4) {
                if (/^0[1-9][0-9]*$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandler.current = true;
                    e.preventDefault();
                    const quantity = parseInt(command.slice(1));
                    setCommand("");
                    dispatch(updateQuantity({ key: undefined, quantity }));
                    return;
                }
            }

            if (command.length >= 4) {
                if (/^[1-9]{2}0[1-9][0-9]+$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandler.current = true;
                    e.preventDefault();
                    setCommand("");
                    const key = command.slice(0, 2);
                    const quantity = parseInt(command.slice(2));
                    const productId = productsMap[key];
                    if (productId) {
                        dispatch(
                            addToCartWith({
                                product: products[productId],
                                quantity,
                            })
                        );
                    }
                    return;
                }
            }

            // To add extra discount amount dynamically with one . at the start
            if (/^\/[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandler.current = true;
                e.preventDefault();
                let amount = parseInt(command.slice(1));
                setCommand("");
                dispatch(addExtraDiscount({ key: undefined, amount }));
                return;
            }

            // To add discount amount dynamically with two .. at the start
            if (/^\*[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandler.current = true;
                e.preventDefault();
                let amount = parseInt(command.slice(1));
                setCommand("");
                dispatch(addDiscount({ key: undefined, amount }));
                return;
            }
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
                    if (
                        Object.keys(filteredProducts).length > 0 &&
                        /^[a-zA-Z]+/.test(command)
                    ) {
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
        }
    }

    function handleKeyUp(e: KeyboardEvent): void {
        if (keyPressTimer) {
            clearTimeout(keyPressTimer);
            keyPressTimer = undefined;
        }

        pressedKeys.current.clear();

        if (
            longPressed.current ||
            groupPressed.current ||
            stopKeyUpHandler.current
        ) {
            longPressed.current =
                groupPressed.current =
                stopKeyUpHandler.current =
                    false;
            return;
        }

        if (e.key === "Shift") {
            setIsShift(false);
        }

        if (commandCounter.current.value > 0) {
            commandCounter.current = { name: "unknown", value: 0 };
        }

        // Handle price update
        if (e.key === "PageUp") {
            dispatch(updateSalePrice({ key: undefined, amount: -1 }));
            return;
        } else if (e.key === "PageDown") {
            dispatch(updateSalePrice({ key: undefined, amount: 1 }));
            return;
        }

        // Handle NumpadSubtract
        if (e.code === "NumpadSubtract") {
            e.preventDefault();
            setCommand(command.slice(0, -1));
            return;
        }

        if (command.length === 0) {
            handleQuantityUpdate(e);
        }

        handleDiscountUpdate(e);
    }

    function handleQuantityUpdate(e: KeyboardEvent): void {
        switch (e.code) {
            case "NumpadAdd":
            case "ArrowUp":
                e.preventDefault();
                dispatch(incrementQuantity(undefined));
                break;
            case "NumpadEnter":
            case "ArrowDown":
                e.preventDefault();
                dispatch(decrementQuantity(undefined));
                break;
        }
    }

    function handleDiscountUpdate(e: KeyboardEvent): void {
        if (/^\*\d*$/.test(command)) {
            handleDiscountAmountUpdate(e);
        } else if (/^\/\d*$/.test(command)) {
            handleExtraDiscountAmountUpdate(e);
        }
    }

    function handleDiscountAmountUpdate(e: KeyboardEvent): void {
        switch (e.code) {
            case "ArrowUp":
            case "NumpadAdd":
                e.preventDefault();
                dispatch(updateDiscountAmount({ key: undefined, amount: 1 }));
                break;
            case "ArrowDown":
            case "NumpadEnter":
                e.preventDefault();
                dispatch(updateDiscountAmount({ key: undefined, amount: -1 }));
                break;
        }
    }

    function handleExtraDiscountAmountUpdate(e: KeyboardEvent): void {
        switch (e.code) {
            case "ArrowUp":
            case "NumpadAdd":
                e.preventDefault();
                dispatch(
                    updateExtraDiscountAmount({ key: undefined, amount: 1 })
                );
                break;
            case "ArrowDown":
            case "NumpadEnter":
                e.preventDefault();
                dispatch(
                    updateExtraDiscountAmount({ key: undefined, amount: -1 })
                );
                break;
        }
    }

    function handleAddToCart(product: ProductWithID) {
        dispatch(addToCart(product));
    }

    function handleSellPageChange(sellPageKey: string) {
        if (sellPageKey == activeSellPage.current) return;
        let cartStates: Record<string, CartState> = { ...helper.cartStates };
        cartStates[activeSellPage.current] = cart;
        dispatch(updateHelperField({ field: "cartStates", value: cartStates }));
        dispatch(setWholeCart(cartStates[sellPageKey] || initialCartState));
        activeSellPage.current = sellPageKey;
    }

    // function handleSellPageBack() {
    //     let cart = helper.cartStates[0];
    //     console.log(cart);
    //     dispatch(setWholeCart(cart));
    // }

    return (
        <div className="text-black dark:text-white">
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
                            <div className="bg-gray-300 dark:bg-gray-950 p-3 border-2 border-dashed border-slate-500 mb-3 flex justify-between items-center">
                                <div className="flex gap-3 justify-start">
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F5"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onDoubleClick={() =>
                                            handleSellPageChange("F5")
                                        }
                                    >
                                        {helper.cartStates["F5"]?.customer?.name
                                            ? helper.cartStates["F5"].customer
                                                  .name
                                            : "One"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F6"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onDoubleClick={() =>
                                            handleSellPageChange("F6")
                                        }
                                    >
                                        {helper.cartStates["F6"]?.customer?.name
                                            ? helper.cartStates["F6"].customer
                                                  .name
                                            : "Two"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F7"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onDoubleClick={() =>
                                            handleSellPageChange("F7")
                                        }
                                    >
                                        {helper.cartStates["F7"]?.customer?.name
                                            ? helper.cartStates["F7"].customer
                                                  .name
                                            : "Three"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F8"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onDoubleClick={() =>
                                            handleSellPageChange("F8")
                                        }
                                    >
                                        {helper.cartStates["F8"]?.customer?.name
                                            ? helper.cartStates["F8"].customer
                                                  .name
                                            : "Four"}
                                    </button>
                                </div>
                                <div className="border-s-2 border-dashed border-gray-600 ps-4 flex flex-wrap justify-end gap-4 items-center">
                                    <p className="inline-block bg-green-800 py-1 px-3 rounded text-white">
                                        {user.name}
                                    </p>
                                    <button
                                        onDoubleClick={logout}
                                        className="bg-red-800 text-white py-1 px-3 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div className="">
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onKeyUp={handleKeyUp}
                                    type="text"
                                    className="border-2 w-full md:w-1/2 xl:w-1/3 border-dashed border-slate-500 bg-transparent outline-none focus:border-green-500 px-4 py-2 text-lg"
                                    autoFocus
                                />
                            </div>
                            <div className="mt-3">
                                {/* <ProductsCard selected={} /> */}
                            </div>

                            {commandCounter.current.name == "completeSell" &&
                            commandCounter.current.value >= 1 ? (
                                <FinalView />
                            ) : isCustomers ? (
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
                                    className="w-full tresize-none p-3 outline-none border-dashed border-2 border-gray-600 placeholder-slate-300 mb-1 bg-transparent"
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
        </div>
    );
}