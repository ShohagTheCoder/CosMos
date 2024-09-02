"use client";

import TextInput from "@/app/elements/inputs/TextInput";
import apiClient from "@/app/utils/apiClient";
import { useState, FormEvent } from "react";

interface CreateUserForm {
    name: string;
    email: string;
    password: string;
    role: string;
}

export default function CreateUser() {
    const [form, setForm] = useState<CreateUserForm>({
        name: "",
        email: "",
        password: "",
        role: "user",
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
            await apiClient.post("/users", form);
            setSuccess("User created successfully!");
            setForm({ name: "", email: "", password: "", role: "user" });
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
                <h1 className="text-2xl font-bold mb-6">Create User</h1>
                <div className="space-y-4">
                    <TextInput
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e)}
                        options={{
                            label: "User name",
                            placeholder: "Ex: Shohag Ahmed",
                        }}
                    />
                    <TextInput
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e)}
                        options={{
                            label: "User email",
                            placeholder: "Ex: shohag@gmail.com",
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
                    <div>
                        <label
                            htmlFor="role"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Role
                        </label>
                        <select
                            name="role"
                            id="role"
                            value={form.role}
                            onChange={(e) => handleInputChange("role", e)}
                            required
                            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-500 text-sm">{success}</p>
                    )}

                    <button
                        onDoubleClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? "Creating..." : "Create User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
