"use client";
import NotificationList from "@/app/elements/notification/NotificationList";
import useNotifications from "@/app/hooks/useNotifications";
import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import { useState } from "react";

interface Trash {
    _id: string;
    source: string;
    data: any;
    connect?: string;
}

export default function Trashes({ trashes: _trashes }: any) {
    const [trashes, setTrashes] = useState<Trash[]>(_trashes);
    const { notifications, notifyError, notifySuccess } = useNotifications();

    async function handleTrashRestore(trash: Trash) {
        const connect = trash.connect;

        try {
            await apiClient.get(`trash/restore/${trash._id}`);
            notifySuccess(`${trash.source} restored successfully`);
            // Create a new array to update the state
            let updatedTrashes = [...trashes];

            // If `connect` is defined, filter out items with the same `connect` value
            if (connect) {
                updatedTrashes = updatedTrashes.filter(
                    (item) => item.connect !== connect
                );
            } else {
                // If no `connect`, only remove the restored item itself
                updatedTrashes = updatedTrashes.filter(
                    (item) => item._id !== trash._id
                );
            }

            // Update the state with the new array
            setTrashes(updatedTrashes);
        } catch (error) {
            notifyError(error);
        }
    }

    function handleDelete(trash: Trash) {
        const connect = trash.connect;
        const sure = window.confirm(
            `Are you sure you want to delete ${
                connect ? "all connected items" : "this item"
            }?`
        );
        if (!sure) return;

        apiClient
            .delete(`trash/${trash._id}`)
            .then(() => {
                notifySuccess(`${trash.source} deleted successfully`);

                // Create a new array excluding the deleted item(s)
                let updatedTrashes = [...trashes];

                // If `connect` is defined, remove all connected items
                if (connect) {
                    updatedTrashes = updatedTrashes.filter(
                        (item) => item.connect !== connect
                    );
                } else {
                    // If no `connect`, only remove the item itself
                    updatedTrashes = updatedTrashes.filter(
                        (item) => item._id !== trash._id
                    );
                }

                // Update the state with the filtered array
                setTrashes(updatedTrashes);
            })
            .catch((error) => {
                notifyError(error);
            });
    }

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6 ps-[90px]">
            <div className="container mx-auto">
                <NotificationList notifications={notifications} />
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th className="py-2 px-4 text-left">Source</th>
                                <th className="py-2 px-4 text-left">Data</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trashes.map((trash, index) => (
                                <tr
                                    key={trash._id}
                                    className="border-b border-gray-700 hover:bg-gray-700"
                                >
                                    <td className="py-3 px-4">
                                        {trash.source}
                                    </td>
                                    <td className="py-3 px-4">
                                        {JSON.stringify(trash.data).substring(
                                            0,
                                            100
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex justify-center space-x-2">
                                            <Link
                                                href={`/trashes/${trash._id}`}
                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onDoubleClick={() =>
                                                    handleTrashRestore(trash)
                                                }
                                                className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onDoubleClick={() =>
                                                    handleDelete(trash)
                                                }
                                                className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Delete
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
