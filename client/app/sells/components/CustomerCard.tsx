import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function CustomerCard({ customers }: { customers: any }) {
    const selectedProductIndex = useSelector(
        (state: RootState) => state.cart.selectedProductIndex
    );

    function handleAddCustomer(_id: string) {
        document.getElementById("command")?.focus();
    }

    return (
        <div className="flex flex-wrap gap-3">
            {Object.values(customers).map((customer: any, key: number) => (
                <div
                    key={customer._id}
                    onClick={() => handleAddCustomer(customer._id)}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selectedProductIndex == key
                            ? "bg-green-900"
                            : "bg-black"
                    }`}
                >
                    <img
                        className="w-full h-[200px] w-[200px] object-cover"
                        src="profile-picture.jpg"
                        alt={customer.name}
                    />
                    <div className="p-3">
                        <h2 className="font-semibold text-xl mb-1">
                            {customer.name}
                        </h2>
                        <p className="text-gray-300 text-base">
                            {customer.address.substring(0, 18)}...
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CustomerCard;
