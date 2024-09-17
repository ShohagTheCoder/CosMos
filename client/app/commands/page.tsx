"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import SelectProductPopup from "../components/SelectProductPopup";
import { ProductWithID } from "../products/interfaces/product.interface";
import { productArrayToObject } from "../actions/functions/productArrayToObject";
import PulseLoading from "../elements/loding/PulseLoading";

function Commands() {
    const [commands, setCommands] = useState<any[]>([]);
    const [products, setProducts] = useState<Record<string, ProductWithID>>({});
    const [productsPopup, setProductsPopup] = useState(false);
    const [currentCommandIndex, setCurrentCommandIndex] = useState<
        number | null
    >(null);

    useEffect(() => {
        apiClient.get("commands").then((res) => setCommands(res.data));
        apiClient
            .get("products")
            .then((res) => setProducts(productArrayToObject(res.data)));
    }, []);

    async function handleCallback(product: ProductWithID) {
        if (currentCommandIndex !== null) {
            const commandId = commands[currentCommandIndex]._id;
            try {
                const { data } = await apiClient.patch(
                    `commands/${commandId}`,
                    {
                        type: "product",
                        value: product._id,
                    }
                );
                console.log(data);

                setCommands((prevCommands) => {
                    const updatedCommands = [...prevCommands];
                    updatedCommands[currentCommandIndex]["value"] = product._id; // Or use product.id, depending on the field
                    return updatedCommands;
                });
            } catch (error) {
                console.log("Faild to save command");
            }
        }
        setProductsPopup(false);
    }

    function getProduct(command: any) {
        if (command.value) {
            //code
            return (
                <div className="flex gap-3">
                    <div>
                        <img
                            src={`/images/products/${
                                products[command.value].image
                            }`}
                            alt=""
                            className="h-[80px] w-[80px]"
                        />
                    </div>

                    <p>{products[command.value].name}</p>
                </div>
            );
        } else {
            return <p>Empty</p>;
        }
    }

    if (commands.length === 0 || Object.keys(products).length === 0) {
        return (
            <div className="h-svh flex justify-center items-center">
                <PulseLoading />
            </div>
        );
    }

    return (
        <div className="w-[600px] mx-auto py-5">
            {productsPopup && (
                <SelectProductPopup
                    products={Object.values(products)}
                    callback={handleCallback}
                    handleClose={() => setProductsPopup(false)}
                />
            )}

            <div className="py-2 px-3 bg-slate-800 mb-3">
                <p>
                    Search Products = (Products name, SKU, price, category,
                    brand etc)
                </p>
            </div>
            <div className="py-2 px-3 bg-slate-800 mb-3">
                <p>
                    Search customers = &apos;Space&apos; + (Customers name,
                    phone number, address etc)
                </p>
            </div>

            <div>
                {commands.map((command: any, index) => (
                    <div
                        key={command.command}
                        className="mb-4 flex justify-between bg-gray-700 p-3"
                    >
                        <p className="text-lg">{command.command}</p>
                        <p>{command.type}</p>
                        {getProduct(command)}
                        <p>
                            <button
                                onClick={() => {
                                    setCurrentCommandIndex(index);
                                    setProductsPopup(true);
                                }}
                            >
                                Select
                            </button>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Commands;
