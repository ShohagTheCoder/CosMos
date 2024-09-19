import {
    updateSalePrice,
    incrementQuantity,
    decrementQuantity,
    updateDiscountAmount,
    updateExtraDiscountAmount,
} from "@/app/store/slices/cartSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export function useHandleKeyUp(
    command: string,
    setCommand: (command: string) => void,
    pressedKeysRef: React.MutableRefObject<Set<string>>,
    longPressedRef: React.MutableRefObject<boolean>,
    groupPressedRef: React.MutableRefObject<boolean>,
    stopKeyUpHandlerRef: React.MutableRefObject<boolean>,
    keyPressTimerRef: React.MutableRefObject<
        ReturnType<typeof setTimeout> | undefined
    >
) {
    const dispatch = useDispatch();

    const handleKeyUp = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>): void => {
            console.log(e.key);
            // Clear the keyPressTimer if it's defined
            if (keyPressTimerRef.current) {
                clearTimeout(keyPressTimerRef.current);
                keyPressTimerRef.current = undefined;
            }

            pressedKeysRef.current.clear();

            // If longPressed, groupPressed, or stopKeyUpHandler is true, reset and return
            if (
                longPressedRef.current ||
                groupPressedRef.current ||
                stopKeyUpHandlerRef.current
            ) {
                longPressedRef.current = false;
                groupPressedRef.current = false;
                stopKeyUpHandlerRef.current = false;
                return;
            }

            // Handle shift key state (this part is up to your logic)
            if (e.key === "Shift") {
                // Do something when shift is released, if necessary
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
        },
        [
            command,
            dispatch,
            setCommand,
            pressedKeysRef,
            keyPressTimerRef,
            longPressedRef,
            groupPressedRef,
            stopKeyUpHandlerRef,
        ]
    );

    return {
        onKeyUp: handleKeyUp,
    };
}
