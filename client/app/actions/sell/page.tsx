import React from "react";
import Sell from "../components/Sell";
import { CustomerWithId } from "@/app/interfaces/customer.inerface";
import { getCustomersInServer } from "./../functions/apiHandlers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation"; // Import redirect
import ErrorResponse from "@/app/common/components/ErrorResponse";
import apiServer from "@/app/utils/apiServer";

export interface Command {
    command: string;
    type: string;
    value: string;
}

export default async function SellPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const {
            data: { data: products },
        } = await apiServer().get("/products");
        const customers: CustomerWithId[] = await getCustomersInServer();
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

        return (
            <div>
                <Sell
                    productsArray={products}
                    customersArray={customers}
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
