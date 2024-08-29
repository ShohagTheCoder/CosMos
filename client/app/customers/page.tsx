"use client";
import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import { Customer } from "../interfaces/customer.inerface";
import Link from "next/link";

function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        apiClient.get("customers").then((res) => setCustomers(res.data));
    });

    return (
        <main>
            <div className="mt-4"></div>
            <div className="container mx-auto">
                {customers.map((customer: Customer, key) => (
                    <div key={key} className="border p-3 mb-3">
                        <p>{customer.name}</p>
                        <p>{customer.address}</p>
                        <p>{customer.phoneNumber}</p>
                        <div>
                            <Link
                                href={`customers/update/${customer._id}`}
                                className="py-1 px-3 bg-green-700 text-white rounded"
                            >
                                Edit
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Customers;
