import { cookies } from "next/headers";
import { productArrayToObject } from "../actions/functions/productArrayToObject";
import Sidebar from "../components/Sidebar";
import Tab from "../elements/tab/Tab";
import Commands from "./components/Commands";
import Rules from "./components/Rules";
import NoResponse from "../common/components/NoResponse";
import { redirect } from "next/navigation";
import apiServer from "../utils/apiServer";

export default async function CommandsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const cookieStore = cookies();
        const userId = cookieStore.get("user-id")?.value;
        const { data: commands } = await apiServer.get("commands");
        const {
            data: { data: productsArray },
        } = await apiServer.get("products");
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
            <div className="w-full ps-[94px] pe-3 py-4 bg-gray-800">
                <Sidebar active="commands" userId={userId} />
                <Tab
                    options={{
                        titleAlignment: "center",
                    }}
                    tabs={tabContents}
                />
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
