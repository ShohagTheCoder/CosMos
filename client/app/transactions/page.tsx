import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import apiClient from "../utils/apiClient";
import Transactions from "./components/Transactions";

export default async function TransactionsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: totalDocuments } = await apiClient.get(
            "transactions/countDocuments"
        );
        return <Transactions totalDocuments={totalDocuments} userId={userId} />;
    } catch (error) {
        return <NoResponse />;
    }
}
