"use client";

import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient("users");
                const users = response.data;

                setUsers(users);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6">
            <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                        >
                            <div className="relative">
                                {/* Example image - replace with actual image URL */}
                                <img
                                    src="/images/product.jpg"
                                    alt={user.name}
                                    className="h-60 w-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">
                                    {user.name}
                                </h3>
                                <p className="text-gray-400">{user.email}</p>
                                <p className="text-sm text-gray-500">
                                    {user.role}
                                </p>
                                <div className="flex justify-between mt-4">
                                    <Link
                                        href={`/users/${user._id}`}
                                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        View
                                    </Link>
                                    <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
