import { StockState } from "@/app/store/slices/stockSlice";
import React from "react";

interface CartState {
    customer?: { name: string };
}

interface PurchasePageSelectorProps {
    activePage: string; // Currently active sell page
    stockStates: Record<string, StockState>; // Object containing customer information for different sell pages
    userName: string; // Logged-in user's name
    // eslint-disable-next-line no-unused-vars
    handlePageChange: (pageKey: string) => void; // Handler function to change sell page
    logout: () => void; // Function to handle logout
}

const PurchasePageSelector: React.FC<PurchasePageSelectorProps> = ({
    activePage,
    stockStates,
    userName,
    handlePageChange,
    logout,
}) => {
    // Define the buttons and their corresponding labels
    const sellPageButtons = [
        { key: "F5", label: "One" },
        { key: "F6", label: "Two" },
        { key: "F7", label: "Three" },
        { key: "F8", label: "Four" },
    ];

    return (
        <div className="bg-gray-300 dark:bg-gray-950 p-3 border-2 border-dashed border-slate-500 mb-3 md:flex justify-between items-center">
            <div className="flex gap-3 justify-start">
                {sellPageButtons.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`py-1 px-3 ${
                            activePage === key ? "bg-green-700" : ""
                        }`}
                        onClick={() => handlePageChange(key)}
                    >
                        {stockStates[key]?.supplier?.name || label}
                    </button>
                ))}
            </div>
            <div className="md:border-s-2 border-dashed border-gray-600 ps-4 flex flex-wrap justify-end gap-4 items-center">
                <p className="inline-block bg-green-800 py-1 px-3 rounded text-white">
                    {userName}
                </p>
                <button
                    onDoubleClick={logout}
                    className="bg-red-800 text-white py-1 px-3 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default PurchasePageSelector;