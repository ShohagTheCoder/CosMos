"use client";

import TextInput from "@/app/elements/inputs/TextInput";
import apiClient from "@/app/utils/apiClient";
import { useState, FormEvent } from "react";

interface CreateSupplierForm {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export default function CreateSupplier() {
    const [form, setForm] = useState<CreateSupplierForm>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (
        key: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({ ...form, [key]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await apiClient.post("suppliers", form);
            setSuccess("Supplier created successfully!");
            setForm({ name: "", email: "", phoneNumber: "", address: "" });
        } catch (error) {
            setError("Failed to create supplier.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Create Supplier</h1>
                <div className="space-y-4">
                    <TextInput
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e)}
                        options={{
                            label: "Supplier name",
                            placeholder: "Ex: John Doe Supplies",
                        }}
                    />
                    <TextInput
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e)}
                        options={{
                            label: "Supplier email",
                            placeholder: "Ex: john@supplies.com",
                        }}
                    />
                    <TextInput
                        value={form.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e)}
                        options={{
                            label: "Phone number",
                            placeholder: "Ex: +1234567890",
                            validate: (value) => value.length == 11,
                            validMessage: "Number is currect",
                            invalidMessage: "Number is wrong",
                        }}
                    />
                    <TextInput
                        value={form.address}
                        onChange={(e) => handleInputChange("address", e)}
                        options={{
                            label: "Address",
                            placeholder: "Ex: 123 Supplier St.",
                        }}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-500 text-sm">{success}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? "Creating..." : "Create Supplier"}
                    </button>
                </div>
            </div>
        </div>
    );
}
