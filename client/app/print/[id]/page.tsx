import ErrorResponse from "@/app/common/components/ErrorResponse";
import React from "react";
import Print from "../components/Print";
import apiServer from "@/app/utils/apiServer";

export default async function PrintByIdPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = params;

    try {
        const { data: sale } = await apiServer().get(`/sells/${id}`);
        return <Print sale={sale} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
