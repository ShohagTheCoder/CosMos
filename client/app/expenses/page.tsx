import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ErrorResponse from "../common/components/ErrorResponse";
import Sidebar from "../components/Sidebar";
import ExpensesList from "./components/ExpensesList";

export default async function SellsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        return (
            <div className="ps-[90px]">
                <Sidebar userId={userId} active="reports" />
                <div className="container max-w-[1200px] mx-auto py-4">
                    <ExpensesList />
                </div>
            </div>
        );
    } catch (error) {
        return <ErrorResponse message={error} />;
    }
}
