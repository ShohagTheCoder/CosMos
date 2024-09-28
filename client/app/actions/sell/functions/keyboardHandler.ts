import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState } from "@/app/store/slices/cartSlice";
import { KeyboardEvent, useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export function useHandleKeyUp(
    command: string,
    // eslint-disable-next-line no-unused-vars
    setCommand: (command: string) => void,
    cart: CartState,
    handleSellPageChange: any,
    getProductByCommand: any
) {
    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // console.log("---------------------------------");
            // console.log(e.key);
            // console.log(e.code);

            if (
                command.length == 1 &&
                /^[a-zA-Z]$/.test(command) &&
                command == e.key
            ) {
                let product = getProductByCommand(command);
                if (product) {
                    cartManager.addToCart(product).save();
                }
                return;
            }

            // Handle sell page navigation
            const sellPageNavigationKeys = ["F5", "F6", "F7", "F8"];
            if (sellPageNavigationKeys.includes(e.key)) {
                e.preventDefault();
                handleSellPageChange(e.key);
                return;
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
            if (commandCounter.value > 0) {
                setCommandCounter({
                    name: "unknown",
                    value: 0,
                });
            }
        }
    );
}
