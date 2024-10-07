import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import Sidebar from "../components/Sidebar";
import apiClient from "../utils/apiClient";
import Trashes from "./components/Trashes";
import apiServer from "../utils/apiServer";

export default async function TrashesPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: trashes } = await apiServer.get("trash");
        return (
            <div>
                <Sidebar userId={userId} active="trashes" />
                <div>
                    <Trashes trashes={trashes} />
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
