import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Sells from "./components/Sells";
import ErrorResponse from "../common/components/ErrorResponse";
import apiServer from "../utils/apiServer";

export default async function SellsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: sells } = await apiServer().get("sells");
        return <Sells sells={sells} userId={userId} />;
    } catch (error) {
        return <ErrorResponse message={error} />;
    }
}
