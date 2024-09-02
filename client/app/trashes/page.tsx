"use client";

import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";
import Notification, {
    NotificationProps,
} from "../elements/notification/Notification";
import { ERROR, SUCCESS } from "../utils/constants/message";

interface Trash {
    _id: string;
    source: string;
    data: any;
}

export default function Trashes() {
    const [trashes, setTrashes] = useState<Trash[]>([]);
    const [notification, setNotification] = useState<NotificationProps>({
        type: "none",
        message: "This is a notification",
    });

    useEffect(() => {
        const fetchTrashes = async () => {
            try {
                const response = await apiClient.get("trash");
                const trashes = response.data;

                setTrashes(trashes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTrashes();
    }, []);

    async function handleTrashRestore(trash: Trash, index: number) {
        try {
            await apiClient.get(`trash/restore/${trash._id}`);
            setNotification({
                type: SUCCESS,
                message: `${trash.source} restored successfully`,
            });
            setTrashes((prevTrash) => [
                ...prevTrash.slice(0, index),
                ...prevTrash.slice(index + 1),
            ]);
        } catch (error) {
            setNotification({
                type: ERROR,
                message: `Faild to restore ${trash.source}`,
            });
        }
    }

    return (
        <main className="bg-gray-900 text-white min-h-screen p-6">
            <div className="container mx-auto">
                <Notification
                    type={notification.type}
                    message={notification.message}
                />
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
                                                    handleTrashRestore(
                                                        trash,
                                                        index
                                                    )
                                                }
                                                className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                            >
                                                Restore
                                            </button>
                                            <button className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
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
