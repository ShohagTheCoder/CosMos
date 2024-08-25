import apiClient from "@/app/utils/apiClient";
import Link from "next/link";
import React from "react";

async function CustomerProfile({ params }: any) {
    const { id } = params;

    const { data: customer } = await apiClient.get(`customers/${id}`);
    const { data: sells } = await apiClient.get(`sells/findByCustomer/${id}`);
    const { data: account } = await apiClient.get(
        `accounts/${customer.account}`
    );

    return (
        <main>
            <div className="container mx-auto">
                <div className="grid grid-cols-4 py-3 gap-3">
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                                <img
                                    src="/profile-picture.jpg"
                                    alt=""
                                    className="h-[200px]"
                                />
                            </div>
                            <div className="col-span-1">
                                <p>Id: {id}</p>
                                <p>Name: {customer.name}</p>
                                <p>Address: {customer.address}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 border p-3">
                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="col-span-1">
                                {account.balance > 0 ? (
                                    <p>Balance: {account.balance}</p>
                                ) : (
                                    <p>Due: {Math.abs(account.balance)}</p>
                                )}
                            </div>
                            <div className="col-span-1">Sells: 3667tk</div>
                            <div className="col-span-1">View account</div>
                            <div className="col-span-1">
                                <Link
                                    href="/accounts"
                                    className="py-2 px-3 bg-blue-700"
                                >
                                    Send money
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">
                <p className="mb-3">All sells here</p>
                {sells.map((sell: any) => (
                    <div key={sell._id} className="sell">
                        <div className="border p-3">
                            <p>Seller: {sell.user.name}</p>
                            {Object.values(sell.products).map(
                                (product: any) => (
                                    <div key={product._id} className="product">
                                        <p>Product Name: {product.name}</p>
                                        <p>
                                            Product Quantity: {product.quantity}
                                        </p>
                                        <p>Product Price: {product.price}</p>
                                        <p>
                                            Product SubTotal: {product.subTotal}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default CustomerProfile;
