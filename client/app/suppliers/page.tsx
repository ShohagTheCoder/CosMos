"use client";

import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";
import Notification, {
    NotificationProps,
} from "../elements/notification/NotificationList";
import { ERROR, SUCCESS } from "../utils/constants/message";

interface Supplier {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    products: string[];
}

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [notification, setNotification] = useState<NotificationProps>({
        type: "none",
        message: "This is a notification",
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await apiClient("suppliers");
                const suppliers = response.data;

                setSuppliers(suppliers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSuppliers();
    }, []);

    async function handleSupplierDelete(_id: string, key: number) {
        const confirm = window.confirm("Are you sure to delete the supplier");

        if (confirm) {
            try {
                const response = await apiClient.delete(`suppliers/${_id}`);
                setSuppliers((state) =>
                    state.filter((_, index) => index !== key)
                );
                setNotification({
                    type: SUCCESS,
                    message: `Supplier deleted successfully`,
                });
                console.log(response.data);
            } catch (error) {
                setNotification({
                    type: ERROR,
                    message: `Faild to delete supplier`,
                });
                console.error(error);
            }
        }
    }

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6">
            <div className="container mx-auto">
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
                <div className="mb-4">
                    <Link href={"/suppliers/create"}>Create</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Phone</th>
                                <th className="py-2 px-4 text-left">Address</th>
                                <th className="py-2 px-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, key) => (
                                <tr
                                    key={supplier._id}
                                    className="border-b border-gray-700 hover:bg-gray-700"
                                >
                                    <td className="py-3 px-4">
                                        {supplier.name}
                                    </td>
                                    <td className="py-3 px-4">
                                        {supplier.email}
                                    </td>
                                    <td className="py-3 px-4">
                                        {supplier.phoneNumber}
                                    </td>
                                    <td className="py-3 px-4">
                                        {supplier.address}
                                    </td>
                                    <td className="">
                                        <div className="flex justify-end space-x-2 px-3">
                                            <Link
                                                href={`/suppliers/${supplier._id}`}
                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/suppliers/update/${supplier._id}`}
                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                Update
                                            </Link>
                                            <button
                                                onDoubleClick={() =>
                                                    handleSupplierDelete(
                                                        supplier._id,
                                                        key
                                                    )
                                                }
                                                className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
