"use client";
import Sidebar from "@/app/components/Sidebar";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    addToCart,
    CartState,
    changeActiveProduct,
    initialCartState,
    resetSelectedProductIndex,
    setUser,
    setWholeCart,
    updateCartProduct,
    updatePaid,
} from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomerCard from "./components/CustomerCard";
import CartProduct from "./components/CartProduct";
import CustomerDetails from "./components/CustomerDetails";
import SellDetails from "./components/SellDetails";
import SellReceipt from "@/app/components/bills/SellReceipt";
import Notification from "@/app/elements/notification/Notification";
import SupplierCard from "./components/SupplierCard";
import { logout } from "../functions/authHandlers";
import ProductsCard from "./ProductsCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";
import { updateHelperField } from "@/app/store/slices/helperSlice";
import { productArrayToObject } from "../functions/productArrayToObject";
import useNotification from "@/app/hooks/useNotification";
import FinalView from "../sell/components/FinalView";
import { useHandleKeyUp } from "../sell/functions/keyboardHandler";
import ProductsRow from "./ProductsRow";
import ColsIcon from "@/app/icons/ColsIcon";
import RowIcon from "@/app/icons/RowIcon";
import NotImageIcon from "@/app/icons/NotImageIcon";
import ImageIcon from "@/app/icons/ImageIcon";
import ProductUpdateShortcut from "../sell/components/ProductUpdateShortcut";
import { setProduct } from "@/app/store/slices/productSlice";
import apiCall from "@/app/common/apiCall";

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
    const products = useMemo(
        () => productArrayToObject(productsArray, (item) => !item.sellEnable),
        [productsArray]
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
    const activeSellPage = useRef("F5");
    const [productUpdateShortcut, setProductUpdateShortcut] = useState(false);
    const { notification, notifySuccess, notifyError } = useNotification();
    const [settingState, setSettingState] = useState(setting);

    // Single use effect
    useEffect(() => {
        if (user) {
            dispatch(setUser(user));
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
            ];
            if (usedKeys.includes(e.key)) {
                e.preventDefault(); // Prevent tab default behavior
            }
            let command = document.getElementById("command");
            command?.focus(); // Focus the command input element
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            window.removeEventListener("keydown", () => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // console.log(products);

    useEffect(() => {
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
            dispatch(resetSelectedProductIndex());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command]);

    // Add to cart with product shortcut
    function addToCartByProductShortcut(e: KeyboardEvent, shortcut: string) {
        let command = commands.find((_) => _.command.toLowerCase() == shortcut);
        if (command && command.value != null) {
            let product = products[command.value];
            if (!product) return;
            e.preventDefault();
            setCommand("");
            dispatch(addToCart(product));
        }
        return;
    }

    async function handleCompleteSell() {
        try {
            let sell = { ...cart };
            if (!sell.customer) {
                sell.paid = sell.totalPrice;
                sell.due = 0;
            }
            await apiClient.post("/sells", sell);
            notifySuccess("Sell created successfully");
        } catch (e) {
            notifyError("Faild to create sell");
        }
    }

    function handleNoteKeyDown(e: any) {
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                document.getElementById("command")?.focus();
                break;
        }
    }

    function changeCartActiveProductTo(val: number) {
        const cartProductsKey = Object.keys(cart.products);
        if (cart.activeProduct && cartProductsKey.length > 1) {
            let key = cartProductsKey.indexOf(cart.activeProduct) + val;
            if (key < 0) {
                key = cartProductsKey.length - 1;
            } else if (key >= cartProductsKey.length) {
                key = 0;
            }

            dispatch(changeActiveProduct(cartProductsKey[key]));
        }
    }

    function updateSetting(payload: any) {
        apiCall
            .patch(`/settings/${setting._id}`, payload)
            .success(() => {
                setSettingState((state: any) => ({ ...state, ...payload }));
            })
            .error((error) => console.log(error));
    }

    function handleProductUpdateShortcut(productId: string | undefined) {
        let product: ProductWithID | undefined = undefined;
        if (productId) {
            product = products[productId];
        } else {
            if (command.length >= 2) {
                product =
                    Object.values(filteredProducts)[cart.selectedProductIndex];
            } else if (cart.activeProduct) {
                product = products[cart.activeProduct];
            }
        }

        if (product) {
            product = { ...product, product };
            dispatch(setProduct(product));
            setProductUpdateShortcut(true);
        }
    }

    function handleUpdateProductPrice(amount: number) {
        if (cart.activeProduct) {
            let product = { ...cart.products[cart.activeProduct] };
            product.updatePrice += amount;
            apiCall
                .patch(`/products/updatePrice/${product._id}`, { amount })
                .success((data) => {
                    dispatch(
                        updateCartProduct({
                            ...product,
                            ...data,
                        })
                    );
                    products[product._id] = { ...product, ...data };
                })
                .error((error) => console.log(error));
        }
    }

    function handleProductUpdate(product: any) {
        setProductUpdateShortcut(false);
        products[product._id] = product;
        if (cart.products[product._id]) {
            dispatch(updateCartProduct(product));
        }
    }

    function handleSellPageChange(sellPageKey: string) {
        if (sellPageKey == activeSellPage.current) return;
        let cartStates: Record<string, CartState> = { ...helper.cartStates };
        cartStates[activeSellPage.current] = cart;
        dispatch(updateHelperField({ field: "cartStates", value: cartStates }));
        dispatch(setWholeCart(cartStates[sellPageKey] || initialCartState));
        activeSellPage.current = sellPageKey;
    }

    const { onKeyUp, onkeydown, commandCounter } = useHandleKeyUp(
        command,
        setCommand,
        cart,
        products,
        filteredProducts,
        filteredCustomers,
        isCustomers,
        handleSellPageChange,
        changeCartActiveProductTo,
        addToCartByProductShortcut,
        handleCompleteSell,
        handleProductUpdateShortcut,
        handleUpdateProductPrice
        // commandCounter
    );

    return (
        <div className="text-black dark:text-white">
            <SellReceipt />
            <div className="print:hidden">
                <Sidebar active="sell" userId={user._id} />
                <Notification
                    type={notification.type}
                    message={notification.message}
                    className="justify-center"
                />
                <div className="ps-[94px] 2xl:ps-[150px] bg-white dark:bg-gray-950">
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 lg:h-screen gap-6 overflow-x-hidden overflow-y-auto lg:overflow-y-hidden cosmos-scrollbar">
                        <div className="max-h=[1000px] h-full grid grid-rows-[auto_auto_auto_1fr] overflow-hidden col-span-8 lg:col-span-5 py-4 me-3 lg:me-0">
                            <div className="bg-gray-300 dark:bg-gray-950 p-3 border-2 border-dashed border-slate-500 mb-3 md:flex justify-between items-center">
                                <div className="flex gap-3 justify-start">
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F5"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSellPageChange("F5")
                                        }
                                    >
                                        {helper.cartStates["F5"]?.customer?.name
                                            ? helper.cartStates["F5"].customer
                                                  .name
                                            : "One"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F6"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSellPageChange("F6")
                                        }
                                    >
                                        {helper.cartStates["F6"]?.customer?.name
                                            ? helper.cartStates["F6"].customer
                                                  .name
                                            : "Two"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F7"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSellPageChange("F7")
                                        }
                                    >
                                        {helper.cartStates["F7"]?.customer?.name
                                            ? helper.cartStates["F7"].customer
                                                  .name
                                            : "Three"}
                                    </button>
                                    <button
                                        className={`py-1 px-3 ${
                                            activeSellPage.current == "F8"
                                                ? "bg-green-700"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSellPageChange("F8")
                                        }
                                    >
                                        {helper.cartStates["F8"]?.customer?.name
                                            ? helper.cartStates["F8"].customer
                                                  .name
                                            : "Four"}
                                    </button>
                                </div>
                                <div className="md:border-s-2 border-dashed border-gray-600 ps-4 flex flex-wrap justify-end gap-4 items-center">
                                    <p className="inline-block bg-green-800 py-1 px-3 rounded text-white">
                                        {user.name}
                                    </p>
                                    <button
                                        onDoubleClick={logout}
                                        className="bg-red-800 text-white py-1 px-3 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div>
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={onkeydown}
                                    onKeyUp={onKeyUp}
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
                                                {cart.action == "purchase" ? (
                                                    <SupplierCard
                                                        customers={customers}
                                                    />
                                                ) : (
                                                    <CustomerCard
                                                        customers={
                                                            filteredCustomers
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {settingState.productRow ? (
                                                    <ProductsRow
                                                        selected={
                                                            cart.selectedProductIndex
                                                        }
                                                        callback={(product) =>
                                                            dispatch(
                                                                addToCart(
                                                                    product
                                                                )
                                                            )
                                                        }
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
                                                        callback={(product) =>
                                                            dispatch(
                                                                addToCart(
                                                                    product
                                                                )
                                                            )
                                                        }
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
                                            onKeyDown={handleNoteKeyDown}
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
                                            onDoubleClick={() =>
                                                handleCompleteSell()
                                            }
                                            className="w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white"
                                        >
                                            বিক্রয় ও প্রিন্ট
                                        </button>
                                        <button
                                            onDoubleClick={() =>
                                                handleCompleteSell()
                                            }
                                            className="w-1/2 pt-3 pb-2 border-dashed border-2 border-blue-600 bg-blue-900 hover:bg-blue-700 text-white"
                                        >
                                            বিক্রয়
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
