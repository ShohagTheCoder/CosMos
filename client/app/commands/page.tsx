import React from "react";

function Commands() {
    return (
        <main>
            <div className="container mx-auto py-5">
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
        </main>
    );
}

export default Commands;
