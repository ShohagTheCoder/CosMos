"use client";
import ImageInput from "@/app/elements/inputs/ImageInput";
import TextInput from "@/app/elements/inputs/TextInput";
import handleImageUpload from "@/app/functions/handleImageUpload";
import apiClient from "@/app/utils/apiClient";
import React, { useEffect, useState, FormEvent } from "react";

interface UpdateCustomerForm {
    name: string;
    address: string;
    phoneNumber: string;
    image: string;
}

export default function UpdateCustomer({ params }: any) {
    const { id } = params;

    const [form, setForm] = useState<UpdateCustomerForm>({
        name: "",
        address: "",
        phoneNumber: "",
        image: "",
    });

    const [image, setImage] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | null>(null); // For tracking the initial image

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const { data } = await apiClient.get(`/customers/${id}`);
                setForm({
                    name: data.name,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    image: data.image,
                });
                setInitialImage(data.image);
            } catch (error) {
                setError("Failed to load customer details.");
                console.error(error);
            }
        };

        fetchCustomer();
    }, [id]);

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
            let updatedCustomer = { ...form };
            // Check if a new image has been selected
            if (image) {
                updatedCustomer.image = form.phoneNumber + "-" + image?.name;
                await handleImageUpload(image, {
                    url: "/api/uploads/images/customers",
                    fieldName: "image",
                    updateFileNameCallback: () => updatedCustomer.image,
                });
            }

            const { data } = await apiClient.patch(
                `/customers/${id}`,
                updatedCustomer
            );
            console.log(data);

            setSuccess("Customer updated successfully!");
        } catch (error) {
            setError("Failed to update customer.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Update Customer</h1>
                <div className="space-y-4">
                    <TextInput
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e)}
                        options={{
                            label: "Full name",
                            placeholder: "Ex: Shohag Ahmed",
                        }}
                    />
                    <TextInput
                        value={form.address}
                        onChange={(e) => handleInputChange("address", e)}
                        options={{
                            label: "Address",
                            placeholder: "Ex: 123 Street Name",
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

                    {/* Image Input */}
                    <ImageInput
                        image={image}
                        callback={(file: File) => {
                            setImage(file);
                        }}
                        options={{
                            label: "Customer image",
                            containerClassName: "!h-[100px] !w-[100px]",
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
                        {loading ? "Updating..." : "Update Customer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
