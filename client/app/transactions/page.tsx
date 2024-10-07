import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import apiClient from "../utils/apiClient";
import Transactions from "./components/Transactions";
import apiServer from "../utils/apiServer";
import ErrorResponse from "../common/components/ErrorResponse";

export default async function TransactionsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: totalDocuments } = await apiServer().get(
            "transactions/countDocuments"
        );
        return <Transactions totalDocuments={totalDocuments} userId={userId} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
