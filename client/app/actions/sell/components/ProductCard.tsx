import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { addTo } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function ProductCard({ products }: { products: any }) {
    const dispatch = useDispatch();
    const selectedProductIndex = useSelector(
        (state: RootState) => state.cart.selectedProductIndex
    );

    function handleaddTo(_id: string) {
        const newProduct: ProductWithID = products[_id];
        dispatch(addTo({ ...newProduct, subTotal: newProduct.price }));
        document.getElementById("command")?.focus();
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
            {Object.values(products).map((product: any, key: number) => (
                <div
                    key={product._id}
                    onClick={() => handleaddTo(product._id)}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selectedProductIndex == key
                            ? "bg-green-900"
                            : "bg-black"
                    }`}
                >
                    <img
                        className="w-full h-[240px] object-cover"
                        src={`/images/products/${product.image}`}
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
    );
}

export default ProductCard;
