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
        <div className="fixed top-0 left-0 h-screen w-screen bg-black z-50 py-[100px]">
            <div className="w-[800px] mx-auto h-full p-5 bg-slate-900">
                <div className="flex place-content-between mb-4 items-center">
                    <input
                        id="command"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        className="border border-2 border-dashed border-slate-500 bg-black outline-none focus:border-green-500 text-white px-4 py-2 text-lg"
                    />
                    <button
                        onClick={handleClose}
                        className="h-[30px] w-[30px] bg-red-600 rounded-md"
                    >
                        X
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {filteredProducts.map((product: any, key: number) => (
                        <div
                            key={product._id}
                            onClick={() => callback(product)}
                            className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                                selectedProductIndex == key
                                    ? "bg-green-900"
                                    : "bg-black"
                            }`}
                        >
                            <img
                                className="w-full h-48 object-cover"
                                src="/product.jpg"
                                alt={product.name}
                            />
                            <div className="p-3">
                                <h2 className="font-semibold text-xl mb-1">
                                    {product.name}
                                </h2>
                                <p className="text-gray-300 text-base mb-1">
                                    {product.description}
                                </p>
                                <p className="font-semibold text-xl text-green-400 inline-block">
                                    {(
                                        product.price *
                                        product.units[product.unit].value
                                    ).toLocaleString("Un-us")}
                                    <span> ৳</span>
                                </p>
                                <span className="ms-2">
                                    1 {product.units[product.unit].label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SelectProductPopup;
