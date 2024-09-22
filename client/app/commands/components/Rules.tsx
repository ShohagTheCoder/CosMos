import React from "react";

export default async function Rules() {
    return (
        <div>
            {" "}
            <div className="py-2 px-3 bg-slate-800 mb-3">
                <p>
                    Search Products = (Products name, SKU, price, category,
                    brand etc)
                </p>
            </div>
            <div className="py-2 px-3 bg-slate-800 mb-3">
                <p>
                    Search customers = &apos;Space&apos; + (Customers name,
                    phone number, address etc)
                </p>
            </div>
        </div>
    );
}
