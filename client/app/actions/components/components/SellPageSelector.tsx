import React from "react";

interface CartState {
    customer?: { name: string };
}

interface SellPageSelectorProps {
    activeSellPage: string; // Currently active sell page
    cartStates: Record<string, CartState>; // Object containing customer information for different sell pages
    userName: string; // Logged-in user's name
    // eslint-disable-next-line no-unused-vars
    handleSellPageChange: (pageKey: string) => void; // Handler function to change sell page
    logout: () => void; // Function to handle logout
}

const SellPageSelector: React.FC<SellPageSelectorProps> = ({
    activeSellPage,
    cartStates,
    userName,
    handleSellPageChange,
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
                            activeSellPage === key ? "bg-green-700" : ""
                        }`}
                        onClick={() => handleSellPageChange(key)}
                    >
                        {cartStates[key]?.customer?.name || label}
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

export default SellPageSelector;
