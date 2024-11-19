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
import ProductsCard from "./ProductsCard";
import { updateHelperField } from "@/app/store/slices/helperSlice";
// import { useHandleKeyUp } from "../sell/functions/keyboardHandler";
import ProductsRow from "./ProductsRow";
import ColsIcon from "@/app/icons/ColsIcon";
import RowIcon from "@/app/icons/RowIcon";
import NotImageIcon from "@/app/icons/NotImageIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import { setProduct } from "@/app/store/slices/productSlice";
import useCartManager from "@/app/store/providers/cartProvider";
// eslint-disable-next-line no-unused-vars
import SellPageSelector from "./components/SellPageSelector";
import { cloneDeep } from "lodash";
import SellCommandHandler from "@/app/common/handlers/sellCommandHandler";
import apiClient from "@/app/utils/apiClient";
import useNotifications from "@/app/hooks/useNotifications";
import NotificationList from "@/app/elements/notification/NotificationList";
import { arrayToObjectById } from "@/app/actions/functions/arrayToObjectById";
import { productArrayToObject } from "@/app/actions/functions/productArrayToObject";
import { Command } from "../page";
import FinalView from "./FinalView";
import ProductUpdateShortcut from "./ProductUpdateShortcut";
import { useParams } from "next/navigation";

interface SellProps {
    productsArray: ProductWithID[];
    customersArray: CustomerWithId[];
    user: any;
    commands: Record<string, Command>;
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
    const { notifications, notifySuccess, notifyError } = useNotifications();
    const [settingState, setSettingState] = useState(setting);
    // eslint-disable-next-line no-unused-vars

    const [cartOnly, setCartOnly] = useState(true);

    const cartManager = useCartManager();

    const [commandCounter, setCommandCounter] = useState({
        name: "unknown",
        value: 0,
    });

    const { id } = useParams();

    const [sellButtonLoading, setSellButtonLoading] = useState(false);

    const commandHandler = useRef(
        new SellCommandHandler(
            cartManager,
            setCommand,
            getProductByCommand,
            handleUpdateProductPrice,
            handleCompleteSell,
            setCommandCounter,
            handleProductUpdateShortcut
        )
    ).current;

    // Single use effect
    useEffect(() => {
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
            handlePageChange,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filteredCustomers,
        filteredProducts,
        isCustomers,
        commandCounter,
        handlePageChange,
    ]);

    useEffect(() => {
        // Match barcode to add product
        if (command.length > 7) {
            if (/^[0-9]+$/.test(command)) {
                let product = productsArray.find(
                    (product) => product.barcode == command
                );

                if (product) {
                    cartManager.addTo(product).save();
                    setCommand("");
                    return;
                }
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
    }, [command, products]);

    async function handlePendingSell() {
        setSellButtonLoading(true);

        apiClient
            .post("/sells/pending", { ...cartManager.getData(), user })
            .then(async (res) => {
                notifySuccess(res.data.message);
                cartManager.reset(initialCartState);
            })
            .catch((error) => {
                console.log(error);
                notifyError(error);
            })
            .finally(() => {
                setTimeout(() => {
                    // setSellButtonLoading(false);
                    setSellButtonLoading(false);
                }, 3000);
            });
    }

    async function handleCompleteSell() {
        setSellButtonLoading(true);
        apiClient
            .post("/sells", { ...cartManager.getData(), user })
            .then(async (res) => {
                notifySuccess(res.data.message);
                cartManager.reset(initialCartState);
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
            .catch((error) => {
                console.log(error);
                notifyError(error);
            })
            .finally(() => {
                setTimeout(() => {
                    // setSellButtonLoading(false);
                    setSellButtonLoading(false);
                }, 3000);
            });
    }

    function updateSetting(payload: any) {
        apiClient
            .patch(`/settings/${setting._id}`, payload)
            .then(() => {
                setSettingState((state: any) => ({ ...state, ...payload }));
            })
            .catch((error) => console.log(error));
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

    // Pending section
    useEffect(() => {
        async function setPendigSell() {
            const { data: sale } = await apiClient.get(`sells/pending/${id}`);

            if (sale) {
                if (sale.status == "pending") {
                    sale.totalOnly = false;
                    sale.cartOnly = false;
                    cartManager.reset(sale);
                }
            }
        }
        setPendigSell();
    }, [id]);

    // Add to cart with product shortcut
    function getProductByCommand(shortcut: string) {
        let command = commands[shortcut.toLocaleLowerCase()];

        if (command && command.value != null) {
            let product = products[command.value];
            setCommand("");
            return product;
        }
        return;
    }

    function handleUpdateProductPrice(amount: number) {
        const activeProductId = cartManager.get("activeProduct"); // Get active product ID

        if (activeProductId) {
            // Retrieve the active product using the correctly formatted path
            const product = cartManager.get(`products.${activeProductId}`);

            // Update the price locally in cartManager
            cartManager.update(
                `products.${activeProductId}.updatePrice`,
                (updatePrice) => (updatePrice ?? 0) + amount // Ensure `updatePrice` is a number
            );

            // Send the updated price to the server
            apiClient
                .patch(`/products/updatePrice/${product._id}`, { amount })
                .then((res) => {
                    // Update the prices in the cart manager
                    cartManager
                        .set(
                            `products.${product._id}.prices`,
                            res.data.data.prices
                        )
                        .save();

                    // Log old and new state to verify changes
                    setProducts((state: Record<string, ProductWithID>) => {
                        const updatedState = {
                            ...state,
                            [product._id]: {
                                ...state[product._id],
                                prices: [...res.data.data.prices], // Ensure new reference for prices
                            },
                        };
                        return updatedState;
                    });
                })
                .catch((error) => console.log(error));
        }
    }

    async function handleProductUpdate(product: ProductWithID) {
        const update = Object.entries(product).reduce(
            (acc: any, [key, value]) => {
                if (
                    product.product &&
                    key in product.product &&
                    value !== product.product[key] &&
                    key !== "product"
                ) {
                    acc[key] = value;
                }
                return acc;
            },
            {}
        );

        try {
            await apiClient.patch(`products/${product._id}`, update);
            setProducts((state: Record<string, ProductWithID>) => {
                const updatedState = { ...state, [product._id]: product }; // Create a new state object with the updated product
                return updatedState;
            });

            // Update the product in the cart manager
            if (update.prices) {
                cartManager.update(`products.${product._id}.prices`, () => {
                    return product.prices;
                });
            }
            if (update.measurements) {
                cartManager.update(
                    `products.${product._id}.measurements`,
                    () => {
                        product.measurements;
                    }
                );
            }
            cartManager.save();
        } catch (error) {
            console.error("Failed to update product:", error);
        }
        setProductUpdateShortcut(false); // You can add a toast or error message here instead of closing
    }

    function handlePageChange(pageKey: string) {
        if (pageKey === activePage.current) return;
        // Deep copy cart states if necessary
        let cartStates: Record<string, CartState> = cloneDeep(
            helper.cartStates
        );
        // Ensure cart is defined before assignment
        cartStates[activePage.current] = cart;
        // Update the active sell page first
        activePage.current = pageKey;
        // Dispatch Redux state update
        dispatch(updateHelperField({ field: "cartStates", value: cartStates }));
        // Use the cart manager to reset and save the new state
        const newState = cartStates[pageKey] || initialCartState;
        // Use the cart manager to reset and save the new state
        cartManager.reset(newState);
    }

    return (
        <div className="text-black dark:text-white select-none">
            {/* <SellReceipt /> */}
            <div className="print:hidden">
                <Sidebar active="sell" userId={user._id} />
                <div className="ps-[94px] 2xl:ps-[130px] 2xl:pe-[20px] bg-white dark:bg-gray-950">
                    <NotificationList
                        notifications={notifications}
                        className="mt-4"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 lg:h-screen gap-6 overflow-x-hidden overflow-y-auto lg:overflow-y-hidden cosmos-scrollbar">
                        <div
                            className={`max-h=[1000px] h-full flex flex-col overflow-hidden  py-4 me-3 lg:me-0 ${
                                cartManager.get("cartOnly") == true
                                    ? "col-span-8 lg:col-span-2 2xl:col-span-3"
                                    : "col-span-8 lg:col-span-5 2xl:col-span-6"
                            }`}
                        >
                            <div
                                className={`${
                                    cartManager.get("cartOnly") == true
                                        ? "hidden"
                                        : ""
                                }`}
                            >
                                <SellPageSelector
                                    activePage={activePage.current}
                                    cartStates={helper.cartStates}
                                    userName={user.name}
                                    productsTotalPrice={cartManager.get(
                                        "totalPrice"
                                    )}
                                    handlePageChange={handlePageChange}
                                />
                            </div>
                            <div>
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => {
                                        setCommand(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        commandHandler.handleKeyDown(e);
                                    }}
                                    onKeyUp={(e) => {
                                        commandHandler.handleKeyUp(e);
                                    }}
                                    type="text"
                                    className={`border-2 border-dashed border-slate-500 bg-transparent outline-none focus:border-green-500 px-4 py-2 text-lg ${
                                        cartManager.get("cartOnly") == true
                                            ? "w-full"
                                            : "w-full md:w-1/2 xl:w-1/3"
                                    }`}
                                    autoFocus
                                    autoComplete="off"
                                />
                            </div>
                            <div
                                className={`${
                                    cartManager.get("cartOnly") == true
                                        ? "hidden"
                                        : ""
                                }`}
                            >
                                <div
                                    className={`flex gap-4 py-2 px-3 my-3 bg-gray-300  dark:bg-gray-800`}
                                >
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
                                    <button
                                        onClick={() => {
                                            updateSetting({
                                                productDescription:
                                                    !settingState.productDescription,
                                            });
                                        }}
                                    >
                                        {settingState.productDescription ? (
                                            <ColsIcon height="20" />
                                        ) : (
                                            <RowIcon height="18" />
                                        )}
                                    </button>
                                </div>
                                <div>
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
                                                ""
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
                                                            callback={(
                                                                product
                                                            ) => {
                                                                cartManager
                                                                    .addTo(
                                                                        product
                                                                    )
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
                                                            showProductDescription={
                                                                settingState.productDescription
                                                            }
                                                            setProductUpdateShortcut={
                                                                handleProductUpdateShortcut
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
                                                            callback={(
                                                                product
                                                            ) => {
                                                                cartManager
                                                                    .addTo(
                                                                        product
                                                                    )
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
                                                            showProductDescription={
                                                                settingState.productDescription
                                                            }
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                {commandCounter.name == "completeSell" &&
                                commandCounter.value >= 1 ? (
                                    <FinalView stateManager={cartManager} />
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        <div className="py-4 mb-4 lg:pe-3 col-span-8 lg:col-span-3 min-h-screen overflow-hidden grid grid-rows-1">
                            <div className="overflow-y-auto overflow-x-hidden h-full cosmos-scrollbar pe-2">
                                <div className="h-full flex flex-col justify-between">
                                    <div>
                                        <CustomerDetails />
                                        {commandCounter.name ==
                                            "completeSell" &&
                                        commandCounter.value >= 1 ? (
                                            ""
                                        ) : (
                                            <CartProduct
                                                stateManager={cartManager}
                                                setProductUpdateShortcut={
                                                    handleProductUpdateShortcut
                                                }
                                                setting={setting}
                                                handleUpdateProductPrice={
                                                    handleUpdateProductPrice
                                                }
                                            />
                                        )}

                                        <div className="">
                                            <textarea
                                                ref={noteRef}
                                                className="w-full resize-none p-3 outline-none border-dashed border-2 border-gray-600 placeholder-black dark:placeholder-slate-300 mb-1 bg-transparent"
                                                value={note}
                                                onChange={(e) =>
                                                    setNote(e.target.value)
                                                }
                                                rows={1}
                                                cols={50}
                                                placeholder="অর্ডার সম্পর্কে কিছু লিখুন"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div>
                                        <SellDetails />
                                        <div className="flex gap-4">
                                            <button
                                                disabled={sellButtonLoading}
                                                onDoubleClick={
                                                    handlePendingSell
                                                }
                                                className={`w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white ${
                                                    sellButtonLoading
                                                        ? "cursor-not-allowed"
                                                        : "cursor-pointer"
                                                }`}
                                            >
                                                Order
                                            </button>
                                            <button
                                                disabled={sellButtonLoading}
                                                onDoubleClick={
                                                    handleCompleteSell
                                                }
                                                className={`w-1/2 pt-3 pb-2 border-dashed border-2 border-yellow-600 bg-yellow-900 hover:bg-blue-700 text-white ${
                                                    sellButtonLoading
                                                        ? "cursor-not-allowed"
                                                        : "cursor-pointer"
                                                }`}
                                            >
                                                Paid
                                            </button>
                                        </div>
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
