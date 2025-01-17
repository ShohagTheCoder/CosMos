import ErrorResponse from "../common/components/ErrorResponse";
import apiServer from "../utils/apiServer";
import Register from "./components/Register";

export default async function RegisterPage() {
    try {
        apiServer().post("/businesses/", {});
        return <Register />;
        // let { data: shopExist } = await apiServer().get("users/shopExist");

        // if (shopExist) {
        //     return (
        //         <div className="bg-gray-900 h-svh flex justify-center items-center">
        //             <p>Shop already registered</p>
        //         </div>
        //     );
        // }
    } catch (error: any) {
        <ErrorResponse message={error.message} />;
    }
}
