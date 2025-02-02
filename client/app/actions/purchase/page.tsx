import React from "react";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { cookies } from "next/headers";
import Purchase from "../components/Purchase";
import { redirect } from "next/navigation";
import ErrorResponse from "@/app/common/components/ErrorResponse";
import apiServer from "@/app/utils/apiServer";
import { Command } from "../sell/page";

export default async function PurchasePage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        let {
            data: { data: products },
        } = await apiServer().get("/products/forPurchase");
        const { data: suppliers } = await apiServer().get("suppliers");
        const { data: commandsArray } = await apiServer().get("commands");
        const commands = commandsArray.reduce(
            (obj: Record<string, Command>, command: Command) => {
                obj[command.command.toLocaleLowerCase()] = command;
                return obj;
            },
            {}
        );
        const { data: user } = await apiServer().get(`users/${userId}`);
        const { data: setting } = await apiServer().get(
            `settings/findByUserId/${userId}`
        );
        products = products.map((product: ProductWithID) => {
            product.prices = product.purchasePrices;
            product.measurements = product.purchaseMeasurements;
            return product;
        });

        return (
            <div>
                <Purchase
                    productsArray={products}
                    suppliersArray={suppliers}
                    user={user}
                    commands={commands}
                    setting={setting}
                />
            </div>
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
