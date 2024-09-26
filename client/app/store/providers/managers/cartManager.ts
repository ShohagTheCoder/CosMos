import { ProductWithID } from "@/app/products/interfaces/product.interface";
import StateManager from "./common/stateManager";
import { Dispatch } from "@reduxjs/toolkit";
import { CartState } from "../../slices/cartSlice";
import { cloneDeep } from "lodash";

type ReducerFunction = any;

export class CartManager<T extends CartState> extends StateManager<T> {
    constructor(
        initialState: T,
        dispatchFunction: Dispatch<any>,
        reducerFunction: ReducerFunction
    ) {
        super(initialState, dispatchFunction, reducerFunction);

        // Update total price of cart if products change
        this.listen("products", () => {
            this.set(
                "totalPrice",
                this.values("products").reduce(
                    (total, product) => total + product.subTotal,
                    0
                )
            );
        });

        // Update due price of cart if totalPrice change
        this.listen("totalPrice", () => {
            this.set("due", this.get("totalPrice") - this.get("paid"));
        });
    }

    addToCart(payload: any) {
        let exist = this.has(
            `products.${payload._id}`,
            (product: ProductWithID) => {
                product.quantity += 1;
                product.subTotal += product.price;
                return product;
            }
        );

        if (!exist) {
            this.set(`products.${payload._id}`, payload);
        }

        return this;
    }
}
