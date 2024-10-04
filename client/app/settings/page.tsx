import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import apiClient from "../utils/apiClient";
import Settings from "./components/Settings";
import Sidebar from "../components/Sidebar";

export default async function SettingsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: settings } = await apiClient.get(
            `/settings/findByUserId/${userId}`
        );
        return (
            <div>
                <Sidebar active="settings" userId={userId} />
                <div>
                    <Settings settings={settings} />
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
