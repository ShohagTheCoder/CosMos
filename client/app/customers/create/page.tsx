import NoResponse from "@/app/common/components/NoResponse";
import Sidebar from "@/app/components/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateCustomer from "./components/CreateCustomer";

export default async function CreateCustomerPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        return (
            <div>
                <Sidebar userId={userId} active="createCustomer" />
                <div>
                    <CreateCustomer />;
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
