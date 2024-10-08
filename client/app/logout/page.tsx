"use client";
import React from "react";
import { logout } from "../utils/auth";
import PulseLoading from "../elements/loding/PulseLoading";

export default function LogoutPage() {
    logout();
    return (
        <div className="h-screen flex justify-center items-center">
            <PulseLoading />
        </div>
    );
}
