import { ProductWithID } from "@/app/products/interfaces/product.interface";
import StateManager from "./common/stateManager";
import { Dispatch } from "@reduxjs/toolkit";
import { CartState } from "../../slices/cartSlice";
import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import getMeasurementTo from "@/app/functions/getMeasurementTo";
import getUnits from "@/app/functions/getUnits";

type ReducerFunction = any;

export class CartManager<T extends CartState> extends StateManager<T> {
    constructor(
        initialState: T,
        dispatchFunction: Dispatch<any>,
        reducerFunction: ReducerFunction
    ) {
        super(initialState, dispatchFunction, reducerFunction);

        this.listen("products.[?]", (id) => {
            this.update(`products.${id}`, (product: ProductWithID) => {
                // console.log(product);
                let unit = product.units[product.unit];
                product.price = getProductUnitPrice(product);
                product.count = product.quantity * unit.value;
                product.subTotal =
                    (product.price - product.discount / unit.value) *
                        product.count -
                    product.extraDiscount;
                return product;
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
            let _product = { ...payload };
            _product.unit = payload.measurements[0].unit;
            _product.quantity = payload.measurements[0].value;
            this.set(`products.${_product._id}`, _product).set(
                "activeProduct",
                payload._id
            );
        }

        if (this.get("selectedProductIndex") > 0) {
            this.set("selectedProductIndex", 0);
        }

        return this;
    }

    // Remove to cart
    removeToCart(id: string | undefined = undefined): this {
        id = id ?? this.get("activeProduct"); // Use nullish coalescing for default assignment

        if (!id) {
            console.log("No active product found");
            return this;
        }

        const products = this.get("products");
        const productKeys = Object.keys(products);
        const currentIndex = productKeys.indexOf(id);

        if (currentIndex === -1) {
            console.log("Product ID not found in the cart");
            return this;
        }

        // Determine the next active product index
        const nextIndex = currentIndex === 0 ? 1 : currentIndex - 1;

        // Remove the product and set the new active product
        this.remove("products", id).set(
            "activeProduct",
            productKeys[nextIndex] ?? null
        );
        return this;
    }

    // Change active product
    changeActiveProduct(val: number) {
        const cartProductsKey = Object.keys(this.get("products"));
        const activeProduct = this.get("activeProduct");

        if (!activeProduct || cartProductsKey.length <= 1) return this;

        const currentIndex = cartProductsKey.indexOf(activeProduct);
        const newIndex =
            (currentIndex + val + cartProductsKey.length) %
            cartProductsKey.length;

        this.set("activeProduct", cartProductsKey[newIndex]);

        return this;
    }

    changeUnit(to: number) {
        const product = this.get(`products.{{activeProduct}}`);
        if (!product) return this;

        const filteredUnits = getUnits(product.units);
        const unitEntries = Object.entries(filteredUnits);

        const currentIndex = unitEntries.findIndex(
            ([key]) => key === product.unit
        );
        const newIndex =
            (currentIndex + to + unitEntries.length) % unitEntries.length;

        // eslint-disable-next-line no-unused-vars
        const [_, newUnit] = unitEntries[newIndex] || [];

        if (newUnit?.unit) {
            this.set(`products.${product._id}.unit`, newUnit.unit);
        }

        return this;
    }

    changeMeasurement(to: number) {
        let product = this.get("products.{{activeProduct}}");
        if (product) {
            const measurement = getMeasurementTo(product, to);
            this.update(
                `products.{{activeProduct}}`,
                (product: ProductWithID) => {
                    product.unit = measurement.unit;
                    product.quantity = measurement.value;
                    return product;
                }
            );
        }
        return this;
    }
}
