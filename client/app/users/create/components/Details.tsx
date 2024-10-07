import TextInput from "@/app/elements/inputs/TextInput";
import React from "react";

export default function Details({
    handleInputChange,
    form,
    handleSubmit,
}: any) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Create User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e)}
                    options={{
                        label: "Full name",
                        placeholder: "Ex: Shohag Ahmed",
                    }}
                />
                <TextInput
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e)}
                    options={{
                        label: "Phone Number",
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
            </form>
        </div>
    );
}
