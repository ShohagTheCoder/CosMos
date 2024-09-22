import apiClient from "../utils/apiClient";
import Register from "./components/Register";

export default async function RegisterPage() {
    let { data: shop } = await apiClient.get("users/shop");

    if (shop) {
        return (
            <div className="bg-gray-900 h-svh flex justify-center items-center">
                <p>Shop already registered</p>
            </div>
        );
    }

    return <Register />;
}
