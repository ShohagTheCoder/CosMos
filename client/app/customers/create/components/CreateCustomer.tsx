"use client";
import ImageInput from "@/app/elements/inputs/ImageInput";
import TextInput from "@/app/elements/inputs/TextInput";
import handleImageUpload from "@/app/functions/handleImageUpload";
import apiClient from "@/app/utils/apiClient";
import { useState, FormEvent } from "react";

interface CreateCustomerForm {
    name: string;
    address: string;
    phoneNumber: string;
    image: string;
}

export default function CreateCustomer() {
    const [form, setForm] = useState<CreateCustomerForm>({
        name: "Shohag Ahmed",
        address: "Bangladesh",
        phoneNumber: "01400901280",
        image: "",
    });

    const [image, setImage] = useState<File | null>(null);
    // eslint-disable-next-line no-unused-vars
    const [initialImage, setInitialImage] = useState<File | null>(null); // To track initial image for change detection

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
            let customer = { ...form };
            // Check if the image has changed
            if (image && image !== initialImage) {
                customer.image = form.phoneNumber + "-" + image?.name;
                await handleImageUpload(image, {
                    url: "/api/uploads/images/customers",
                    fieldName: "image",
                    updateFileNameCallback: () => customer.image,
                });
            }
            const { data } = await apiClient.post("/customers", customer);
            console.log(data);

            setSuccess("Customer created successfully!");
            setForm({
                name: "",
                address: "",
                phoneNumber: "",
                image: "",
            });
            setImage(null); // Reset image after submission
        } catch (error) {
            setError("Failed to create customer.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Create Customer</h1>
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
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? "Creating..." : "Create Customer"}
                    </button>
                </div>
            </div>
        </div>
    );
}
