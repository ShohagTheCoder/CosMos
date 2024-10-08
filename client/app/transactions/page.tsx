import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Transactions from "./components/Transactions";
import apiServer from "../utils/apiServer";
import ErrorResponse from "../common/components/ErrorResponse";
import Sidebar from "../components/Sidebar";

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
        return (
            <div>
                <Sidebar userId={userId} active="reports" />
                <div>
                    <Transactions
                        totalDocuments={totalDocuments}
                        userId={userId}
                    />
                </div>
            </div>
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
