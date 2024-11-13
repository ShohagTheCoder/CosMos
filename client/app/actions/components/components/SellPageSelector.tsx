import React from "react";

interface CartState {
    customer?: { name: string };
}

interface SellPageSelectorProps {
    activePage: string; // Currently active sell page
    cartStates: Record<string, CartState>; // Object containing customer information for different sell pages
    userName: string; // Logged-in user's name
    // eslint-disable-next-line no-unused-vars
    handlePageChange: (pageKey: string) => void; // Handler function to change sell page
    productsTotalPrice: number;
}

const SellPageSelector: React.FC<SellPageSelectorProps> = ({
    activePage,
    cartStates,
    userName,
    handlePageChange,
    productsTotalPrice,
}) => {
    // Define the buttons and their corresponding labels
    const sellPageButtons = [
        { key: "F5", label: "1" },
        { key: "F6", label: "2" },
        { key: "F7", label: "3" },
        { key: "F8", label: "4" },
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
            <div className="flex">
                <div className="bg-red-900 py-1 px-2">
                    <p className="text-xl leading-normal">
                        {back.toLocaleString("en-US")}
                    </p>{" "}
                </div>
                <div className="bg-green-900 px-2 py-1">
                    <p className="text-xl leading-normal">
                        {(count * 1000 + taken).toLocaleString("en-US")}
                    </p>{" "}
                </div>
            </div>
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
                        onClick={() => handlePageChange(key)}
                    >
                        {cartStates[key]?.customer?.name || label}
                    </button>
                ))}
            </div>
            <div className="md:border-s-2 border-dashed border-gray-600 ps-3 flex flex-wrap justify-end gap-2 items-center">
                {getCashReturnLine()}
                <p className="inline-block bg-gray-700 py-2 px-3 text-white">
                    {userName}
                </p>
            </div>
        </div>
    );
};

export default SellPageSelector;
