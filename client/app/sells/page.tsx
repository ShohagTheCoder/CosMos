import apiClient from "../utils/apiClient";
import NoResponse from "../common/components/NoResponse";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sells from "./components/Sells";

export default async function SellsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: sells } = await apiClient.get("sells");
        return <Sells sells={sells} userId={userId} />;
    } catch (error) {
        return <NoResponse />;
    }
}
