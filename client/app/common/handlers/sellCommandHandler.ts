import CommandHandler from "./commandHandler";
import { CartState } from "@/app/store/slices/cartSlice";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { CartManager } from "@/app/store/providers/managers/cartManager";

export default class SellCommandHandler extends CommandHandler {
    constructor(
        stateManager: CartManager<CartState>,
        setCommand: any,
        // eslint-disable-next-line no-unused-vars
        getProductByCommand: (shortcut: string) => ProductWithID | undefined,
        handleUpdateProductPrice: any,
        handleCompleteSell: any,
        setCommandCounter: any,
        handleProductUpdateShortcut: any
    ) {
        super(
            stateManager,
            setCommand,
            getProductByCommand,
            handleUpdateProductPrice,
            handleCompleteSell,
            setCommandCounter,
            handleProductUpdateShortcut
        );

        // Call setup sell commands
        this.setupSellCommands();
    }

    setupSellCommands() {
        this.listen(["Enter", "NumpadEnter"], () => {
            if (
                !this.params.isCustomers &&
                this.value.length > 1 &&
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
                            this.stateManager.get("selectedProductIndex")
                        ]!,
                        quantity: 1,
                    };
                    this.stateManager.addTo(product).save();
                    this.setCommand("");
                    return;
                }
            } else if (
                this.value.startsWith(" ") &&
                this.value.length > 1 &&
                this.params.filteredCustomers
            ) {
                if (Object.keys(this.params.filteredCustomers).length > 0) {
                    this.handleAddCustomer();
                    this.setCommand("");
                }
                return;
            }
        });
    }

    async handleAddCustomer() {
        if (this.params.filteredCustomers) {
            const customer: any = Object.values(this.params.filteredCustomers)[
                this.stateManager.get("selectedProductIndex")
            ];
            const { data } = await apiClient.get(
                `accounts/${customer.account}`
            );
            this.stateManager
                .set("customer", customer)
                .set("customerAccount", data)
                .save();
        }
    }
}
