import { productArrayToObject } from "../actions/functions/productArrayToObject";
import Tab from "../elements/tab/Tab";
import apiClient from "../utils/apiClient";
import Commands from "./components/Commands";
import Rules from "./components/Rules";

export default async function CommandsPage() {
    const { data: commands } = await apiClient.get("commands");
    const { data: productsArray } = await apiClient.get("products");
    const products = productArrayToObject(
        productsArray,
        (product) => !product.sellEnable
    );

    let tabContents = [
        {
            id: "commands",
            title: "Commands",
            content: <Commands commands={commands} products={products} />,
        },
        {
            id: "rules",
            title: "Rules",
            content: <Rules />,
        },
    ];

    return (
        <div className="w-[800px] mx-auto py-5">
            <Tab
                options={{
                    titleAlignment: "center",
                }}
                tabs={tabContents}
            />
        </div>
    );
}
