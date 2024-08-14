import Image from "next/image";
import Link from "next/link";

import React from "react";

export default function Home() {
    const b1style = {
        border: "1px solid red",
        padding: "10px",
    };

    return (
        <main className="2xl:container mx-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-200 p-4">Column 1</div>
                <div className="bg-gray-300 p-4">Column 2</div>
                <div className="bg-gray-400 p-4">Column 3</div>
                <div className="bg-gray-500 p-4">Column 4</div>
            </div>
            <div className="mt-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-dark-600 border p-4">
                    <Link className="me-3" href={"sells"}>
                        Sells
                    </Link>
                    <Link href={"products"}>Products</Link>
                </div>
                <div className="bg-green-600 p-4">Two</div>
                <div className="bg-green-600 p-4">Three</div>
            </div>
        </main>
    );
}
