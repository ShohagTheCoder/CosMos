import Sidebar from "@/app/components/Sidebar";
import NoResponse from "@/app/common/components/NoResponse";
import { cookies } from "next/headers";
import apiClient from "@/app/utils/apiClient";
import UpdateProduct from "./components/UpdateProduct";
import apiServer from "@/app/utils/apiServer";

export default async function UpdateProductPage({ params }: any) {
    const { id } = params;

    try {
        const { data: product } = await apiServer().get(`products/${id}`);
        const cookieStore = cookies();
        const userId = cookieStore.get("user-id")?.value;

        return (
            <div className="min-h-screen max-auto flex justify-center bg-gray-800">
                <Sidebar userId={userId} active="createProduct" />
                <div className="container w-auto inline-block transition-all my-5 mx-auto rounded-md bg-gray-800 text-white">
                    <UpdateProduct product={product} />
                </div>
            </div>
        );
    } catch (error) {
        <NoResponse />;
    }
}
