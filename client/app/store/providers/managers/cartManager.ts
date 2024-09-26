import { ProductWithID } from "@/app/products/interfaces/product.interface";
import StateManager from "./common/stateManager";
import { Dispatch } from "@reduxjs/toolkit";
import { CartState } from "../../slices/cartSlice";

type ReducerFunction = any;

export class CartManager<T extends CartState> extends StateManager<T> {
    constructor(
        initialState: T,
        dispatchFunction: Dispatch<any>,
        reducerFunction: ReducerFunction
    ) {
        super(initialState, dispatchFunction, reducerFunction);

        this.listen("products.[?]", (id) => {
            this.update(`products.${id}`, (product) => {
                if (product) {
                    product.price = product.price - product.discount;
                    product.count =
                        product.quantity * product.units[product.unit].value;
                    product.subTotal =
                        product.price * product.count - product.extraDiscount;
                    return product;
                }
            });
        });

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

        // Update due price of cart if totalPrice change
        this.listen("paid", () => {
            this.set("due", this.get("totalPrice") - this.get("paid"));
        });
    }

    addToCart(payload: ProductWithID) {
        let exist = this.has(
            `products.${payload._id}`,
            (product: ProductWithID) => {
                product.quantity += 1;
                product.subTotal += product.price;
                this.set("activeProduct", product._id);
                return product;
            }
        );

        if (!exist) {
            payload.unit = payload.measurements[0].unit;
            payload.quantity = payload.measurements[0].value;
            this.set(`products.${payload._id}`, payload).set(
                "activeProduct",
                payload._id
            );
        }

        return this;
    }

    updateProduct(
        id: string | undefined = undefined,
        value: Record<string, any>
    ) {
        if (!id) id = this.get("activeProduct");
        this.has(`products.${id}`, (product: ProductWithID) => {
            product = { ...product, ...value };
            product.price = product.price - product.discount;
            product.count =
                product.quantity * product.units[product.unit].value;
            product.subTotal =
                product.price * product.count - product.extraDiscount;
            return product;
        });
        return this;
    }
}
