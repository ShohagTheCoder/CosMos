import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import apiClient from "../utils/apiClient";
import Products from "./components/Products";

export default async function ProductsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: products } = await apiClient.get("products");
        return <Products products={products} userId={userId} />;
    } catch (error) {
        return <NoResponse />;
    }
}
