"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

function CreateCustomer() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [message, setMessage] = useState({
        type: "",
        message: "",
    });

    async function handleAddCustomer() {
        try {
            const { data } = await apiClient.post("customers", {
                name,
                email,
                address,
                phoneNumber,
            });
            console.log(data);
            setMessage({
                type: "success",
                message: "Customer created successfully",
            });
        } catch (error) {
            console.log(error);
            setMessage({
                type: "error",
                message: "Faild to create customer",
            });
        }
    }

    return (
        <div className="container mx-auto">
            <div className="box max-w-[400px] mt-4 mx-auto p-4 bg-gray-900">
                {message.type == "error" ? (
                    <div className="error mb-3 px-4 py-3 rounded-lg bg-red-800">
                        <p className="text-white">{message.message}</p>
                    </div>
                ) : (
                    ""
                )}
                {message.type == "success" ? (
                    <div className="success mb-3 rounded-lg px-4 py-3 bg-green-800">
                        <p className="text-white">{message.message}</p>
                    </div>
                ) : (
                    ""
                )}
                <input
                    type="text"
                    placeholder="Enter your name here"
                    className="w-full mb-3 px-4 py-2 border bg-gray-700 border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out text-gray-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Enter your email here"
                    className="w-full mb-3 px-4 py-2 border bg-gray-700 border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out text-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter address text here"
                    className="w-full mb-3 px-4 py-2 border bg-gray-700 border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out text-gray-300"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter your phone number here"
                    className="w-full mb-3 px-4 py-2 border bg-gray-700 border-gray-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out text-gray-300"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <div className="flex justify-center">
                    <button
                        onDoubleClick={handleAddCustomer}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                    >
                        Click Me
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCustomer;
