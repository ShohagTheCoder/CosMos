import React from "react";
import ReloadButton from "./ReloadButton";

export default function NoResponse() {
    return (
        <div className="flex flex-col gap-3 justify-center items-center h-screen">
            <p className="text-center text-white">
                Server is not running <br /> or somthing went wrong!
            </p>
            <ReloadButton text="Retry" />
        </div>
    );
}
