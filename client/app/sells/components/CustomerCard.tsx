import React from "react";

function CustomerCard({ customers }: { customers: any }) {
    function handleAddCustomer(_id: string) {
        console.log(customers[_id]);
    }

    return (
        <div className="flex flex-wrap gap-3">
            {Object.values(customers).map((customer: any) => (
                <div
                    key={customer._id}
                    onClick={() => handleAddCustomer(customer._id)}
                    className="max-w-sm rounded-lg overflow-hidden shadow-xl bg-gray-800 text-white"
                >
                    <img
                        className="w-full h-48 object-cover"
                        src="product.jpeg"
                        alt={customer.fullName}
                    />
                    <div className="px-6 py-4">
                        <h2 className="font-semibold text-2xl mb-2">
                            {customer.fullName}
                        </h2>
                        <p className="text-gray-300 text-base mb-4">
                            {customer.address}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CustomerCard;
