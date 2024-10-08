import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import apiServer from "../utils/apiServer";
import ErrorResponse from "../common/components/ErrorResponse";
import Sidebar from "../components/Sidebar";
import PurchasesList from "../components/common/PurchasesList";

export default async function PurchasesPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        return (
            <div className="ps-90px">
                <Sidebar userId={userId} active="reports" />
                <div className="container max-w-[1200px] mx-auto py-4">
                    <PurchasesList />
                </div>
            </div>
        );
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
