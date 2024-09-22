"use client";
import apiClient from "@/app/utils/apiClient";
import React from "react";

export default function GenerateCommandsPage() {
    const generateCommands = () => {
        const numberCommands = Array.from({ length: 99 }, (_, i) => ({
            command: (i + 1).toString(),
            type: null,
            value: null,
        }));

        const letterCommands = Array.from({ length: 26 }, (_, i) => ({
            command: String.fromCharCode(65 + i), // A-Z
            type: null,
            value: null,
        }));

        // Combine number and letter commands
        return [...numberCommands, ...letterCommands];
    };

    const commands = generateCommands();

    async function handleGenerateCommands() {
        try {
            let { data } = await apiClient.post(
                "commands/create-many",
                commands
            );
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mx-auto">
            <div className="mt-20 flex justify-center">
                <button onDoubleClick={handleGenerateCommands}>Generate</button>
            </div>
        </div>
    );
}
