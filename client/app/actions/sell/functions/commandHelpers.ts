import {
    addDiscount,
    addExtraDiscount,
    addTo,
    CartState,
    removeFromCart,
    resetSalePrice,
    setWholeCart,
    updateQuantity,
} from "@/app/store/slices/cartSlice";
import { updateHelperField } from "@/app/store/slices/helperSlice";
import { KeyboardEvent } from "react";

// Checks if the key is a special key that requires preventDefault
export function isSpecialKey(e: KeyboardEvent): boolean {
    const specialKeys = [
        "Enter",
        "NumpadAdd",
        "NumpadSubtract",
        "ArrowUp",
        "ArrowDown",
    ];
    return specialKeys.includes(e.code);
}

// Handle sell page change with additional parameters

// Checks if the key is a repeatable key (allowed to repeat)
export function isRepeatableKey(e: KeyboardEvent): boolean {
    const repeatableKeys = ["Backspace", "Space", "Numpad0"];
    return repeatableKeys.includes(e.code);
}

// Checks if the key is for long press actions
export function isLongPressKey(e: KeyboardEvent): boolean {
    const longPressKeys = [
        "NumpadAdd",
        "NumpadEnter",
        "F9",
        "Delete",
        "ArrowUp",
        "ArrowDown",
        "NumpadSubtract",
    ];
    return longPressKeys.includes(e.code);
}

// Handles sell page navigation with specific export function keys
export function handleSellPageNavigation(
    e: KeyboardEvent,
    stopKeyUpHandlerRef: React.MutableRefObject<boolean>,
    handleSellPageChange: any
) {
    const sellPageNavigationKeys = ["F5", "F6", "F7", "F8"];
    if (sellPageNavigationKeys.includes(e.key)) {
        stopKeyUpHandlerRef.current = true;
        handleSellPageChange(e.key);
    }
}

// Handles the completion of a sale based on command and key presses
export function handleCompleteSell(
    command: string,
    pressedKeysRef: React.MutableRefObject<Set<string>>,
    commandCounter: React.MutableRefObject<{ name: string; value: number }>,
    setCommand: React.Dispatch<React.SetStateAction<string>>
) {
    if (
        ["Numpad0", "Numpad1"].every((key) => pressedKeysRef.current.has(key))
    ) {
        setCommand("");
        if (commandCounter.current.name === "completeSell") {
            commandCounter.current.value += 1;
            if (commandCounter.current.value >= 3) {
                commandCounter.current = { name: "unknown", value: 0 };
                console.log("Complete sell");
            }
        } else {
            commandCounter.current = { name: "completeSell", value: 1 };
        }
    }
}

// Starts a long press timer for certain keys
export function startLongPressTimer(
    e: KeyboardEvent,
    longPressDuration: number,
    keyPressTimerRef: React.MutableRefObject<NodeJS.Timeout | undefined>,
    longPressedRef: React.MutableRefObject<boolean>,
    setCommand: React.Dispatch<React.SetStateAction<string>>,
    dispatch: any,
    handleLongKeyPress: any
) {
    if (isLongPressKey(e) && keyPressTimerRef.current == undefined) {
        switch (e.code) {
            case "NumpadAdd":
            case "NumpadEnter":
            case "ArrowUp":
            case "ArrowDown":
                keyPressTimerRef.current = setTimeout(
                    () => handleLongKeyPress(e),
                    longPressDuration
                );
                break;
            case "NumpadSubtract":
                keyPressTimerRef.current = setTimeout(() => {
                    longPressedRef.current = true;
                    setCommand("");
                }, longPressDuration);
                break;
            case "Delete":
                keyPressTimerRef.current = setTimeout(() => {
                    longPressedRef.current = true;
                    dispatch(removeFromCart(undefined));
                }, longPressDuration);
                break;
        }
    }
}

// Handles updating quantities dynamically based on the command
export function handleUpdateQuantity(
    command: string,
    dispatch: any,
    setCommand: React.Dispatch<React.SetStateAction<string>>
) {
    if (/^[1-9]$/.test(command)) {
        setCommand("");
        dispatch(
            updateQuantity({
                key: undefined,
                quantity: parseInt(command),
            })
        );
    }
}

// Handles adding products to cart based on command
export function handleAddProductToCart(
    command: string,
    productsMap: any,
    products: any,
    dispatch: any,
    setCommand: React.Dispatch<React.SetStateAction<string>>
) {
    if (/^[a-zA-Z]$/.test(command)) {
        let productKey = productsMap[command];
        if (!productKey) return;
        let product = products[productKey];
        if (!product) return;
        setCommand("");
        dispatch(addTo(product));
    }
}

// Handles discount updates
export function handleDiscount(
    command: string,
    dispatch: any,
    setCommand: React.Dispatch<React.SetStateAction<string>>,
    type: "discount" | "extraDiscount"
) {
    if (type === "discount" && /^\*[1-9][0-9]*$/.test(command)) {
        let amount = parseInt(command.slice(1));
        setCommand("");
        dispatch(addDiscount({ key: undefined, amount }));
    } else if (type === "extraDiscount" && /^\/[1-9][0-9]*$/.test(command)) {
        let amount = parseInt(command.slice(1));
        setCommand("");
        dispatch(addExtraDiscount({ key: undefined, amount }));
    }
}

// Resets the product price if the right keys are pressed
export function handleResetPrice(
    pressedKeysRef: React.MutableRefObject<Set<string>>,
    dispatch: any,
    stopKeyUpHandlerRef: React.MutableRefObject<boolean>
) {
    if (
        ["PageUp", "PageDown"].every((key) => pressedKeysRef.current.has(key))
    ) {
        stopKeyUpHandlerRef.current = true;
        dispatch(resetSalePrice(undefined));
    }
}

// Clears the command when certain keys are pressed
export function handleClearCommand(
    e: KeyboardEvent,
    setCommand: React.Dispatch<React.SetStateAction<string>>
) {
    if (e.key === "/" || e.key === "*") {
        setCommand("");
    }
}
