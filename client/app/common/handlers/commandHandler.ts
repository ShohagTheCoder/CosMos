import KeyboardHandler from "./common/KeyboardHandler";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { KeyboardEvent } from "react";
import splitIntoParts from "@/app/functions/splitIntoParts";
import { capitalize } from "lodash";

// Define a child class for command-specific behavior
export default class CommandHandler extends KeyboardHandler {
    public stateManager: any;
    public setCommand: any;
    public handleUpdateProductPrice: any;
    public setCommandCounter: any;
    public handleCompleteSell: any;
    public handleProductUpdateShortcut: any;
    public getProductByCommand: (
        // eslint-disable-next-line no-unused-vars
        shortcut: string
    ) => ProductWithID | undefined;

    constructor(
        stateManager: any,
        setCommand: any,
        // eslint-disable-next-line no-unused-vars
        getProductByCommand: (shortcut: string) => ProductWithID | undefined,
        handleUpdateProductPrice: any,
        handleCompleteSell: any,
        setCommandCounter: any,
        handleProductUpdateShortcut: any
    ) {
        super();
        this.stateManager = stateManager;
        this.setCommand = setCommand;
        this.handleCompleteSell = handleCompleteSell;
        this.setCommandCounter = setCommandCounter;
        this.handleUpdateProductPrice = handleUpdateProductPrice;
        this.getProductByCommand = getProductByCommand;
        this.handleProductUpdateShortcut = handleProductUpdateShortcut;
        // Call setup commands
        this.setupCommands();
    }

    public handleNumpadNumberKeyLongPress(e: KeyboardEvent) {
        if (this.value.length == 0) {
            if (this.stateManager.get("products.{{activeProduct}}")) {
                this.stateManager
                    .set("products.{{activeProduct}}.quantity", parseInt(e.key))
                    .save();
                return;
            }
        }

        if (/^[0-9]*00[1-9][0-9]*$/.test(this.value)) {
            let splited = splitIntoParts(this.value, "00", 2);
            let commandKey = splited[0];
            let amount = parseInt(splited[1] + e.key);
            if (commandKey.length > 0) {
                let product = this.getProductByCommand(commandKey);
                if (product) {
                    this.stateManager.addTo(product);
                }
            }

            // Get the product
            let product = this.stateManager.get("products.{{activeProduct}}");

            if (product !== undefined) {
                this.stateManager.update(
                    `products.{{activeProduct}}.discount`,
                    () => {
                        if (amount < product.price / 2) {
                            return amount;
                        } else {
                            return product.price - amount;
                        }
                    }
                );
            }
            this.stateManager.save();
            return;
        }

        if (/^[1-9]+$/.test(this.value)) {
            this.addToByShortcutKey(this.value, parseInt(e.key));
            return;
        }

        if (/^[0-9]+$/.test(this.value)) {
            let splited = splitIntoParts(this.value, "0", 2);
            // let splited = this.value.split("0", 2);
            let commandKey = splited[0];
            let quantity = parseInt(splited[1] + e.key);
            let product = this.getProductByCommand(commandKey);
            if (commandKey.length == 0) {
                if (this.stateManager.get("products.{{activeProduct}}")) {
                    this.stateManager
                        .set(`products.{{activeProduct}}.quantity`, quantity)
                        .save();
                }
            } else if (product) {
                this.stateManager
                    .addTo(product)
                    .set(`products.${product._id}.quantity`, quantity)
                    .save();
            }
            return;
        }
    }

    // Add to cart by shortcut key
    public addToByShortcutKey(
        shortcutKey: string,
        quantity: number | undefined = undefined
    ) {
        if (shortcutKey.length == 0) return;
        const product = this.getProductByCommand(shortcutKey);
        if (product) {
            this.stateManager.addTo(product);
            if (quantity) {
                this.stateManager.set(
                    `products.${product._id}.quantity`,
                    quantity
                );
            }
            this.stateManager.save();
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
            "Tab",
            "F2",
            "F3",
            "F4",
            "F5",
            "F6",
            "F7",
            "F8",
            "F9",
            "F10",
            "F11",
        ]);

        // Long presses listeners
        this.longPress(["ArrowUp", "NumpadAdd"], () => {
            this.stateManager.changeActiveProduct(-1).save();
        });
        this.longPress(["ArrowDown", "NumpadEnter"], () => {
            this.stateManager.changeActiveProduct(1).save();
        });
        this.longPress("NumpadSubtract", () => {
            this.setCommand("");
        });
        this.longPress("Delete", () => {
            this.stateManager.removeTo(undefined).save();
        });
        this.longPress(
            [
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
            ],
            (e) => {
                this.setCommand("");
                this.handleNumpadNumberKeyLongPress(e);
            }
        );

        this.longPress("ArrowLeft", () => {
            this.stateManager.changeUnit(-1).save();
        });

        this.longPress("ArrowRight", () => {
            this.stateManager.changeUnit(1).save();
        });

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
            this.addToByShortcutKey(e.key);
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
            this.stateManager.changeActiveProduct(1).save();
        });

        // Group press listeners
        this.group(["Delete", "Insert"], () => {
            this.stateManager
                .set("customer", undefined)
                .set("greeting", undefined)
                .save();
        });

        this.group(["Numpad2", "Numpad5"], () => {
            this.setCommand("");
            this.stateManager
                .increment("products.{{activeProduct}}.discount")
                .save();
        });
        this.group(["Numpad5", "Numpad8"], () => {
            this.stateManager
                .decrement("products.{{activeProduct}}.discount")
                .save();
            this.setCommand("");
        });

        this.group(["Numpad1", "Numpad4"], () => {
            this.setCommand("");
            this.stateManager
                .increment("products.{{activeProduct}}.extraDiscount")
                .save();
        });
        this.group(["PageUp", "PageDown"], () => {
            this.handleUpdateProductPrice(
                -this.stateManager.get("products.{{activeProduct}}.updatePrice")
            );
        });

        this.group(["Numpad4", "Numpad7"], () => {
            this.setCommand("");
            this.stateManager
                .decrement("products.{{activeProduct}}.extraDiscount")
                .save();
        });

        // Regular listeners
        this.listenKeyDown(["NumpadDivide", "NumpadMultiply"], () => {
            this.setCommand("");
        });

        // Regular listeners
        this.listen(["F5", "F6", "F7", "F8"], (e) => {
            this.setCommand("");
            this.params.handlePageChange(e.key);
        });

        // Regular listeners
        this.listen(["ControlRight"], (e) => {
            e.preventDefault();
            this.stateManager
                .update("cartOnly", (state: boolean) => !state)
                .save();
        });

        // Define specific key combinations or long press commands here
        this.listen("NumpadDecimal", () => {
            if (/^[1-9][0-9]*$/.test(this.value)) {
                this.setCommand("");
                let product = this.stateManager.get(
                    "products.{{activeProduct}}"
                );

                if (product) {
                    let amount = parseInt(this.value);
                    this.stateManager
                        .update("products.{{activeProduct}}.discount", () => {
                            if (amount < product.price / 2) {
                                return amount;
                            } else {
                                return product.price - amount;
                            }
                        })
                        .save();
                }
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
                this.stateManager.set("paid", 0).save();
            }
        });

        this.listen("NumpadAdd", () => {
            // Set active product quantity
            if (/^[0-9]+$/.test(this.value)) {
                if (this.stateManager.get("products.{{activeProduct}}")) {
                    this.setCommand("");
                    this.stateManager
                        .set(
                            "products.{{activeProduct}}.quantity",
                            parseInt(this.value)
                        )
                        .save();
                }
            }
        });

        this.listen("NumpadSubtract", () => {
            this.setCommand(this.value.slice(0, -1));
        });

        this.listen("ArrowLeft", () => {
            const { isCustomers, filteredCustomers, filteredProducts } =
                this.params;
            const max =
                Object.keys(isCustomers ? filteredCustomers : filteredProducts)
                    .length - 1;

            // Handle case where input has a value
            if (this.value.length > 0) {
                let currentIndex =
                    this.stateManager.get("selectedProductIndex") ?? 0;

                // Calculate the new index
                const newIndex = currentIndex === 0 ? max : currentIndex - 1;

                // Set and save the new index
                this.stateManager.set("selectedProductIndex", newIndex).save();
                return;
            }

            // Change measurement if input is empty
            this.stateManager.changeMeasurement(-1).save();
        });

        this.listen("ArrowRight", () => {
            const { isCustomers, filteredCustomers, filteredProducts } =
                this.params;
            const max =
                Object.keys(isCustomers ? filteredCustomers : filteredProducts)
                    .length - 1;

            // Handle case where input has a value
            if (this.value.length > 0) {
                let currentIndex =
                    this.stateManager.get("selectedProductIndex") ?? 0;

                // Calculate the new index
                const newIndex = currentIndex === max ? 0 : currentIndex + 1;

                // Set and save the new index
                this.stateManager.set("selectedProductIndex", newIndex).save();
                return;
            }

            // Change measurement if input is empty
            this.stateManager.changeMeasurement(1).save();
        });

        this.listen("NumpadSubtract", () => {
            this.setCommand(this.value.slice(0, -1));
        });

        // ArrowUp and NumpadAdd
        this.listen(["ArrowUp", "NumpadAdd"], () => {
            if (this.value.length == 0) {
                this.stateManager
                    .increment("products.{{activeProduct}}.quantity")
                    .save();
                this.setCommand("");
            }

            if (/^\*\d*$/.test(this.value)) {
                this.stateManager
                    .increment("products.{{activeProduct}}.discount")
                    .save();
            }

            if (/^\/\d*$/.test(this.value)) {
                this.stateManager
                    .increment("products.{{activeProduct}}.extraDiscount")
                    .save();
            }
        });

        // ArrowDown and NumpadEnter
        this.listen(["ArrowDown", "NumpadEnter"], () => {
            if (this.value.length == 0) {
                this.stateManager
                    .decrement("products.{{activeProduct}}.quantity")
                    .save();
                this.setCommand("");
            }

            if (/^\*\d*$/.test(this.value)) {
                this.stateManager
                    .decrement("products.{{activeProduct}}.discount")
                    .save();
            }

            if (/^\/\d*$/.test(this.value)) {
                this.stateManager
                    .decrement("products.{{activeProduct}}.extraDiscount")
                    .save();
            }
        });

        this.listen(["NumpadEnter", "Enter"], (e) => {
            if (/^\d*00[1-9]\d*[^0]\d*$/.test(this.value)) {
                let splited = splitIntoParts(this.value, "00", 2);
                let commandKey = splited[0];
                let amount = parseInt(splited[1]);
                if (commandKey.length > 0) {
                    let product = this.getProductByCommand(commandKey);
                    if (product) {
                        this.stateManager.addTo(product);
                    }
                }

                // Get the product
                let product = this.stateManager.get(
                    "products.{{activeProduct}}"
                );

                if (product !== undefined) {
                    this.stateManager.update(
                        "products.{{activeProduct}}.discount",
                        () => {
                            if (amount < product.price / 2) {
                                return amount;
                            } else {
                                return product.price - amount;
                            }
                        }
                    );
                }

                this.stateManager.save();
                this.setCommand("");
                return;
            }

            // To set active product quantity
            if (/^0[1-9][0-9]*$/.test(this.value)) {
                this.setCommand("");
                this.stateManager
                    .set(
                        "products.{{activeProduct}}.quantity",
                        parseInt(this.value)
                    )
                    .save();
            }

            // Add to cart with default quantity
            if (/^[1-9]+$/.test(this.value)) {
                this.addToByShortcutKey(this.value, parseInt(e.key));
                this.setCommand("");
                return;
            }

            if (/^[1-9][0-9]*$/.test(this.value)) {
                const splited = splitIntoParts(this.value, "0", 2);
                const commandKey = splited[0];
                const quantity = parseInt(splited[1]);
                this.setCommand("");
                this.addToByShortcutKey(commandKey, quantity);
                return;
            }

            if (/^[a-zA-Z]$/.test(this.value)) {
                this.setCommand("");
                this.addToByShortcutKey(this.value);
                return;
            }

            if (/^\.[1-9]*[0-9]*$/.test(this.value)) {
                this.setCommand("");
                if (this.value == ".") {
                    this.stateManager
                        .set("paid", this.stateManager.get("totalPrice"))
                        .save();
                    return;
                }

                if (this.value.length > 1) {
                    let amount = parseInt(this.value.slice(1));
                    if (amount) {
                        this.stateManager.set("paid", amount).save();
                    }
                    return;
                }
            }

            // To add extra discount amount dynamically with one . at the start
            if (/^\/[1-9][0-9]*$/.test(this.value)) {
                let amount = parseInt(this.value.slice(1));
                this.setCommand("");
                if (this.stateManager.get("activeProduct") !== undefined) {
                    this.stateManager
                        .set("products.{{activeProduct}}.extraDiscount", amount)
                        .save();
                }
                return;
            }

            // To add discount amount dynamically with two .. at the start
            if (/^\*[1-9][0-9]*$/.test(this.value)) {
                let amount = parseInt(this.value.slice(1));
                this.setCommand("");
                if (this.stateManager.get("activeProduct") !== undefined) {
                    this.stateManager
                        .set("products.{{activeProduct}}.discount", amount)
                        .save();
                }
                return;
            }

            if (/^[.\u0964][^\d]*[\p{L}]+/u.test(this.value)) {
                if (this.stateManager.get("activeProduct")) {
                    this.stateManager
                        .set(
                            "products.{{activeProduct}}.note",
                            capitalize(this.value.slice(1).trim())
                        )
                        .save();
                }
                this.setCommand("");
                return;
            }

            if (/^,[^\d]*[\p{L}]+/u.test(this.value)) {
                this.stateManager
                    .set("greeting", capitalize(this.value.slice(1).trim()))
                    .save();

                this.setCommand("");
                return;
            }
        });
    }
}
