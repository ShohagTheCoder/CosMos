import { CartManager } from "@/app/store/providers/managers/cartManager";
import KeyboardHandler from "./common/KeyboardHandler";
import { CartState } from "@/app/store/slices/cartSlice";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { KeyboardEvent } from "react";
import apiClient from "@/app/utils/apiClient";

// Define a child class for command-specific behavior
export default class CommandHandler extends KeyboardHandler {
    private cartManager: CartManager<CartState>;
    private setCommand: any;
    private handleUpdateProductPrice: any;
    private setCommandCounter: any;
    private handleCompleteSell: any;
    private setProductUpdateShortcut: any;
    private handleSellPageChange: any;
    private getProductByCommand: (
        // eslint-disable-next-line no-unused-vars
        shortcut: string
    ) => ProductWithID | undefined;

    constructor(
        cartManager: CartManager<CartState>,
        setCommand: any,
        // eslint-disable-next-line no-unused-vars
        getProductByCommand: (shortcut: string) => ProductWithID | undefined,
        handleUpdateProductPrice: any,
        handleCompleteSell: any,
        setCommandCounter: any,
        setProductUpdateShortcut: any,
        handleSellPageChange: any
    ) {
        super();
        this.cartManager = cartManager;
        this.setCommand = setCommand;
        this.handleCompleteSell = handleCompleteSell;
        this.setCommandCounter = setCommandCounter;
        this.handleUpdateProductPrice = handleUpdateProductPrice;
        this.getProductByCommand = getProductByCommand;
        this.setProductUpdateShortcut = setProductUpdateShortcut;
        this.handleSellPageChange = handleSellPageChange;
        // Call setup commands
        this.setupCommands();
    }

    public handleNumpadNumberKeyLongPress(e: KeyboardEvent) {
        if (this.value.length == 0) {
            this.cartManager
                .set("products.{{activeProduct}}.quantity", parseInt(e.key))
                .save();
            return;
        }

        if (/^[0-9]*00[0-9]*$/.test(this.value)) {
            let splited = this.value.split("00", 2);
            let commandKey = splited[0];
            let amount = parseInt(splited[1] + e.key);
            if (commandKey.length > 0) {
                let product = this.getProductByCommand(commandKey);
                if (product) {
                    this.cartManager
                        .addToCart(product)
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
            return;
        }

        if (/^[1-9]+$/.test(this.value)) {
            let product = this.getProductByCommand(this.value);
            if (product) {
                this.cartManager
                    .addToCart(product)
                    .set(`products.${product._id}.quantity`, parseInt(e.key))
                    .save();
            }
            return;
        }

        if (/^[0-9]+$/.test(this.value)) {
            let splited = this.value.split("0", 2);
            let commandKey = splited[0];
            let quantity = parseInt(splited[1] + e.key);
            let product = this.getProductByCommand(commandKey);
            if (commandKey.length == 0) {
                this.cartManager
                    .set(`products.{{activeProduct}}.quantity`, quantity)
                    .save();
            } else if (product) {
                this.cartManager
                    .addToCart(product)
                    .set(`products.${product._id}.quantity`, quantity)
                    .save();
            }
            return;
        }
    }

    // Add to cart by shortcut key
    public addToCartByShortcutKey(
        shortcutKey: string,
        quantity: number | undefined = undefined
    ) {
        if (shortcutKey.length == 0) return;
        const product = this.getProductByCommand(shortcutKey);
        if (product) {
            this.cartManager.addToCart(product);
            if (quantity) {
                this.cartManager.set(
                    `products.${product._id}.quantity`,
                    quantity
                );
            }
            this.cartManager.save();
        }
    }

    async handleAddCustomer() {
        if (this.params.filteredCustomers) {
            const customer: any = Object.values(this.params.filteredCustomers)[
                this.cartManager.get("selectedProductIndex")
            ];
            const { data } = await apiClient.get(
                `accounts/${customer.account}`
            );
            this.cartManager
                .set("customer", customer)
                .set("customerAccount", data)
                .save();
        }
    }

    private setupCommands() {
        this.setKeyUpCommonCallback(() => {
            if (this.params.commandCounter.value > 0) {
                this.setCommandCounter({
                    name: "unknown",
                    value: 0,
                });
            }
        });

        // Prevent default keys
        this.setPreventDefaultKeys([
            "NumpadAdd",
            "NumpadSubtract",
            "PageUp",
            "PageDown",
            "Minus",
            "Tab",
            "F5",
            "F6",
            "F7",
            "F8",
        ]);

        // Long presses listeners
        this.longPress(["ArrowUp", "NumpadAdd"], () => {
            this.cartManager.changeActiveProduct(-1).save();
        });
        this.longPress(["ArrowDown", "NumpadEnter"], () => {
            this.cartManager.changeActiveProduct(1).save();
        });
        this.longPress("NumpadSubtract", () => {
            this.setCommand("");
        });
        this.longPress("Delete", () => {
            this.cartManager.removeToCart(undefined).save();
        });
        this.longPress(
            [
                "Numpad0",
                "Numpad2",
                "Numpad3",
                "Numpad4",
                "Numpad5",
                "Numpad6",
                "Numpad7",
                "Numpad8",
                "Numpad9",
            ],
            (e) => {
                this.setCommand("");
                this.handleNumpadNumberKeyLongPress(e);
            }
        );

        this.longPress("ArrowLeft", () => {
            this.cartManager.changeUnit(-1).save();
        });

        this.longPress("ArrowRight", () => {
            this.cartManager.changeUnit(1).save();
        });

        // look

        this.longPress("PageUp", () => {
            this.handleUpdateProductPrice(10);
        });

        this.longPress("PageDown", () => {
            this.handleUpdateProductPrice(-10);
        });

        // Helper function to generate an array of KeyA-KeyZ
        const alphabetKeyCodes = Array.from(
            { length: 26 },
            (_, i) => `Key${String.fromCharCode(65 + i)}`
        );

        // Long presses listeners for KeyA-KeyZ
        this.longPress(alphabetKeyCodes, (e) => {
            this.addToCartByShortcutKey(e.key);
            // Replace with your desired action here
        });

        // Group press listeners
        this.group(["Numpad0", "Numpad1"], () => {
            this.setCommand("");
            if (this.params.commandCounter.name === "completeSell") {
                this.params.commandCounter.value += 1;
                if (this.params.commandCounter.value >= 3) {
                    this.setCommandCounter({ name: "unknown", value: 0 });
                    this.handleCompleteSell();
                }
            } else {
                this.setCommandCounter({ name: "completeSell", value: 1 });
            }
            return;
        });

        // Group press listeners
        this.group(["NumpadAdd", "NumpadEnter"], () => {
            this.cartManager.changeActiveProduct(1).save();
        });
        this.group(["Numpad2", "Numpad5"], () => {
            this.setCommand("");
            this.cartManager
                .increment("products.{{activeProduct}}.discount")
                .save();
        });
        this.group(["Numpad5", "Numpad8"], () => {
            this.cartManager
                .decrement("products.{{activeProduct}}.discount")
                .save();
            this.setCommand("");
        });

        this.group(["Numpad1", "Numpad4"], () => {
            this.setCommand("");
            this.cartManager
                .increment("products.{{activeProduct}}.extraDiscount")
                .save();
        });
        this.group(["PageUp", "PageDown"], () => {
            // this.setCommand("");
            // this.cartManager
            //     .update("products.{{activeProduct}}", (product: ProductWithID) => {

            //     })
            //     .save();
            this.handleUpdateProductPrice(
                -this.cartManager.get("products.{{activeProduct}}.updatePrice")
            );
        });

        this.group(["Numpad4", "Numpad7"], () => {
            this.cartManager
                .decrement("products.{{activeProduct}}.extraDiscount")
                .save();
        });

        // Regular listeners
        this.listen(["NumpadDivide", "NumpadMultiply"], () => {
            this.setCommand("");
        });

        // Regular listeners
        this.listen(["F5", "F6", "F7", "F8"], (e) => {
            this.setCommand("");
            this.handleSellPageChange(e.key);
        });

        // Regular listeners
        this.listen("Minus", () => {
            this.setCommand("");
        });

        // Define specific key combinations or long press commands here
        this.listen("NumpadDecimal", () => {
            if (this.value == "..") {
                this.setCommand("");
            }
        });

        this.listen("PageUp", () => {
            this.handleUpdateProductPrice(1);
        });

        this.listen("PageDown", () => {
            this.handleUpdateProductPrice(-1);
        });

        this.listen("Numpad0", () => {
            if (this.value == ".") {
                this.setCommand("");
                this.cartManager.set("paid", 0).save();
            }
        });

        this.listen("NumpadAdd", () => {
            if (/^[1-9][0-9]*$/.test(this.value)) {
                this.setCommand("");
                this.cartManager
                    .set(
                        "products.{{activeProduct}}.quantity",
                        parseInt(this.value)
                    )
                    .save();
            }
        });

        this.listen("NumpadSubtract", () => {
            this.setCommand(this.value.slice(0, -1));
        });

        this.listen("ArrowLeft", () => {
            const max = this.params.isCustomers
                ? Object.keys(this.params.filteredCustomers).length - 1
                : Object.keys(this.params.filteredProducts).length - 1;
            if (this.value.length > 0) {
                let currentIndex = this.cartManager.get("selectedProductIndex");
                let newIndex = currentIndex;
                if (currentIndex == 0) {
                    newIndex = max;
                } else {
                    newIndex = currentIndex - 1;
                }
                this.cartManager.set("selectedProductIndex", newIndex).save();
            } else {
                this.cartManager.changeMeasurement(-1).save();
            }
        });

        this.listen("ArrowRight", () => {
            const max = this.params.isCustomers
                ? Object.keys(this.params.filteredCustomers).length - 1
                : Object.keys(this.params.filteredProducts).length - 1;
            if (this.value.length > 0) {
                let currentIndex = this.cartManager.get("selectedProductIndex");
                let newIndex = currentIndex;
                if (currentIndex == max) {
                    newIndex = 0;
                } else {
                    newIndex = currentIndex + 1;
                }
                this.cartManager.set("selectedProductIndex", newIndex).save();
            } else {
                this.cartManager.changeMeasurement(1).save();
            }
        });

        this.listen("NumpadSubtract", () => {
            this.setCommand(this.value.slice(0, -1));
        });

        // ArrowUp and NumpadAdd
        this.listen(["ArrowUp", "NumpadAdd"], () => {
            if (this.value.length == 0) {
                this.cartManager
                    .increment("products.{{activeProduct}}.quantity")
                    .save();
            }

            if (/^\*\d*$/.test(this.value)) {
                this.cartManager
                    .increment("products.{{activeProduct}}.discount")
                    .save();
            }

            if (/^\/\d*$/.test(this.value)) {
                this.cartManager
                    .increment("products.{{activeProduct}}.extraDiscount")
                    .save();
            }

            this.setCommand("");
        });

        // ArrowDown and NumpadEnter
        this.listen(["ArrowDown", "NumpadEnter"], () => {
            if (this.value.length == 0) {
                this.cartManager
                    .decrement("products.{{activeProduct}}.quantity")
                    .save();
            }

            if (/^\*\d*$/.test(this.value)) {
                this.cartManager
                    .decrement("products.{{activeProduct}}.discount")
                    .save();
            }

            if (/^\/\d*$/.test(this.value)) {
                this.cartManager
                    .decrement("products.{{activeProduct}}.extraDiscount")
                    .save();
            }
            this.setCommand("");
        });

        // Enter and NumpadEnter
        this.listen(["NumpadEnter", "Enter"], (e) => {
            if (/^[0-9]*00[0-9]*$/.test(this.value)) {
                let splited = this.value.split("00", 2);
                let commandKey = splited[0];
                let amount = parseInt(splited[1]);
                if (commandKey.length > 0) {
                    let product = this.getProductByCommand(commandKey);
                    if (product) {
                        this.cartManager
                            .addToCart(product)
                            .update(
                                `products.{{activeProduct}}.discount`,
                                () => {
                                    if (amount < product.price / 2) {
                                        console.log("amount is price");
                                        return amount;
                                    } else {
                                        console.log("price - amount");
                                        return product.price - amount;
                                    }
                                }
                            )
                            .save();
                    }
                }
                return;
            }

            if (/^[1-9]+$/.test(this.value)) {
                this.addToCartByShortcutKey(this.value, parseInt(e.key));
                return;
            }

            if (/^[1-9][0-9]*$/.test(this.value)) {
                let splited = this.value.split("0", 2);
                let commandKey = splited[0];
                let quantity = parseInt(splited[1]);
                this.addToCartByShortcutKey(commandKey, quantity);
                return;
            }

            if (/^[a-zA-Z]$/.test(this.value)) {
                this.addToCartByShortcutKey(this.value);
                return;
            }

            this.setCommand("");

            if (
                !this.params.isCustomers &&
                this.value.length > 0 &&
                this.params.filteredCustomers &&
                this.params.filteredProducts
            ) {
                if (
                    Object.keys(this.params.filteredProducts).length > 0 &&
                    /^[a-zA-Z]+/.test(this.value)
                ) {
                    const filteredProducts: Record<string, ProductWithID> =
                        this.params.filteredProducts;
                    const product = {
                        ...Object.values(filteredProducts)[
                            this.cartManager.get("selectedProductIndex")
                        ]!,
                        quantity: 1,
                    };
                    this.cartManager.addToCart(product).save();
                    this.setCommand("");
                    return;
                }
            } else if (this.value.length > 1 && this.params.filteredCustomers) {
                if (Object.keys(this.params.filteredCustomers).length > 0) {
                    this.handleAddCustomer();
                    this.setCommand("");
                }
                return;
            }

            if (/^\.[1-9]*[0-9]*$/.test(this.value)) {
                this.setCommand("");

                if (this.value == ".") {
                    this.cartManager
                        .set("paid", this.cartManager.get("totalPrice"))
                        .save();
                    return;
                }

                if (this.value.length > 1) {
                    let amount = parseInt(this.value.slice(1));
                    if (amount) {
                        this.cartManager.set("paid", amount).save();
                    }
                    return;
                }
            }

            // To add extra discount amount dynamically with one . at the start
            if (/^\/[1-9][0-9]*$/.test(this.value)) {
                let amount = parseInt(this.value.slice(1));
                this.setCommand("");
                // dispatch(addExtraDiscount({ key: undefined, amount }));
                this.cartManager
                    .set("products.{{activeProduct}}.extraDiscount", amount)
                    .save();
                return;
            }

            // To add discount amount dynamically with two .. at the start
            if (/^\*[1-9][0-9]*$/.test(this.value)) {
                let amount = parseInt(this.value.slice(1));
                this.setCommand("");
                // dispatch(addDiscount({ key: undefined, amount }));
                this.cartManager
                    .set("products.{{activeProduct}}.discount", amount)
                    .save();
                return;
            }
        });

        this.listen("ControlRight", () => {
            this.setProductUpdateShortcut(true);
        });
    }
}
