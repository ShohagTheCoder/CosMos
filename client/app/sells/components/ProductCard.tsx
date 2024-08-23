import Product, {
    ProductWithID,
} from "@/app/products/interfaces/product.interface";
import { addToCart } from "@/app/store/slices/cartSlice";
import { RootState } from "@/app/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

function ProductCard({ products }: { products: any }) {
    const dispatch = useDispatch();
    const selectedProductIndex = useSelector(
        (state: RootState) => state.cart.selectedProductIndex
    );

    function handleAddToCart(_id: string) {
        const newProduct: ProductWithID = products[_id];
        dispatch(addToCart({ ...newProduct, subTotal: newProduct.price }));
        document.getElementById("command")?.focus();
    }

    return (
        <div className="flex flex-wrap gap-3">
            {Object.values(products).map((product: any, key: number) => (
                <div
                    key={product._id}
                    onClick={() => handleAddToCart(product._id)}
                    className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
                        selectedProductIndex == key
                            ? "bg-green-900"
                            : "bg-black"
                    }`}
                >
                    <img
                        className="w-full h-48 object-cover"
                        src="product.jpg"
                        alt={product.name}
                    />
                    <div className="p-3">
                        <h2 className="font-semibold text-xl mb-1">
                            {product.name}
                        </h2>
                        <p className="text-gray-300 text-base mb-1">
                            {product.description}
                        </p>
                        <p className="font-semibold text-xl text-green-400">
                            {product.price.toLocaleString("Bn-bd")}
                            <span> ৳</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductCard;
