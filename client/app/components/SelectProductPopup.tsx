import React, { useEffect, useState } from "react";
import Product from "../products/interfaces/product.interface";

function SelectProductPopup({ products, callback, handleClose }: any) {
    const [search, setSearch] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);

    useEffect(() => {
        const tempFilteredProducts = products.filter((product: Product) => {
            return product.name.toLowerCase().includes(search.toLowerCase());
        });

        setFilteredProducts(tempFilteredProducts);
        setSelectedProductIndex(0);
    }, [search]);

    function handleKeyDown(e: any) {
        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                if (filteredProducts.length - 1 == selectedProductIndex) {
                    setSelectedProductIndex(0);
                } else {
                    setSelectedProductIndex(selectedProductIndex + 1);
                }
                break;
            case "ArrowLeft":
                e.preventDefault();
                if (selectedProductIndex == 0) {
                    setSelectedProductIndex(filteredProducts.length - 1);
                } else {
                    setSelectedProductIndex(selectedProductIndex - 1);
                }
                break;
            case "Enter":
                callback(filteredProducts[selectedProductIndex]);
                break;
        }
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-70 z-50 py-10">
            <div className="w-full max-w-4xl mx-auto h-full p-6 bg-slate-900 rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <input
                        id="command"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg outline-none focus:border-green-500 px-4 py-2 text-lg placeholder-gray-400"
                        placeholder="Search..."
                    />
                    <button
                        onClick={handleClose}
                        className="ml-4 h-8 w-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200"
                    >
                        <span className="text-xl font-bold">×</span>
                    </button>
                </div>
                <div className="h-full overflow-y-auto pb-10 pe-3 cosmos-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product: any, key: number) => (
                            <div
                                key={product._id}
                                onClick={() => callback(product)}
                                className={`group max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white cursor-pointer ${
                                    selectedProductIndex == key
                                        ? "bg-green-900"
                                        : "bg-gray-800"
                                }`}
                            >
                                <img
                                    className="w-full h-48 object-cover"
                                    src={`/images/products/${
                                        product.image || "product.jpg"
                                    }`}
                                    alt={product.name}
                                />
                                <div className="p-4">
                                    <h2 className="font-semibold text-xl mb-1">
                                        {product.name}
                                    </h2>
                                    <p className="text-gray-300 text-base mb-2">
                                        {product.description}
                                    </p>
                                    <p className="font-semibold text-xl text-green-400 inline-block">
                                        {(
                                            product.price *
                                            product.units[product.unit].value
                                        ).toLocaleString("en-US")}
                                        <span> ৳</span>
                                    </p>
                                    <span className="text-gray-400 ms-2">
                                        1 {product.units[product.unit].label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectProductPopup;
