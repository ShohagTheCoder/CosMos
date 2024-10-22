import React from "react";

interface CartState {
    customer?: { name: string };
}

interface SellPageSelectorProps {
    activePage: string; // Currently active sell page
    cartStates: Record<string, CartState>; // Object containing customer information for different sell pages
    userName: string; // Logged-in user's name
    // eslint-disable-next-line no-unused-vars
    handleSellPageChange: (pageKey: string) => void; // Handler function to change sell page
    productsTotalPrice: number;
}

const SellPageSelector: React.FC<SellPageSelectorProps> = ({
    activePage,
    cartStates,
    userName,
    handleSellPageChange,
    productsTotalPrice,
}) => {
    // Define the buttons and their corresponding labels
    const sellPageButtons = [
        { key: "F5", label: "One" },
        { key: "F6", label: "Two" },
        { key: "F7", label: "Three" },
        { key: "F8", label: "Four" },
    ];

    function getCashReturnLine() {
        let taken = 100;
        let back = 100;
        let count = 0;

        // Calculate the number of 1000 units and update productsTotalPrice
        if (productsTotalPrice > 1000) {
            count = Math.floor(productsTotalPrice / 1000);
            productsTotalPrice %= 1000; // Get remainder of the total
        }

        // Determine the `taken` value based on the product total
        if (productsTotalPrice <= 100) {
            back = taken - productsTotalPrice;
        } else if (productsTotalPrice <= 200) {
            taken = 200;
        } else if (productsTotalPrice <= 500) {
            taken = 500;
        } else {
            taken = 1000;
        }

        // Calculate the back amount
        back = taken - productsTotalPrice;

        return (
            <p className="text-xl">
                {back.toLocaleString("en-US")} (
                {(count * 1000 + taken).toLocaleString("en-US")}) ৳
            </p>
        );
    }

    return (
        <div className="bg-gray-300 dark:bg-gray-950 p-3 border-2 border-dashed border-slate-500 mb-3 md:flex justify-between items-center">
            <div className="flex gap-3 justify-start">
                {sellPageButtons.map(({ key, label }) => (
                    <button
                        key={key}
                        className={`py-1 px-3 ${
                            activePage === key ? "bg-green-700" : ""
                        }`}
                        onClick={() => handleSellPageChange(key)}
                    >
                        {cartStates[key]?.customer?.name || label}
                    </button>
                ))}
            </div>
            <div className=" ps-4 flex flex-wrap justify-end gap-4 items-center">
                {getCashReturnLine()}
                <p className="inline-block bg-green-800 py-1 px-3 rounded text-white">
                    {userName}
                </p>
                <a
                    href="/logout"
                    className="bg-red-800 text-white py-1 px-3 rounded"
                >
                    Logout
                </a>
            </div>
        </div>
    );
};

export default SellPageSelector;
