import { Supplier } from "@/app/interfaces/supplier.interface";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SupplierCard({
    suppliers,
    callback,
}: {
    suppliers: any;
    // eslint-disable-next-line no-unused-vars
    callback: (supplier: Supplier) => void;
}) {
    const selectedProductIndex = useSelector(
        (state: RootState) => state.cart.selectedProductIndex
    );

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {Object.values(suppliers).map((supplier: any, key: number) => (
                <div
                    key={supplier._id}
                    onClick={() => callback(supplier)}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selectedProductIndex == key
                            ? "bg-green-900"
                            : "bg-black"
                    }`}
                >
                    <img
                        className="h-[240px] w-full object-cover"
                        src={`/images/suppliers/${
                            supplier.image || "supplier.jpg"
                        }`}
                        alt={supplier.name}
                    />
                    <div className="p-3">
                        <h2 className="font-semibold text-xl mb-1">
                            {supplier.name}
                        </h2>
                        <p className="text-gray-300 text-base">
                            {supplier.address.substring(0, 18)}...
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SupplierCard;
