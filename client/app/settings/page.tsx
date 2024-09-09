"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

interface Settings {
    darkTheme: boolean;
    enableDue: boolean;
    enableReturn: boolean;
    enableAccounts: boolean;
}

function Settings() {
    return (
        <main>
            <Sidebar active={"settings"} />
            <div className="max-w-[600px] mx-auto my-5 pt-5 ps-6 pe-6 pb-1 bg-slate-800 rounded">
                <p>Settings</p>
            </div>
        </main>
    );
}

export default Settings;
