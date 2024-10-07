"use client";

import Tab from "@/app/elements/tab/Tab";
import { useState } from "react";
import Details from "./components/Details";
import Permissions from "./components/Permissions";

interface CreateUserForm {
    name: string;
    phoneNumber: string;
    password: string;
    permissions: { [key: string]: boolean };
}

export default function CreateUser() {
    const [form, setForm] = useState<CreateUserForm>({
        name: "",
        phoneNumber: "",
        password: "",
        permissions: {
            sale: true,
            purchase: false,
            dashboard: false,
            cashout: false,
            sendMoney: true,
            trashes: false,
            products: true,
        },
    });

    const handleInputChange = (
        key: string,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [key]: e.target.value });
    };

    const handleCheckboxChange = (key: string, checked: boolean) => {
        setForm((prevForm) => ({
            ...prevForm,
            permissions: {
                ...prevForm.permissions,
                [key]: checked,
            },
        }));
    };

    let tabContents = [
        {
            id: "details",
            title: "Details",
            content: (
                <Details handleInputChange={handleInputChange} form={form} />
            ),
        },
        {
            id: "permissions",
            title: "Permissions",
            content: (
                <Permissions
                    handleCheckboxChange={handleCheckboxChange}
                    form={form}
                    setForm={setForm}
                />
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="w-[500px] mx-auto">
                <Tab
                    tabs={tabContents}
                    options={{
                        navigator: true,
                        titleAlignment: "center",
                        classes: {
                            container: "min-h-[500px]",
                        },
                    }}
                />
            </div>
        </div>
    );
}
