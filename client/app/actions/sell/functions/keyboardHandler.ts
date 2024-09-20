import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    updateSalePrice,
    incrementQuantity,
    decrementQuantity,
    updateDiscountAmount,
    updateExtraDiscountAmount,
    addDiscount,
    addExtraDiscount,
    addToCart,
    addToCartWith,
    removeFromCart,
    resetSalePrice,
    selectNexProduct,
    selectPreviousProduct,
    shiftMeasurementTo,
    updatePaid,
    updateQuantity,
    addCustomer,
    addCustomerAccount,
    setPriceToWithDiscount,
    shiftUnitTo,
} from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import productsMap from "@/app/utils/productsMap";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function useHandleKeyUp(
    command: string,
    // eslint-disable-next-line no-unused-vars
    setCommand: (command: string) => void,
    cart: any,
    products: Record<string, ProductWithID>,
    filteredProducts: Record<string, ProductWithID>,
    filteredCustomers: any,
    isCustomers: any,
    handleSellPageChange: any,
    changeCartActiveProductTo: any
) {
    const dispatch = useDispatch();
    const longPressDuration = 400;
    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const pressedKeysRef = useRef(new Set<string>());
    let keyPressTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined
    );
    let longPressedRef = useRef(false);
    let groupPressedRef = useRef(false);
    let stopKeyUpHandlerRef = useRef(false);

    const stopLongPress = () => {
        if (keyPressTimerRef.current !== undefined) {
            clearTimeout(keyPressTimerRef.current);
            keyPressTimerRef.current = undefined;
        }
    };

    async function handleAddCustomer() {
        if (filteredCustomers) {
            const customer: any =
                Object.values(filteredCustomers)[cart.selectedProductIndex];
            const { data } = await apiClient.get(
                `accounts/${customer.account}`
            );
            dispatch(addCustomer(customer));
            dispatch(addCustomerAccount(data));
        }
    }

    function handleNumpadNumberKeysLongPress(e: KeyboardEvent) {
        if (command.length == 0) {
            setCommand("");
            dispatch(
                updateQuantity({ key: undefined, quantity: parseInt(e.key) })
            );
            return;
        }

        if (/^[0-9]*00[0-9]*$/.test(command)) {
            let splited = command.split("00", 2);
            let commandKey = splited[0];
            let amount = parseInt(splited[1] + e.key);
            if (commandKey.length > 0) {
                let productKey = productsMap[commandKey];
                if (!productKey) return;
                let product = products[productKey];
                if (!product) return;
                dispatch(addToCart(product));
            }
            setCommand("");
            dispatch(setPriceToWithDiscount({ key: undefined, amount }));
            return;
        }

        if (/^[1-9]+$/.test(command)) {
            let productKey = productsMap[command];
            if (!productKey) return;
            let product = products[productKey];
            if (!product) return;
            setCommand("");
            dispatch(addToCart(product));
            dispatch(
                updateQuantity({ key: undefined, quantity: parseInt(e.key) })
            );
            return;
        }

        if (/^[0-9]+$/.test(command)) {
            let splited = command.split("0", 2);
            let commandKey = splited[0];
            let quantity = parseInt(splited[1] + e.key);
            let productKey = productsMap[commandKey];
            if (!productKey) return;
            let product = products[productKey];
            if (!product) return;
            setCommand("");
            dispatch(addToCart(product));
            dispatch(updateQuantity({ key: undefined, quantity }));
            return;
        }
    }

    // Add to cart with product sortcut
    function addToCartByProductSortcut(e: KeyboardEvent, sortcut: string) {
        let productKey = productsMap[sortcut];
        if (!productKey) return;
        let product = products[productKey];
        if (!product) return;
        e.preventDefault();
        setCommand("");
        dispatch(addToCart(product));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        // console.log("---------------------------------");
        // console.log(e.key);
        // console.log(e.code);

        if (e.code == "Minus") {
            e.preventDefault();
            setCommand("");
            return;
        }

        const repeatableKeys = ["Backspace", "Space"];
        if (!repeatableKeys.includes(e.code)) {
            if (pressedKeysRef.current.has(e.code)) {
                e.preventDefault();
                return;
            }
        }

        if (
            command.length == 1 &&
            /^[a-zA-Z]$/.test(command) &&
            command == e.key
        ) {
            addToCartByProductSortcut(e, command + e.key);
            return;
        }

        // Add to pressed keys
        pressedKeysRef.current.add(e.code);
        // Remove previous saved key so we can click again if keyup even occur in the keyup handler
        groupPressedRef.current = false;

        // Important: preventDefault special keys
        const specialKeys = [
            "Enter",
            "NumpadAdd",
            "NumpadSubtract",
            "ArrowUp",
            "ArrowDown",
            "Tab",
        ];
        if (specialKeys.includes(e.code)) {
            e.preventDefault();
        }

        // Handle sell page navigation
        const sellPageNavigationKeys = ["F5", "F6", "F7", "F8"];
        if (sellPageNavigationKeys.includes(e.key)) {
            e.preventDefault();
            stopKeyUpHandlerRef.current = true;
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
            "ArrowLeft",
            "ArrowRight",
            "Numpad0",
            "Numpad1",
            "Numpad2",
            "Numpad3",
            "Numpad4",
            "Numpad5",
            "Numpad6",
            "Numpad7",
            "Numpad8",
            "Numpad9",
        ];
        if (
            longPressKeys.includes(e.code) &&
            keyPressTimerRef.current == undefined
        ) {
            switch (e.code) {
                case "NumpadAdd":
                case "NumpadEnter":
                case "ArrowUp":
                case "ArrowDown":
                    e.preventDefault();
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
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
                    }, longPressDuration);
                    break;
                case "NumpadSubtract":
                    e.preventDefault();
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        setCommand("");
                    }, longPressDuration);
                    break;
                case "Delete":
                    e.preventDefault();
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        dispatch(removeFromCart(undefined));
                    }, longPressDuration);
                    break;
                case "Numpad0":
                case "Numpad1":
                case "Numpad2":
                case "Numpad3":
                case "Numpad4":
                case "Numpad5":
                case "Numpad6":
                case "Numpad7":
                case "Numpad8":
                case "Numpad9":
                    // e.preventDefault();
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        handleNumpadNumberKeysLongPress(e);
                    }, longPressDuration);
                    break;
                case "ArrowLeft":
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        dispatch(shiftUnitTo({ key: undefined, value: -1 }));
                    }, longPressDuration);
                    break;
                case "ArrowRight":
                    keyPressTimerRef.current = setTimeout(() => {
                        longPressedRef.current = true;
                        dispatch(shiftUnitTo({ key: undefined, value: 1 }));
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
            ["Numpad0", "Numpad1"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            setCommand("");
            stopKeyUpHandlerRef.current = true;
            groupPressedRef.current = true;

            if (commandCounter.name === "completeSell") {
                commandCounter.value += 1;
                if (commandCounter.value >= 3) {
                    setCommandCounter({ name: "unknown", value: 0 });
                    console.log("Complete sell");
                }
            } else {
                setCommandCounter({ name: "completeSell", value: 1 });
            }
            return;
        }

        // Chage cart active product to next
        if (
            ["NumpadAdd", "NumpadEnter"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
            if (keyPressTimerRef.current) {
                clearTimeout(keyPressTimerRef.current);
                keyPressTimerRef.current = undefined;
            }
            changeCartActiveProductTo(1);
            return;
        }

        // Increase discount
        if (
            ["Numpad2", "Numpad5"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            dispatch(updateDiscountAmount({ key: undefined, amount: 1 }));
            setCommand("");
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
            return;
        }

        // Decrease discount
        if (
            ["Numpad8", "Numpad5"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            dispatch(updateDiscountAmount({ key: undefined, amount: -1 }));
            setCommand("");
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
            return;
        }

        // Increase extra discount
        if (
            ["Numpad1", "Numpad4"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            dispatch(updateExtraDiscountAmount({ key: undefined, amount: 1 }));
            setCommand("");
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
            return;
        }

        // Decrease extra discount
        if (
            ["Numpad4", "Numpad7"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            dispatch(updateExtraDiscountAmount({ key: undefined, amount: -1 }));
            setCommand("");
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
            return;
        }

        // Rrset product price
        if (
            ["PageUp", "PageDown"].every((key) =>
                pressedKeysRef.current.has(key)
            )
        ) {
            e.preventDefault();
            groupPressedRef.current = true;
            stopKeyUpHandlerRef.current = true;
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
                stopKeyUpHandlerRef.current = true;
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

        if (e.code == "NumpadAdd") {
            if (/^[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                setCommand("");
                dispatch(
                    updateQuantity({
                        key: undefined,
                        quantity: parseInt(command),
                    })
                );
                return;
            }
        }

        if (e.key == "Enter") {
            if (/^[0-9]*00[0-9]*$/.test(command)) {
                stopLongPress();
                let splited = command.split("00", 2);
                let commandKey = splited[0];
                let amount = parseInt(splited[1]);
                if (commandKey.length > 0) {
                    addToCartByProductSortcut(e, commandKey);
                }
                setCommand("");
                dispatch(setPriceToWithDiscount({ key: undefined, amount }));
                return;
            }

            if (/^[1-9]+$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                addToCartByProductSortcut(e, command);
                dispatch(
                    updateQuantity({
                        key: undefined,
                        quantity: parseInt(e.key),
                    })
                );
                return;
            }

            if (/^[1-9][0-9]*$/.test(command)) {
                let splited = command.split("0", 2);
                let commandKey = splited[0];
                let quantity = parseInt(splited[1]);
                stopLongPress();
                addToCartByProductSortcut(e, commandKey);
                stopKeyUpHandlerRef.current = true;
                dispatch(updateQuantity({ key: undefined, quantity }));
                return;
            }

            if (/^[a-zA-Z]$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                addToCartByProductSortcut(e, command);
                return;
            }
        }

        if (e.key == "Enter" || e.code == "NumpadAdd") {
            if (/^\.[1-9]*[0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
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

            // To add extra discount amount dynamically with one . at the start
            if (/^\/[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                e.preventDefault();
                let amount = parseInt(command.slice(1));
                setCommand("");
                dispatch(addExtraDiscount({ key: undefined, amount }));
                return;
            }

            // To add discount amount dynamically with two .. at the start
            if (/^\*[1-9][0-9]*$/.test(command)) {
                stopLongPress();
                stopKeyUpHandlerRef.current = true;
                e.preventDefault();
                let amount = parseInt(command.slice(1));
                setCommand("");
                dispatch(addDiscount({ key: undefined, amount }));
                return;
            }
        }
    };

    const handleKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            // console.log(e.key);
            // Clear the keyPressTimer if it's defined
            if (keyPressTimerRef.current) {
                clearTimeout(keyPressTimerRef.current);
                keyPressTimerRef.current = undefined;
            }

            pressedKeysRef.current.clear();

            // If stopKeyUp handler then only Stop key up handler nothing else
            if (stopKeyUpHandlerRef.current) {
                stopKeyUpHandlerRef.current = false;
                return;
            }

            // If group pressed then stop and only change grouppressd value to flase
            if (groupPressedRef.current) {
                groupPressedRef.current = false;
                return;
            }

            // If log pressed then stop and only change long pressed value to flase
            if (longPressedRef.current) {
                longPressedRef.current = false;
                return;
            }

            if (commandCounter.value > 0) {
                setCommandCounter({
                    name: "unknown",
                    value: 0,
                });
            }

            // Handle sale price update
            switch (e.key) {
                case "PageUp":
                    dispatch(updateSalePrice({ key: undefined, amount: -1 }));
                    return;
                case "PageDown":
                    dispatch(updateSalePrice({ key: undefined, amount: 1 }));
                    return;
            }

            // Handle other key events based on command state
            if (e.code === "NumpadSubtract") {
                e.preventDefault();
                setCommand(command.slice(0, -1));
                return;
            }

            if (command.length === 0) {
                switch (e.code) {
                    case "NumpadAdd":
                    case "ArrowUp":
                        e.preventDefault();
                        dispatch(incrementQuantity(undefined));
                        return;
                    case "NumpadEnter":
                    case "ArrowDown":
                        e.preventDefault();
                        dispatch(decrementQuantity(undefined));
                        return;
                }
            }

            // Handle discount updates based on the command
            if (/^\*\d*$/.test(command)) {
                switch (e.code) {
                    case "ArrowUp":
                    case "NumpadAdd":
                        e.preventDefault();
                        dispatch(
                            updateDiscountAmount({ key: undefined, amount: 1 })
                        );
                        return;
                    case "ArrowDown":
                    case "NumpadEnter":
                        e.preventDefault();
                        dispatch(
                            updateDiscountAmount({ key: undefined, amount: -1 })
                        );
                        return;
                }
            }

            if (/^\/\d*$/.test(command)) {
                switch (e.code) {
                    case "ArrowUp":
                    case "NumpadAdd":
                        e.preventDefault();
                        dispatch(
                            updateExtraDiscountAmount({
                                key: undefined,
                                amount: 1,
                            })
                        );
                        return;
                    case "ArrowDown":
                    case "NumpadEnter":
                        e.preventDefault();
                        dispatch(
                            updateExtraDiscountAmount({
                                key: undefined,
                                amount: -1,
                            })
                        );
                        return;
                }
            }

            let max = 0;
            switch (e.key) {
                case "Shift":
                    // setIsShift(true);
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
        },
        [commandCounter.value, command, dispatch, setCommand]
    );

    return {
        onKeyUp: handleKeyUp,
        onkeydown: handleKeyDown,
        commandCounter,
    };
}
