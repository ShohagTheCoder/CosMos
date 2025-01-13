import React from "react";
import ErrorResponse from "../common/components/ErrorResponse";

export default function PrintPage() {
    try {
        // const id = useParams().id;
        return <div>Hello</div>;
        // return <Print id={id} />;
    } catch (error: any) {
        return <ErrorResponse message={error.message} />;
    }
}
