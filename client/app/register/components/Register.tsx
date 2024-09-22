"use client";

import TextInput from "@/app/elements/inputs/TextInput";
import apiClient from "@/app/utils/apiClient";
import { useState, FormEvent, useEffect } from "react";

interface CreateUserForm {
    shopName: string;
    name: string;
    phoneNumber: string;
    password: string;
}

export default function Register() {
    const [form, setForm] = useState<CreateUserForm>({
        shopName: "",
        name: "",
        phoneNumber: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (
        key: string,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [key]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await apiClient.post("register", form);
            setSuccess("User created successfully!");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setError("Failed to create user.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Register Shop</h1>
                <div className="space-y-4">
                    <TextInput
                        value={form.shopName}
                        onChange={(e) => handleInputChange("shopName", e)}
                        options={{
                            label: "Shop name",
                            placeholder: "Ex: Shohag Store",
                        }}
                    />
                    <TextInput
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e)}
                        options={{
                            label: "Owner name",
                            placeholder: "Ex: Shohag Ahmed",
                        }}
                    />

                    <TextInput
                        value={form.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e)}
                        options={{
                            label: "Phone number",
                            placeholder: "Ex: 01400901280",
                        }}
                    />
                    <TextInput
                        value={form.password}
                        onChange={(e) => handleInputChange("password", e)}
                        options={{
                            label: "Password",
                            placeholder: "Ex: 31GSLEK#",
                        }}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-500 text-sm">{success}</p>
                    )}

                    <button
                        onDoubleClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}
