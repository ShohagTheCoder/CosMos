import CommandHandler from "./commandHandler";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import apiClient from "@/app/utils/apiClient";
import { StockManager } from "@/app/store/providers/managers/stockManager";
import { StockState } from "@/app/store/slices/stockSlice";

export default class PurchaseCommandHandler extends CommandHandler {
    constructor(
        stockManager: StockManager<StockState>,
        setCommand: any,
        // eslint-disable-next-line no-unused-vars
        getProductByCommand: (shortcut: string) => ProductWithID | undefined,
        handleUpdateProductPrice: any,
        handleCompletePurchase: any,
        setCommandCounter: any,
        handleProductUpdateShortcut: any
    ) {
        super(
            stockManager,
            setCommand,
            getProductByCommand,
            handleUpdateProductPrice,
            handleCompletePurchase,
            setCommandCounter,
            handleProductUpdateShortcut
        );

        // Call setup purchase commands
        this.setupPurchaseCommands();
    }

    setupPurchaseCommands() {
        this.listen(["Enter", "NumpadEnter"], () => {
            console.log("HEy");
            if (
                !this.params.isSuppliers &&
                this.value.length > 0 &&
                this.params.filteredSuppliers &&
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
                this.params.filteredSuppliers
            ) {
                if (Object.keys(this.params.filteredSuppliers).length > 0) {
                    this.handleAddSupplier();
                    this.setCommand("");
                }
                return;
            }
        });
    }

    async handleAddSupplier() {
        if (this.params.filteredSuppliers) {
            const supplier: any = Object.values(this.params.filteredSuppliers)[
                this.stateManager.get("selectedProductIndex")
            ];
            const { data } = await apiClient.get(
                `accounts/${supplier.account}`
            );
            this.stateManager.set("supplier", supplier).save();
        }
    }
}
