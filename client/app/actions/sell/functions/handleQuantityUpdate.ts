import {
    decrementQuantity,
    incrementQuantity,
} from "@/app/store/slices/cartSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { KeyboardEvent } from "react";

export default function handleQuantityUpdate(
    e: KeyboardEvent,
    dispatch: Dispatch<any>
): void {
    switch (e.code) {
        case "NumpadAdd":
        case "ArrowUp":
            // e.preventDefault();
            dispatch(incrementQuantity(undefined));
            break;
        case "NumpadEnter":
        case "ArrowDown":
            // e.preventDefault();
            dispatch(decrementQuantity(undefined));
            break;
    }
}
