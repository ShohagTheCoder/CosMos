import ErrorResponse from "@/app/common/components/ErrorResponse";
import React from "react";
import Print from "../components/Print";
import apiServer from "@/app/utils/apiServer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrintByIdPage({
    params,
}: {
    params: { id: string };
}) {
    // Authenticate
    const cookiesList = cookies();
    const userId = cookiesList.get("user-id")?.value;

    if (!userId) {
        return redirect("/login"); // Use redirect from next/navigation
    }

    // Get param id
    const { id } = params;

    // Try catch block
    try {
        const {
            data: { data: printSetting },
        } = await apiServer().get("/businesses/get/setting/print");
        const { data: sale } = await apiServer().get(`/sells/${id}`);
        return <Print sale={sale} printSetting={printSetting} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
