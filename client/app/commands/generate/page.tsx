"use client";
import apiClient from "@/app/utils/apiClient";
import React, { useState } from "react";

export default function GenerateCommandsPage() {
    // State to control number input and success message
    const [maxNumber, setMaxNumber] = useState(100);
    const [letterPattern, setLetterPattern] = useState("Single"); // Single (A-Z), Double (AA-ZZ)
    const [successMessage, setSuccessMessage] = useState("");

    // Generate commands based on input
    const generateCommands = () => {
        const numberCommands = Array.from({ length: maxNumber }, (_, i) => ({
            command: (i + 1).toString(),
            type: null,
            value: null,
        }));

        const letterCommands = [];
        const generateLetters = (length: number) => {
            const letters = [];
            for (let i = 0; i < Math.pow(26, length); i++) {
                let command = "";
                let n = i;
                for (let j = 0; j < length; j++) {
                    command = String.fromCharCode(65 + (n % 26)) + command;
                    n = Math.floor(n / 26);
                }
                letters.push(command);
            }
            return letters;
        };

        // Choose the letter pattern based on user input
        if (letterPattern === "Single") {
            letterCommands.push(...generateLetters(1)); // A-Z
        } else if (letterPattern === "Double") {
            letterCommands.push(...generateLetters(2)); // AA-ZZ
        }

        const letterCommandObjects = letterCommands.map((command) => ({
            command,
            type: null,
            value: null,
        }));

        // Combine number and letter commands
        return [...numberCommands, ...letterCommandObjects];
    };

    // Handle command generation
    async function handleGenerateCommands() {
        const commands = generateCommands();
        try {
            let { data } = await apiClient.post(
                "commands/create-many",
                commands
            );
            setSuccessMessage("Commands generated successfully!");
        } catch (error) {
            setSuccessMessage("An error occurred while generating commands.");
        }
    }

    return (
        <div className="mx-auto p-5 bg-gray-900 text-white h-screen flex flex-col gap-4 justify-center items-center">
            <div className="bg-gray-800 rounded-lg">
                <div className="p-6 border-b-2 border-gray-700">
                    <h1 className="text-3xl font-bold text-center">
                        Generate Commands
                    </h1>
                </div>
                <div className="flex justify-center mb-5 p-6">
                    <div className="mr-4">
                        <label className="block mb-2">
                            Max Number (1 - 1000):
                        </label>
                        <input
                            type="number"
                            className="border border-gray-600 bg-gray-800 rounded px-3 py-2 text-white"
                            value={maxNumber}
                            min={1}
                            max={1000}
                            onChange={(e) =>
                                setMaxNumber(Number(e.target.value))
                            }
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Letter Pattern:</label>
                        <select
                            className="border border-gray-600 bg-gray-800 rounded px-3 py-2 text-white"
                            value={letterPattern}
                            onChange={(e) => setLetterPattern(e.target.value)}
                        >
                            <option value="Single">A-Z (Single)</option>
                            <option value="Double">AA-ZZ (Double)</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col justify-center px-6 pb-6">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                        onDoubleClick={handleGenerateCommands}
                    >
                        Generate
                    </button>
                    {successMessage && (
                        <div className="mt-5 text-center text-green-500">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center gap-4">
                <a className="text-blue-500" href="/">
                    Home
                </a>
                <a className="text-blue-500" href="/actions/sell">
                    Sell
                </a>
            </div>
        </div>
    );
}
