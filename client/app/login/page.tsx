"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("Anis Ahmed");
    const [password, setPassword] = useState("pass");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const { data } = await axios.post("/api/auth", {
                username,
                password,
            });

            if (data.status === "success") {
                window.location.href =
                    process.env.NEXT_PUBLIC_CLIENT_BASE_URL ||
                    "http://localhost:3000";
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("An error occurred during login.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-300">
            {/* Left Side Image */}
            {/* <div
                className="w-1/2 h-screen bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/common/pc-bg.jpg")' }}
            ></div> */}

            {/* Right Side Login Form */}
            <div
                className="w-full flex justify-center items-center"
                style={{
                    backgroundImage: 'url("/images/common/vb-bg.jpg")',
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                }}
            >
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm p-8 bg-gray-800 shadow-lg rounded-lg"
                >
                    <div className="mb-4">
                        <label
                            className="block text-gray-400 text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-300 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-400 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs italic">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign In
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-4">
                        <span className="text-gray-400">OR</span>
                        <div className="flex gap-2">
                            <a
                                href="/"
                                className="text-blue-400 hover:text-blue-600"
                            >
                                Home
                            </a>
                            <a
                                href="/actions/sell"
                                className="text-blue-400 hover:text-blue-600"
                            >
                                Sell
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
