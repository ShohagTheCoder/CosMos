import { ProductWithID } from "@/app/products/interfaces/product.interface";
import useCartManager from "@/app/store/providers/cartProvider";
import {
    shiftMeasurementTo,
    setPriceToWithDiscount,
    shiftUnitTo,
    CartState,
} from "@/app/store/slices/cartSlice";
import apiClient from "@/app/utils/apiClient";
import { KeyboardEvent, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function useHandleKeyUp(
    command: string,
    // eslint-disable-next-line no-unused-vars
    setCommand: (command: string) => void,
    cart: CartState,
    products: Record<string, ProductWithID>,
    filteredProducts: Record<string, ProductWithID>,
    filteredCustomers: any,
    isCustomers: any,
    handleSellPageChange: any,
    getProductByCommand: any,
    handleCompleteSell: () => void,
    // eslint-disable-next-line no-unused-vars
    setProductUpdateShortcut: (productId: string | undefined) => void,
    // eslint-disable-next-line no-unused-vars
    handleUpdateProductPrice: (amount: number) => void
) {
    const dispatch = useDispatch();
    const longPressDuration = 400;
    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const cartManager = useCartManager();

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
            cartManager
                .set("customer", customer)
                .set("customerAccount", data)
                .save();
        }
    }

    function handleNumpadNumberKeysLongPress(e: KeyboardEvent) {
        if (command.length == 0) {
            setCommand("");
            cartManager
                .set("products.{{activeProduct}}.quantity", parseInt(e.key))
                .save();
            return;
        }

        if (/^[0-9]*00[0-9]*$/.test(command)) {
            let splited = command.split("00", 2);
            let commandKey = splited[0];
            let amount = parseInt(splited[1] + e.key);
            if (commandKey.length > 0) {
                console.log(commandKey);
                let product = getProductByCommand(commandKey);
                console.log(product);
                if (product) {
                    cartManager
                        .addTo(product)
                        .update(`products.{{activeProduct}}.discount`, () => {
                            if (amount < product.price / 2) {
                                console.log("amount is price");
                                return amount;
                            } else {
                                console.log("price - amount");
                                return product.price - amount;
                            }
                        })
                        .save();
                }
            }
            setCommand("");
            e.preventDefault();
            stopKeyUpHandlerRef.current = true;
            return;
        }

        if (/^[1-9]+$/.test(command)) {
            let product = getProductByCommand(command);
            console.log(product);
            if (product) {
                cartManager
                    .addTo(product)
                    .set(`products.${product._id}.quantity`, parseInt(e.key))
                    .save();
            }
            return;
        }

        if (/^[0-9]+$/.test(command)) {
            let splited = command.split("0", 2);
            let commandKey = splited[0];
            let quantity = parseInt(splited[1] + e.key);
            let product = getProductByCommand(commandKey);
            console.log(product);
            if (product) {
                cartManager
                    .addTo(product)
                    .set(`products.${product._id}.quantity`, quantity)
                    .save();
            }
            return;
        }
    }

    // Core long press handler function
    function handleLongPress(e: KeyboardEvent, callback: () => void) {
        if (keyPressTimerRef.current === undefined) {
            e.preventDefault(); // Prevent default behavior immediately
            keyPressTimerRef.current = setTimeout(() => {
                longPressedRef.current = true; // Indicate a long press occurred
                e.preventDefault(); // Prevent again if needed during the callback
                callback(); // Execute the long-press action
            }, longPressDuration);
        }
    }

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
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
                let product = getProductByCommand(command);
                if (product) {
                    cartManager.addTo(product).save();
                }
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
                "PageUp",
                "PageDown",
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
                    case "ArrowUp":
                        handleLongPress(e, () => {
                            cartManager.changeActiveProduct(-1).save();
                        });
                        break;
                    case "NumpadEnter":
                    case "ArrowDown":
                        handleLongPress(e, () => {
                            cartManager.changeActiveProduct(1).save();
                        });
                        break;
                    case "NumpadSubtract":
                        handleLongPress(e, () => {
                            setCommand("");
                        });
                        break;
                    case "Delete":
                        handleLongPress(e, () => {
                            cartManager.removeToCart(undefined).save();
                        });
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
                        handleLongPress(e, () => {
                            handleNumpadNumberKeysLongPress(e);
                        });
                        break;
                    case "ArrowLeft":
                        handleLongPress(e, () => {
                            dispatch(
                                shiftUnitTo({ key: undefined, value: -1 })
                            );
                        });
                        break;
                    case "ArrowRight":
                        handleLongPress(e, () => {
                            dispatch(shiftUnitTo({ key: undefined, value: 1 }));
                        });
                        break;
                    case "PageUp":
                        handleLongPress(e, () => {
                            handleUpdateProductPrice(10);
                        });
                        break;
                    case "PageDown":
                        handleLongPress(e, () => {
                            handleUpdateProductPrice(-10);
                        });
                        break;
                }
            }

            if (e.key == "/") {
                setCommand("");
                return;
            }

            if (e.key == "*") {
                setCommand("");
                return;
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
                        handleCompleteSell();
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
                cartManager.changeActiveProduct(1).save();
                return;
            }

            // Increase discount
            if (
                ["Numpad2", "Numpad5"].every((key) =>
                    pressedKeysRef.current.has(key)
                )
            ) {
                e.preventDefault();
                cartManager
                    .increment("products.{{activeProduct}}.discount")
                    .save();
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
                cartManager
                    .decrement("products.{{activeProduct}}.discount")
                    .save();
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
                cartManager
                    .increment("products.{{activeProduct}}.extraDiscount")
                    .save();
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
                cartManager
                    .decrement("products.{{activeProduct}}.extraDiscount")
                    .save();
                setCommand("");
                groupPressedRef.current = true;
                stopKeyUpHandlerRef.current = true;
                return;
            }

            // Reset product price
            if (
                ["PageUp", "PageDown"].every((key) =>
                    pressedKeysRef.current.has(key)
                )
            ) {
                e.preventDefault();
                groupPressedRef.current = true;
                stopKeyUpHandlerRef.current = true;
                if (cart.activeProduct) {
                    let updatePrice =
                        cart.products[cart.activeProduct].updatePrice;
                    if (updatePrice !== 0) {
                        handleUpdateProductPrice(
                            -cart.products[cart.activeProduct].updatePrice
                        );
                    }
                }
                return;
            }

            // // Dont go down. Work has done
            // const notToHandleKeys = ["PageUp", "PageDown"];
            // if (notToHandleKeys.includes(e.key)) {
            //     e.preventDefault();
            //     return;
            // }

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
                        cartManager.set("paid", 0).save();
                        return;
                }
            }

            if (e.code == "NumpadAdd") {
                if (/^[1-9][0-9]*$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandlerRef.current = true;
                    setCommand("");
                    cartManager
                        .set(
                            "products.{{activeProduct}}.quantity",
                            parseInt(command)
                        )
                        .save();
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
                        let product = getProductByCommand(commandKey);
                        if (product) {
                            cartManager.addTo(product).save();
                        }
                    }
                    setCommand("");
                    dispatch(
                        setPriceToWithDiscount({ key: undefined, amount })
                    );
                    return;
                }

                if (/^[1-9]+$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandlerRef.current = true;
                    let product = getProductByCommand(command);
                    if (product) {
                        cartManager
                            .addTo(product)
                            .set(
                                `products.${product._id}.quantity`,
                                parseInt(e.key)
                            )
                            .save();
                    }
                    return;
                }

                if (/^[1-9][0-9]*$/.test(command)) {
                    let splited = command.split("0", 2);
                    let commandKey = splited[0];
                    let quantity = parseInt(splited[1]);
                    stopLongPress();
                    let product = getProductByCommand(commandKey);
                    if (product) {
                        cartManager
                            .addTo(product)
                            .set(`products.${product._id}.quantity`, quantity)
                            .save();
                    }
                    stopKeyUpHandlerRef.current = true;
                    return;
                }

                if (/^[a-zA-Z]$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandlerRef.current = true;
                    let product = getProductByCommand(command);
                    if (product) {
                        cartManager.addTo(product).save();
                    }
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
                        cartManager
                            .set("paid", cartManager.get("totalPrice"))
                            .save();
                        return;
                    }

                    if (command.length > 1) {
                        let amount = parseInt(command.slice(1));
                        if (amount) {
                            cartManager.set("paid", amount).save();
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
                    // dispatch(addExtraDiscount({ key: undefined, amount }));
                    cartManager
                        .set("products.{{activeProduct}}.extraDiscount", amount)
                        .save();
                    return;
                }

                // To add discount amount dynamically with two .. at the start
                if (/^\*[1-9][0-9]*$/.test(command)) {
                    stopLongPress();
                    stopKeyUpHandlerRef.current = true;
                    e.preventDefault();
                    let amount = parseInt(command.slice(1));
                    setCommand("");
                    // dispatch(addDiscount({ key: undefined, amount }));
                    cartManager
                        .set("products.{{activeProduct}}.discount", amount)
                        .save();
                    return;
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            getProductByCommand,
            cart,
            command,
            commandCounter,
            handleSellPageChange,
        ]
    );

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
                    handleUpdateProductPrice(1);
                    return;
                case "PageDown":
                    handleUpdateProductPrice(-1);
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
                        cartManager
                            .increment("products.{{activeProduct}}.quantity")
                            .save();
                        return;
                    case "NumpadEnter":
                    case "ArrowDown":
                        e.preventDefault();
                        cartManager
                            .decrement(`products.{{activeProduct}}.quantity`)
                            .save();
                        return;
                }
            }

            // Handle discount updates based on the command
            if (/^\*\d*$/.test(command)) {
                switch (e.code) {
                    case "ArrowUp":
                    case "NumpadAdd":
                        e.preventDefault();
                        cartManager
                            .increment("products.{{activeProduct}}.discount")
                            .save();
                        return;
                    case "ArrowDown":
                    case "NumpadEnter":
                        e.preventDefault();
                        cartManager
                            .decrement("products.{{activeProduct}}.discount")
                            .save();
                        return;
                }
            }

            if (/^\/\d*$/.test(command)) {
                switch (e.code) {
                    case "ArrowUp":
                    case "NumpadAdd":
                        e.preventDefault();
                        cartManager
                            .increment(
                                "products.{{activeProduct}}.extraDiscount"
                            )
                            .save();
                        return;
                    case "ArrowDown":
                    case "NumpadEnter":
                        e.preventDefault();
                        cartManager
                            .decrement(
                                "products.{{activeProduct}}.extraDiscount"
                            )
                            .save();
                        return;
                }
            }

            if (e.key == "ContextMenu") {
                e.preventDefault();
                setProductUpdateShortcut(undefined);
                return;
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
                            let currentIndex = cartManager.get(
                                "selectedProductIndex"
                            );
                            let newIndex = currentIndex;
                            if (currentIndex == 0) {
                                newIndex = max;
                            } else {
                                newIndex = currentIndex - 1;
                            }
                            cartManager
                                .set("selectedProductIndex", newIndex)
                                .save();
                        } else {
                            cartManager.set("selectedProductIndex", max).save();
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
                            let currentIndex = cartManager.get(
                                "selectedProductIndex"
                            );
                            let newIndex = currentIndex;
                            if (currentIndex == max) {
                                newIndex = 0;
                            } else {
                                newIndex = currentIndex + 1;
                            }
                            cartManager
                                .set("selectedProductIndex", newIndex)
                                .save();
                        } else {
                            dispatch(shiftMeasurementTo(1));
                        }
                    }
                    break;
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
                            cartManager.addTo(product).save();
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            commandCounter.value,
            command,
            dispatch,
            setCommand,
            filteredCustomers,
            filteredProducts,
            isCustomers,
            cart,
        ]
    );

    return {
        onKeyUp: handleKeyUp,
        onkeydown: handleKeyDown,
        commandCounter,
    };
}
