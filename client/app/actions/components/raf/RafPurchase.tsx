"use client";

import Sidebar from "@/app/components/Sidebar";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import {
    addSupplier,
    addToPurchase,
    addToPurchaseProducts,
    changeActiveProduct,
    decrementQuantity,
    incrementQuantity,
    removeFromPurchase,
    resetSelectedProductIndex,
    selectNexProduct,
    selectPreviousProduct,
    setReceiver,
    shiftMeasurementTo,
} from "@/app/store/slices/stockSlice";
import { RootState } from "@/app/store/store";
import apiClient from "@/app/utils/apiClient";
import { ERROR, SUCCESS } from "@/app/utils/constants/message";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Notification, {
    NotificationProps,
} from "@/app/elements/notification/Notification";
import { logout } from "../functions/authHandlers";
import { SupplierWithId } from "@/app/interfaces/supplier.interface";
import SellReceipt from "@/app/components/bills/SellReceipt";
import PurchaseDetails from "./components/purchaseDetails";
import { useEffect, useRef, useState } from "react";
import PurchaseProducts from "./components/PurchaseProducts";
import SupplierDetails from "./components/SupplierDetails";
import PurchaseProductsCard from "./PurchaseProductCard";
import { arrayToObjectById } from "../functions/arrayToObjectById";
import SuppliersCard from "./components/SuppliersCard";

interface PurchaseProps {
    productsArray: ProductWithID[];
    suppliersArray: SupplierWithId[];
    receiver: any;
    commands: any;
    setting: any;
}

export default function Purchase({
    productsArray,
    suppliersArray,
    receiver,
    commands,
    setting,
}: PurchaseProps) {
    const products = arrayToObjectById(
        productsArray,
        (item: ProductWithID) => !item.purchaseEnable
    );
    const suppliers = arrayToObjectById(suppliersArray);
    let [command, setCommand] = useState("");
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
    const dispatch = useDispatch();
    let purchase = useSelector((state: RootState) => state.purchase);
    const [note, setNote] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [isSuppliers, setIsSuppliers] = useState(false);
    let noteRef = useRef<HTMLTextAreaElement>(null);
    let forceOrder = 1;

    const [notification, setNotification] = useState<NotificationProps>({
        type: "none",
        message: "This is a message",
    });

    // Single use effect
    useEffect(() => {
        if (receiver) {
            dispatch(setReceiver(receiver));
        }

        window.addEventListener("keydown", (e: any) => {
            if (e.key == "Tab") e.preventDefault();
            let command = document.getElementById("command");
            if (
                document.activeElement != command &&
                e.target.tagName != "TEXTAREA" &&
                e.target.tagName != "INPUT"
            ) {
                command?.focus();
            }
        });

        // Cleanup funtion to remove the evern listener
        return () => {
            window.removeEventListener("keydown", () => {});
        };
    }, [receiver]);

    useEffect(() => {
        if (command.startsWith(" ") && suppliers) {
            setIsSuppliers(true);

            const tempFilteredSuppliers = Object.values(suppliers).filter(
                (supplier) => {
                    return supplier.name
                        .toLowerCase()
                        .includes(command.trim().toLowerCase());
                }
            );

            // Convert filtered array back to object
            const filteredSuppliersObject = tempFilteredSuppliers.reduce<
                Record<string, SupplierWithId>
            >((acc, supplier) => {
                acc[supplier._id] = supplier;
                return acc;
            }, {});

            setFilteredSuppliers(filteredSuppliersObject);
        } else if (products) {
            if (isSuppliers) {
                setIsSuppliers(false);
            }

            const tempFilteredProducts = Object.values(products).filter(
                (product) => {
                    return product.name
                        .toLowerCase()
                        .includes(command.toLowerCase());
                }
            );

            // Convert filtered array back to object
            const filteredProductsObject = tempFilteredProducts.reduce<
                Record<string, ProductWithID>
            >((acc, product) => {
                acc[product._id] = product;
                return acc;
            }, {});

            setFilteredProducts(filteredProductsObject);
        }

        // Reset selected product index
        if (purchase.selectedProductIndex > 0) {
            dispatch(resetSelectedProductIndex());
        }
    }, [command]);

    async function handleCompletePurchase() {
        // console.log(purchase);
        // return;
        try {
            await apiClient.post("/purchases", purchase);
            setNotification({
                type: SUCCESS,
                message: "Purchase created successfully",
            });
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
        } catch (error) {
            setNotification({
                type: ERROR,
                message: "Faild to create purchase",
            });
        }
    }
    async function handleAddSupplier() {
        if (filteredSuppliers) {
            const supplier = Object.values(filteredSuppliers)[0];
            dispatch(addSupplier(supplier));
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

    function changePurchaseActiveProductTo(val: number) {
        const purchaseProductsKey = Object.keys(purchase.products);
        if (purchase.activeProduct && purchaseProductsKey.length > 1) {
            let key = purchaseProductsKey.indexOf(purchase.activeProduct) + val;
            if (key < 0) {
                key = purchaseProductsKey.length - 1;
            } else if (key >= purchaseProductsKey.length) {
                key = 0;
            }

            dispatch(changeActiveProduct(purchaseProductsKey[key]));
        }
    }

    let [isShift, setIsShift] = useState(false);

    function handleKeyDown(e: any): void {
        // console.log(e.key);
        let max = 0;
        switch (e.key) {
            case "Shift":
                setIsShift(true);
                break;

            case "Tab":
                e.preventDefault();
                noteRef.current?.focus();
                break;

            case "ArrowUp":
                if (isShift) {
                    changePurchaseActiveProductTo(-1);
                } else {
                    dispatch(incrementQuantity(false));
                }
                break;

            case "ArrowDown":
                if (isShift) {
                    changePurchaseActiveProductTo(+1);
                } else {
                    dispatch(decrementQuantity(false));
                }
                break;

            case "ArrowLeft":
                e.preventDefault();
                if (filteredSuppliers && filteredProducts) {
                    max = isSuppliers
                        ? Object.keys(filteredSuppliers).length - 1
                        : Object.keys(filteredProducts).length - 1;
                    if (command.length > 0) {
                        dispatch(selectPreviousProduct(max));
                    } else {
                        dispatch(shiftMeasurementTo(-1));
                    }
                }
                break;

            case "ArrowRight":
                e.preventDefault();
                if (filteredSuppliers && filteredProducts) {
                    max = isSuppliers
                        ? Object.keys(filteredSuppliers).length - 1
                        : Object.keys(filteredProducts).length - 1;
                    if (command.length > 0) {
                        dispatch(selectNexProduct(max));
                    } else {
                        dispatch(shiftMeasurementTo(1));
                    }
                }
                break;
            case "F9":
                e.preventDefault();
                window.location.href = "./sell";
                break;
            case "F10":
                e.preventDefault();
                window.location.href = "./return";
                break;
            case "Enter":
                if (command == "++") {
                    handleAddSupplerProducts();
                    setCommand("");
                    break;
                }
                if (
                    !isSuppliers &&
                    command.length > 0 &&
                    filteredSuppliers &&
                    filteredProducts
                ) {
                    if (Object.keys(filteredProducts).length > 0) {
                        const product = {
                            ...Object.values(filteredProducts)[
                                purchase.selectedProductIndex
                            ],
                            quantity: 1,
                        };
                        dispatch(addToPurchase(product));
                        setCommand("");
                    }
                } else if (command.length > 1 && filteredSuppliers) {
                    if (Object.keys(filteredSuppliers).length > 0) {
                        handleAddSupplier();
                        setCommand("");
                    }
                } else {
                    if (purchase.totalPrice == 0) break;
                    if (forceOrder >= 5) {
                        handleCompletePurchase();
                    } else {
                        forceOrder++;
                    }
                }
                break;
            case "Delete":
                e.preventDefault();
                dispatch(removeFromPurchase(purchase.activeProduct));
                break;
        }
    }

    function handleAddSupplerProducts() {
        if (purchase.supplier?.products) {
            // Extract the products from the products object using the IDs
            const supplierProducts = purchase.supplier.products
                .map((id) => products[id])
                .filter((product) => product !== undefined);

            dispatch(addToPurchaseProducts(supplierProducts));
        }
    }

    function handleKeyUp(e: any): void {
        switch (e.key) {
            case "Shift":
                setIsShift(false);
                break;
        }
    }

    function handleAddToPurchase(product: ProductWithID) {
        dispatch(addToPurchase(product));
    }

    return (
        <main>
            <SellReceipt />
            <div className="print:hidden">
                <Sidebar active="purchase" userId={undefined} />
                <Notification
                    type={notification.type}
                    message={notification.message}
                    className="justify-center"
                />
                <div className="ps-[94px] 2xl:ps-[150px] pe-3 bg-gray-100 dark:bg-gray-950">
                    <div className="grid grid-cols-1 lg:grid-cols-8 2xl:grid-cols-9 gap-6 py-4 min-h-screen">
                        <div className="col-span-8 lg:col-span-5">
                            <div className="p-3 border-2 border-dashed border-slate-500 mb-3">
                                <p className="bg-green-700 inline-block py-2 px-4 me-3">
                                    Purchase
                                </p>
                                <Link href={"/"}>Home</Link>
                                <Link className="ms-3" href={"/actions/sell"}>
                                    Sell
                                </Link>
                                <Link className="ms-3" href={"/products"}>
                                    Products
                                </Link>
                                <Link className="ms-3" href={"/suppliers"}>
                                    Suppliers
                                </Link>
                                <p className="inline-block mx-4 bg-green-700 py-2 px-3">
                                    {purchase.receiver?.name}
                                </p>
                                <button
                                    onDoubleClick={logout}
                                    className="bg-red-700 text-white py-1 px-3 rounded"
                                >
                                    Logout
                                </button>
                            </div>
                            <div className="">
                                <input
                                    id="command"
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onKeyUp={handleKeyUp}
                                    type="text"
                                    className="border-2 w-full md:w-1/2 xl:w-1/3 border-dashed border-slate-500 bg-black outline-none focus:border-green-500 text-white px-4 py-2 text-lg"
                                    autoFocus
                                />
                            </div>
                            <div className="mt-3">
                                {/* <ProductsCard selected={} /> */}
                            </div>

                            {isSuppliers ? (
                                <div>
                                    <SuppliersCard
                                        supplilers={filteredSuppliers}
                                    />
                                </div>
                            ) : (
                                // <ProductCard products={filteredProducts} />
                                <PurchaseProductsCard
                                    selected={purchase.selectedProductIndex}
                                    callback={handleAddToPurchase}
                                    products={filteredProducts}
                                />
                            )}
                        </div>
                        <div className="col-span-8 lg:col-span-3">
                            <PurchaseProducts />
                            <SupplierDetails />
                            <div className="">
                                <textarea
                                    ref={noteRef}
                                    className="w-full resize-none bg-black text-white p-3 outline-none border-dashed border-2 border-gray-600 placeholder-slate-300 mb-1"
                                    value={note}
                                    onKeyDown={handleNoteKeyDown}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={2}
                                    cols={50}
                                    placeholder="কেনা সম্পর্কে কিছু লিখুন"
                                ></textarea>
                            </div>
                            <PurchaseDetails />
                            <div className="flex gap-4">
                                <button
                                    onDoubleClick={() =>
                                        handleCompletePurchase()
                                    }
                                    className="w-1/2 pt-3 pb-2 border-2 border-dashed border-green-600 bg-green-900 hover:bg-green-700 text-white"
                                >
                                    বিক্রয় ও প্রিন্ট
                                </button>
                                <button
                                    onDoubleClick={() =>
                                        handleCompletePurchase()
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
        </main>
    );
}
