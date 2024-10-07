import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Products from "./components/Products";
import ErrorResponse from "../common/components/ErrorResponse";
import apiServer from "../utils/apiServer";

export default async function ProductsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: totalDocuments } = await apiServer().get(
            `/products/countDocuments`
        );

        return <Products totalDocuments={totalDocuments} userId={userId} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
