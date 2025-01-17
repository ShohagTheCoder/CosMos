import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NoResponse from "../common/components/NoResponse";
import Settings from "./components/Settings";
import Sidebar from "../components/Sidebar";
import apiServer from "../utils/apiServer";

export default async function SettingsPage() {
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    try {
        const { data: settings } = await apiServer().get(
            `/settings/findByUserId/${userId}`
        );

        const {
            data: { data: printSetting },
        } = await apiServer().get("/businesses/settings/print");

        return (
            <div>
                <Sidebar active="settings" userId={userId} />
                <div>
                    <Settings settings={settings} printSetting={printSetting} />
                </div>
            </div>
        );
    } catch (error) {
        return <NoResponse />;
    }
}
