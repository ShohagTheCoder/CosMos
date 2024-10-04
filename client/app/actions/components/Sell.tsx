"use client";
import Sidebar from "@/app/components/Sidebar";
import { Customer, CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { CartState, initialCartState } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerCard from "./components/CustomerCard";
import CartProduct from "./components/CartProduct";
import CustomerDetails from "./components/CustomerDetails";
import SellDetails from "./components/SellDetails";
// eslint-disable-next-line no-unused-vars
import Notification from "@/app/elements/notification/Notification";
import { logout } from "../functions/authHandlers";
import ProductsCard from "./ProductsCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";
import { updateHelperField } from "@/app/store/slices/helperSlice";
import { productArrayToObject } from "../functions/productArrayToObject";
import useNotification from "@/app/hooks/useNotification";
import FinalView from "../sell/components/FinalView";
// import { useHandleKeyUp } from "../sell/functions/keyboardHandler";
import ProductsRow from "./ProductsRow";
import ColsIcon from "@/app/icons/ColsIcon";
import RowIcon from "@/app/icons/RowIcon";
import NotImageIcon from "@/app/icons/NotImageIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import ProductUpdateShortcut from "../sell/components/ProductUpdateShortcut";
import { setProduct } from "@/app/store/slices/productSlice";
import apiCall from "@/app/common/apiCall";
import useCartManager from "@/app/store/providers/cartProvider";
import Notifications from "@/app/elements/notification/Notifications";
// eslint-disable-next-line no-unused-vars
import SellPageSelector from "./components/SellPageSelector";
import { cloneDeep } from "lodash";
import SellCommandHandler from "@/app/common/handlers/sellCommandHandler";
import apiClient from "@/app/utils/apiClient";

interface SellProps {
    productsArray: ProductWithID[];
    customersArray: CustomerWithId[];
    user: any;
    commands: any[];
    setting: any;
}

export default function Sell({
    productsArray,
    customersArray,
    user,
    commands,
    setting,
}: SellProps) {
    const [products, setProducts] = useState(
        productArrayToObject(productsArray, (item) => !item.sellEnable)
    );

    const customers = useMemo(
        () => arrayToObjectById(customersArray),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [productsArray]
    );

    let [command, setCommand] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const dispatch = useDispatch();
    let cart = useSelector((state: RootState) => state.cart);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isCustomers, setIsCustomers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    const helper = useSelector((state: RootState) => state.helper);
    const activePage = useRef("F5");
    const [productUpdateShortcut, setProductUpdateShortcut] = useState(false);
    const { notification, notifySuccess, notifyError } = useNotification();
    const [settingState, setSettingState] = useState(setting);
    // eslint-disable-next-line no-unused-vars
    const notifications = useSelector(
        (state: RootState) => state.notifications
    );

    const cartManager = useCartManager();

    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const [sellButtonLoading, setSellButtonLoading] = useState(false);

    const commandHandler = useRef(
        new SellCommandHandler(
            cartManager,
            setCommand,
            getProductByCommand,
            handleUpdateProductPrice,
            handleCompleteSell,
            setCommandCounter,
            handleProductUpdateShortcut,
            handleSellPageChange
        )
    ).current;

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    // Single use effect
    useEffect(() => {
        if (user) {
            cartManager.set("user", user).save();
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
            filteredCustomers,
            filteredProducts,
            isCustomers,
            commandCounter,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredCustomers, filteredProducts, isCustomers, commandCounter]);

    useEffect(() => {
        // Match barcode or SKU to add product
        if (/^[0-9]+$/.test(command)) {
            let product = productsArray.find(
                (product) => product.SKU.toString() == command
            );

            if (product) {
                cartManager.addTo(product).save();
                setCommand("");
                return;
            }
        }

        if (/^\s+/.test(command) && customers) {
            setIsCustomers(true);
            // Convert filtered array back to object
            const filteredCustomersObject = Object.entries(customers).reduce<
                Record<string, CustomerWithId>
            >((acc, [key, customer]) => {
                if (
                    customer.name
                        .toLowerCase()
                        .includes(command.trim().toLowerCase())
                ) {
                    acc[key] = customer;
                }
                return acc;
            }, {});

            setFilteredCustomers(filteredCustomersObject);
        } else if (/^(?![0-9\s.])[a-zA-Z]{2,10}/.test(command) && products) {
            if (isCustomers) {
                setIsCustomers(false);
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
            if (isCustomers) {
                setIsCustomers(false);
            }
            setFilteredProducts(products);
        } else if (command == " ") {
            if (!isCustomers) {
                setIsCustomers(true);
            }
            setFilteredCustomers(customers);
        }

        // Reset selected product index
        if (cart.selectedProductIndex > 0) {
            cartManager.set("selectedProductIndex", 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command]);

    async function handleCompleteSell() {
        setSellButtonLoading(true);
        apiCall
            .post("/sells", cartManager.getData())
            .success(async (data, message) => {
                notifySuccess(message);
                try {
                    let { data: _productsArray } = await apiClient.get(
                        "products"
                    );
                    setProducts(
                        productArrayToObject(
                            _productsArray,
                            (item) => !item.sellEnable
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
                setTimeout(() => {
                    // setSellButtonLoading(false);
                    cartManager.reset(initialCartState).save();
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
                    Object.values(filteredProducts)[cart.selectedProductIndex];
            } else if (cartManager.get("activeProduct")) {
                product = products[cartManager.get("activeProduct")];
            }
        }

        if (product) {
            dispatch(setProduct(product));
            setProductUpdateShortcut(true);
        }
    }

    // Add to cart with product shortcut
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
        if (cartManager.get("activeProduct")) {
            let product = cartManager.get("products.{{activeProduct}}");
            cartManager.update(
                "products.{{activeProduct}}.updatePrice",
                (updatePrice) => updatePrice + amount
            );
            apiCall
                .patch(`/products/updatePrice/${product._id}`, { amount })
                .success((data) => {
                    cartManager
                        .set(`products.${product._id}.prices`, data.prices)
                        .save();

                    setProducts((state: Record<string, ProductWithID>) => {
                        state[product._id].prices = data.prices;
                        return state;
                    });
                })
                .error((error) => console.log(error));
        }
    }

    function handleProductUpdate(p: ProductWithID) {
        setProductUpdateShortcut(false);

        setProducts((state: Record<string, ProductWithID>) => {
            const updatedState = { ...state, [p._id]: p }; // Create a new state object with the updated product
            return updatedState;
        });

        // Update the product in the cart manager
        cartManager.set(`products.${p._id}.prices`, p.prices).save();
    }

    function handleSellPageChange(sellPageKey: string) {
        if (sellPageKey === activePage.current) return;
        // Deep copy cart states if necessary
        let cartStates: Record<string, CartState> = cloneDeep(
            helper.cartStates
        );
        // Ensure cart is defined before assignment
        cartStates[activePage.current] = cart;
        // Update the active sell page first
        activePage.current = sellPageKey;
        // Dispatch Redux state update
        dispatch(updateHelperField({ field: "cartStates", value: cartStates }));
        // Use the cart manager to reset and save the new state
        const newCartState = cartStates[sellPageKey] || initialCartState;
        // Use the cart manager to reset and save the new state
        cartManager.reset(newCartState).save();
    }

    return (
        <div className="text-black dark:text-white">
            {/* <SellReceipt /> */}
            <div className="print:hidden">
                <Sidebar active="sell" userId={user._id} />
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
                            <SellPageSelector
                                activePage={activePage.current}
                                cartStates={helper.cartStates}
                                userName={user.name}
                                handleSellPageChange={handleSellPageChange}
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
                                            "completeSell" &&
                                        commandCounter.value >= 1 ? (
                                            <FinalView />
                                        ) : isCustomers ? (
                                            <div>
                                                <CustomerCard
                                                    customers={
                                                        filteredCustomers
                                                    }
                                                    callback={(
                                                        customer: Customer
                                                    ) => {
                                                        // dispatch(addCustomer(customer));
                                                        cartManager
                                                            .set(
                                                                "customer",
                                                                customer
                                                            )
                                                            .save();
                                                        setCommand("");
                                                        // if()
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
                                                            cart.selectedProductIndex
                                                        }
                                                        callback={(product) => {
                                                            cartManager
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
                                                            cart.selectedProductIndex
                                                        }
                                                        callback={(product) => {
                                                            cartManager
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
                                    <CartProduct
                                        setProductUpdateShortcut={
                                            handleProductUpdateShortcut
                                        }
                                        setting={setting}
                                        handleUpdateProductPrice={
                                            handleUpdateProductPrice
                                        }
                                    />
                                    <CustomerDetails />
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
                                    <SellDetails />
                                    <div className="flex gap-4">
                                        <button
                                            disabled={sellButtonLoading}
                                            onDoubleClick={handleCompleteSell}
                                            className={`w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white ${
                                                sellButtonLoading
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Sell & Print
                                        </button>
                                        <button
                                            disabled={sellButtonLoading}
                                            onDoubleClick={handleCompleteSell}
                                            className={`w-1/3 pt-3 pb-2 border-2 border-dashed border-blue-600 bg-blue-900 hover:bg-blue-700 text-white ${
                                                sellButtonLoading
                                                    ? "cursor-not-allowed"
                                                    : "cursor-pointer"
                                            }`}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            disabled={sellButtonLoading}
                                            onDoubleClick={handleCompleteSell}
                                            className={`w-1/2 pt-3 pb-2 border-dashed border-2 border-yellow-600 bg-yellow-900 hover:bg-blue-700 text-white ${
                                                sellButtonLoading
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
