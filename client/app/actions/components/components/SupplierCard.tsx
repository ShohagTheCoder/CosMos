import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SupplierCard({ customers }: { customers: any }) {
    const selectedProductIndex = useSelector(
        (state: RootState) => state.cart.selectedProductIndex
    );

    function handleAddCustomer() {
        document.getElementById("command")?.focus();
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {Object.values(customers).map((customer: any, key: number) => (
                <div
                    key={customer._id}
                    onClick={() => handleAddCustomer()}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selectedProductIndex == key
                            ? "bg-green-900"
                            : "bg-black"
                    }`}
                >
                    <img
                        className="h-[240px] w-full object-cover"
                        src="/profile-picture.jpg"
                        alt={customer.name}
                    />
                    <div className="p-3">
                        <h2 className="font-semibold text-xl mb-1">
                            Supplier
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

export default SupplierCard;
