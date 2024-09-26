import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useProductManager } from "./productManager";

export default function Com() {
    const product = useSelector((state: RootState) => state.product);
    let productManager = useProductManager();

    function handleClick() {
        productManager.set("name", "Shohag Filve").save();
    }
    return (
        <div>
            <div className="w-[400px] mx-auto mt-[100px]">
                <p>{product.name || "name"}</p>
                <button onClick={handleClick}>Click</button>
                <button
                    onClick={() => {
                        productManager.set("name", "Google").save();
                    }}
                >
                    Click
                </button>
            </div>
        </div>
    );
}
