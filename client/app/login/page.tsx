// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("Foysal Ahmed");
    const [password, setPassword] = useState("pass");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const { data } = await axios.post("/api/auth", {
                username,
                password,
            });

            if (data.success) {
                // Redirect to sell page on successful login
                window.location.href = "/actions/sell";
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("An error occurred during login.");
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-center gap-4">
                <a
                    href="/"
                    className="py-2 px-4 bg-gray-700 hover:bg-green-700 rounded-md"
                >
                    Home
                </a>
                <a
                    href="/actions/sell"
                    className="py-2 px-4 bg-gray-700 hover:bg-green-700 rounded-md"
                >
                    Sell
                </a>
            </div>
            <div className="flex justify-center items-center h-screen">
                <form onSubmit={handleSubmit} className="w-full max-w-sm">
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs italic">{error}</p>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
