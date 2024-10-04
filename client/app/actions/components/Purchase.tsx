"use client";
import Sidebar from "@/app/components/Sidebar";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { initialStockState } from "@/app/store/slices/stockSlice";
import { RootState } from "@/app/store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import Notification from "@/app/elements/notification/Notification";
import { logout } from "../functions/authHandlers";
import ProductsCard from "./ProductsCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";
import { updateHelperField } from "@/app/store/slices/helperSlice";
import { productArrayToObject } from "../functions/productArrayToObject";
import useNotification from "@/app/hooks/useNotification";
// import { useHandleKeyUp } from "../purchase/functions/keyboardHandler";
import ProductsRow from "./ProductsRow";
import ColsIcon from "@/app/icons/ColsIcon";
import RowIcon from "@/app/icons/RowIcon";
import NotImageIcon from "@/app/icons/NotImageIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import { setProduct } from "@/app/store/slices/productSlice";
import apiCall from "@/app/common/apiCall";
import useStockManager from "@/app/store/providers/stockProvider";
import Notifications from "@/app/elements/notification/Notifications";
// eslint-disable-next-line no-unused-vars
import { cloneDeep } from "lodash";
import { Supplier, SupplierWithId } from "@/app/interfaces/supplier.interface";
import PurchaseDetails from "./components/purchaseDetails";
import SupplierDetails from "./components/SupplierDetails";
import { StockState } from "@/app/store/slices/stockSlice";
import PurchasePageSelector from "./components/PurchasePageSelector";
import PurchaseCommandHandler from "@/app/common/handlers/purchaseCommandHandler";
import StockProduct from "./components/StockProduct";
import SupplierCard from "./components/SupplierCart";
import FinalView from "../sell/components/FinalView";
import ProductUpdateShortcut from "../sell/components/ProductUpdateShortcut";
import apiClient from "@/app/utils/apiClient";

interface PurchaseProps {
    productsArray: ProductWithID[];
    suppliersArray: SupplierWithId[];
    user: any;
    commands: any[];
    setting: any;
}

export default function Purchase({
    productsArray,
    suppliersArray,
    user,
    commands,
    setting,
}: PurchaseProps) {
    const [products, setProducts] = useState(
        productArrayToObject(productsArray, (item) => !item.purchaseEnable)
    );

    const suppliers = useMemo(
        () => arrayToObjectById(suppliersArray),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [productsArray]
    );

    let [command, setCommand] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
    const dispatch = useDispatch();
    let stock = useSelector((state: RootState) => state.stock);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isSuppliers, setIsSuppliers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    const helper = useSelector((state: RootState) => state.helper);
    const activePage = useRef("F5");
    const [productUpdateShortcut, setProductUpdateShortcut] = useState(false);
    const { notification, notifySuccess, notifyError } = useNotification();
    const [settingState, setSettingState] = useState(setting);
    // eslint-disable-next-line no-unused-vars
    // const notifications = useSelector(
    //     (state: RootState) => state.notifications
    // );

    const stockManager = useStockManager();

    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const [purchaseButtonLoading, setPurchaseButtonLoading] = useState(false);

    const commandHandler = useRef(
        new PurchaseCommandHandler(
            stockManager,
            setCommand,
            getProductByCommand,
            handleUpdateProductPrice,
            handleCompletePurchase,
            setCommandCounter,
            handleProductUpdateShortcut,
            handlePageChange
        )
    ).current;

    // Single use effect
    useEffect(() => {
        if (user) {
            stockManager.set("user", user).save();
            // dispatch(setUser(user));
        }

        window.addEventListener("keydown", (e: any) => {
            // Return if already focused on another input or textare
            if (["TEXTAREA", "INPUT"].includes(e.target.tagName)) {
                return;
            }

            const usedKeys = [
                "F5",
                "F6",
                "F7",
                "F8",
                "F9",
                "PageUp",
                "PageDown",
                "Tab",
            ];
            if (usedKeys.includes(e.key)) {
                e.preventDefault(); // Prevent tab default behavior
            }
            let command = document.getElementById("command");
            command?.focus(); // Focus the command input element
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            commandHandler.destroy();
            window.removeEventListener("keydown", () => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        commandHandler.params = {
            filteredSuppliers,
            filteredProducts,
            isSuppliers,
            commandCounter,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredSuppliers, filteredProducts, isSuppliers, commandCounter]);

    useEffect(() => {
        // Match barcode or SKU to add product
        if (/^[0-9]+$/.test(command)) {
            let product = productsArray.find(
                (product) => product.SKU.toString() == command
            );

            if (product) {
                stockManager.addTo(product).save();
                setCommand("");
                return;
            }
        }

        if (/^\s+/.test(command) && suppliers) {
            setIsSuppliers(true);
            // Convert filtered array back to object
            const filteredSuppliersObject = Object.entries(suppliers).reduce<
                Record<string, SupplierWithId>
            >((acc, [key, supplier]) => {
                if (
                    supplier.name
                        .toLowerCase()
                        .includes(command.trim().toLowerCase())
                ) {
                    acc[key] = supplier;
                }
                return acc;
            }, {});

            setFilteredSuppliers(filteredSuppliersObject);
        } else if (/^(?![0-9\s.])[a-zA-Z]{2,10}/.test(command) && products) {
            if (isSuppliers) {
                setIsSuppliers(false);
            }

            let filteredProductsObject = Object.entries(products).reduce<
                Record<string, ProductWithID>
            >((acc, [key, value]) => {
                if (value.name.toLowerCase().includes(command.toLowerCase())) {
                    acc[key] = value;
                } else if (
                    value.keywords.some((keyword) =>
                        keyword.toLowerCase().includes(command.toLowerCase())
                    )
                ) {
                    acc[key] = value;
                } else if (
                    value.brand?.name
                        .toLowerCase()
                        .includes(command.toLowerCase())
                ) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            setFilteredProducts(filteredProductsObject);
        } else if (command.length == 0) {
            if (isSuppliers) {
                setIsSuppliers(false);
            }
            setFilteredProducts(products);
        } else if (command == " ") {
            if (!isSuppliers) {
                setIsSuppliers(true);
            }
            setFilteredSuppliers(suppliers);
        }

        // Reset selected product index
        if (stock.selectedProductIndex > 0) {
            stockManager.set("selectedProductIndex", 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command, products]);

    async function handleCompletePurchase() {
        setPurchaseButtonLoading(true);
        apiCall
            .post("/purchases", stockManager.getData())
            .success(async (data, message) => {
                notifySuccess(message);
                try {
                    let { data: _productsArray } = await apiClient.get(
                        "products/for-purchase"
                    );
                    setProducts(
                        productArrayToObject(
                            _productsArray,
                            (item) => !item.purchaseEnable
                        )
                    );
                } catch (error) {
                    console.log(error);
                }
            })
            .error((error) => {
                console.log(error);
                notifyError(error);
            })
            .finally(() => {
                setTimeout(async () => {
                    stockManager.reset(initialStockState).save();
                }, 3000);
            });
    }

    function updateSetting(payload: any) {
        apiCall
            .patch(`/settings/${setting._id}`, payload)
            .success(() => {
                setSettingState((state: any) => ({ ...state, ...payload }));
            })
            .error((error) => console.log(error));
    }

    function handleProductUpdateShortcut(
        productId: string | undefined = undefined
    ) {
        let product: ProductWithID | undefined;
        if (productId) {
            product = products[productId];
        } else {
            if (command.length >= 2) {
                product =
                    Object.values(filteredProducts)[stock.selectedProductIndex];
            } else if (stockManager.get("activeProduct")) {
                product = products[stockManager.get("activeProduct")];
            }
        }

        if (product) {
            dispatch(setProduct(product));
            setProductUpdateShortcut(true);
        }
    }

    // Add to stock with product shortcut
    function getProductByCommand(shortcut: string) {
        let command = commands.find(
            (_: any) => _.command.toLowerCase() == shortcut
        );
        if (command && command.value != null) {
            let product = products[command.value];
            setCommand("");
            return product;
        }
        return;
    }

    function handleUpdateProductPrice(amount: number) {
        const activeProductId = stockManager.get("activeProduct");

        if (activeProductId) {
            // Retrieve the active product from stockManager
            const product = stockManager.get(`products.${activeProductId}`);

            // Update the product price locally in stockManager
            stockManager.update(
                `products.${activeProductId}.updatePrice`,
                (updatePrice) => (updatePrice ?? 0) + amount // Ensure `updatePrice` is a number
            );

            // Call the API to update the purchase price
            apiCall
                .patch(`/products/updatePurchasePrice/${product._id}`, {
                    amount,
                })
                .success((data) => {
                    // Update the prices in stockManager
                    console.log(data);
                    stockManager
                        .set(`products.${product._id}.prices`, data.prices)
                        .save();

                    // Update the prices in the React state immutably
                    setProducts((state: Record<string, ProductWithID>) => {
                        return {
                            ...state,
                            [product._id]: {
                                ...state[product._id],
                                prices: data.prices,
                            },
                        };
                    });
                })
                .error((error) => console.error(error));
        }
    }

    async function handleProductUpdate(product: ProductWithID) {
        setProductUpdateShortcut(false);

        // Create an `update` object for the changed fields
        const update: Partial<ProductWithID> = {};

        // Track changes in properties (assuming `product` is the updated version)
        for (const key in product) {
            if (
                product.hasOwnProperty(key) &&
                key !== "_id" &&
                key !== "product" // Exclude keys we don't want to update
            ) {
                update[key] = product[key];
            }
        }

        // Handle `prices` and `measurements` transformation if they exist in `product`
        if (product.prices) {
            update.purchasePrices = [...product.prices];
        }
        if (product.measurements) {
            update.purchaseMeasurements = [...product.measurements];
        }

        try {
            // Send the update to the API
            await apiClient.patch(`products/${product._id}`, update);

            // Update the local state with the patched values
            setProducts((state: Record<string, ProductWithID>) => {
                const updatedProduct = {
                    ...state[product._id],
                    ...update,
                };
                return { ...state, [product._id]: updatedProduct };
            });

            // Update the product in the stock manager with the latest values
            if (update.purchasePrices) {
                stockManager.set(
                    `products.${product._id}.prices`,
                    update.purchasePrices
                );
            }

            if (update.purchaseMeasurements) {
                stockManager.set(
                    `products.${product._id}.measurements`,
                    update.purchaseMeasurements
                );
            }
            stockManager.save();
        } catch (error) {
            console.error("Failed to update product:", error);
        }
        setProductUpdateShortcut(false); // Handle error state
    }

    function handlePageChange(pageKey: string) {
        if (pageKey === activePage.current) return;
        // Deep copy stock states if necessary
        let stockStates: Record<string, StockState> = cloneDeep(
            helper.stockStates
        );
        // Ensure stock is defined before assignment
        stockStates[activePage.current] = stock;
        // Update the active purchase page first
        activePage.current = pageKey;
        // Dispatch Redux state update
        dispatch(
            updateHelperField({ field: "stockStates", value: stockStates })
        );
        // Use the stock manager to reset and save the new state
        const newState = stockStates[pageKey] || initialStockState;
        // Use the stock manager to reset and save the new state
        stockManager.reset(newState).save();
    }

    return (
        <div className="text-black dark:text-white">
            {/* <PurchaseReceipt /> */}
            <div className="print:hidden">
                <Sidebar active="purchase" userId={user._id} />
                <div className="ps-[94px] 2xl:ps-[150px] bg-white dark:bg-gray-950">
                    <div className="grid grid-cols-1 2xl:grid-cols-9">
                        <div className="col-span-8 me-3 lg:pe-3">
                            <Notifications />
                            <Notification
                                type={notification.type}
                                message={notification.message}
                                className="justify-center"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 lg:h-screen gap-6 overflow-x-hidden overflow-y-auto lg:overflow-y-hidden cosmos-scrollbar">
                        <div className="max-h=[1000px] h-full flex flex-col overflow-hidden col-span-8 lg:col-span-5 py-4 me-3 lg:me-0">
                            <PurchasePageSelector
                                activePage={activePage.current}
                                stockStates={helper.stockStates}
                                userName={user.name}
                                handlePageChange={handlePageChange}
                                logout={logout}
                            />
                            <div>
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => {
                                        setCommand(e.target.value);
                                    }}
                                    onKeyDown={(e) =>
                                        commandHandler.handleKeyDown(e)
                                    }
                                    onKeyUp={(e) =>
                                        commandHandler.handleKeyUp(e)
                                    }
                                    type="text"
                                    className="border-2 w-full md:w-1/2 xl:w-1/3 border-dashed border-slate-500 bg-transparent outline-none focus:border-green-500 px-4 py-2 text-lg"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 py-2 px-3 my-3 bg-gray-300  dark:bg-gray-800">
                                <button
                                    onClick={() => {
                                        updateSetting({
                                            productImage:
                                                !settingState.productImage,
                                        });
                                    }}
                                >
                                    {settingState.productImage ? (
                                        <NotImageIcon />
                                    ) : (
                                        <ImageIcon height="20" />
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        updateSetting({
                                            productRow:
                                                !settingState.productRow,
                                        });
                                    }}
                                >
                                    {settingState.productRow ? (
                                        <ColsIcon height="20" />
                                    ) : (
                                        <RowIcon height="18" />
                                    )}
                                </button>
                            </div>
                            <div className="overflow-x-hidden overflow-y-auto pb-4 pe-3 cosmos-scrollbar">
                                {productUpdateShortcut ? (
                                    <ProductUpdateShortcut
                                        handleClose={() =>
                                            setProductUpdateShortcut(false)
                                        }
                                        callback={handleProductUpdate}
                                    />
                                ) : (
                                    <>
                                        {commandCounter.name ==
                                            "completePurchase" &&
                                        commandCounter.value >= 1 ? (
                                            <FinalView />
                                        ) : isSuppliers ? (
                                            <div>
                                                <SupplierCard
                                                    suppliers={
                                                        filteredSuppliers
                                                    }
                                                    callback={(
                                                        supplier: Supplier
                                                    ) => {
                                                        stockManager
                                                            .set(
                                                                "supplier",
                                                                supplier
                                                            )
                                                            .save();
                                                        setCommand("");
                                                        document
                                                            .getElementById(
                                                                "command"
                                                            )
                                                            ?.focus();
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                {settingState.productRow ? (
                                                    <ProductsRow
                                                        selected={
                                                            stock.selectedProductIndex
                                                        }
                                                        callback={(product) => {
                                                            stockManager
                                                                .addTo(product)
                                                                .save();
                                                            setCommand("");
                                                            document
                                                                .getElementById(
                                                                    "command"
                                                                )
                                                                ?.focus();
                                                        }}
                                                        products={
                                                            filteredProducts
                                                        }
                                                        showProductImage={
                                                            settingState.productImage
                                                        }
                                                    />
                                                ) : (
                                                    <ProductsCard
                                                        setProductUpdateShortcut={
                                                            handleProductUpdateShortcut
                                                        }
                                                        selected={
                                                            stock.selectedProductIndex
                                                        }
                                                        callback={(product) => {
                                                            stockManager
                                                                .addTo(product)
                                                                .save();
                                                            setCommand("");
                                                            document
                                                                .getElementById(
                                                                    "command"
                                                                )
                                                                ?.focus();
                                                        }}
                                                        products={
                                                            filteredProducts
                                                        }
                                                        showProductImage={
                                                            settingState.productImage
                                                        }
                                                    />
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="py-4 mb-4 lg:pe-3 col-span-8 lg:col-span-3 min-h-screen overflow-hidden grid grid-rows-1">
                            <div className="pe-3 h-auto overflow-y-auto overflow-x-hidden cosmos-scrollbar">
                                <div>
                                    <StockProduct
                                        setProductUpdateShortcut={
                                            handleProductUpdateShortcut
                                        }
                                        setting={setting}
                                        handleUpdateProductPrice={
                                            handleUpdateProductPrice
                                        }
                                    />
                                    <SupplierDetails />
                                    <div className="">
                                        <textarea
                                            ref={noteRef}
                                            className="w-full resize-none p-3 outline-none border-dashed border-2 border-gray-600 placeholder-slate-300 mb-1 bg-transparent"
                                            value={note}
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                            rows={2}
                                            cols={50}
                                            placeholder="বিক্রি সম্পর্কে কিছু লিখুন"
                                        ></textarea>
                                    </div>
                                    <PurchaseDetails />
                                    <div className="flex gap-4">
                                        <button
                                            disabled={purchaseButtonLoading}
                                            onDoubleClick={
                                                handleCompletePurchase
                                            }
                                            className={`w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white ${
                                                purchaseButtonLoading
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Purchase & Print
                                        </button>
                                        <button
                                            disabled={purchaseButtonLoading}
                                            onDoubleClick={
                                                handleCompletePurchase
                                            }
                                            className={`w-1/3 pt-3 pb-2 border-2 border-dashed border-blue-600 bg-blue-900 hover:bg-blue-700 text-white ${
                                                purchaseButtonLoading
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Purchase
                                        </button>
                                        <button
                                            disabled={purchaseButtonLoading}
                                            onDoubleClick={
                                                handleCompletePurchase
                                            }
                                            className={`w-1/2 pt-3 pb-2 border-dashed border-2 border-yellow-600 bg-yellow-900 hover:bg-blue-700 text-white ${
                                                purchaseButtonLoading
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Pending
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
