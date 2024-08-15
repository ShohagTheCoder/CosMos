import { Product } from "@/app/interfaces/product.interface";
import { removeToCart } from "@/app/store/slices/cartSlice";
import React from "react";
import { useDispatch } from "react-redux";

function CartItem({ product }: { product: any }) {
    const dispatch = useDispatch();

    function HandleRemoveToCart(_id: string): void {
        dispatch(removeToCart(_id));
    }
    // return (
    //     <div key={product._id} className="product border flex">
    //         <div className="cart-item-img">
    //             <img src="product.jpeg" alt="Product" className="w-[80px]" />
    //         </div>
    //         <div className="cart-item-details">
    //             <p>{product.name}</p>
    //         </div>
    //         <div className="cart-item-action">
    //             <button
    //                 className="p-2 border m-2"
    //                 onDoubleClick={() => HandleRemoveToCart(product._id)}
    //             >
    //                 Remove
    //             </button>
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex items-center border-b py-4">
            <img
                src="product.jpeg"
                alt={product.name}
                className="w-20 h-20 object-cover mr-4"
            />
            <div className="flex-1">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-600">Price: ${product.price}</p>
                <div className="flex items-center mt-2">
                    {/* Quantity selector */}
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2">
                        -
                    </button>
                    <span className="text-gray-700 font-bold">
                        {product.quantity}
                    </span>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded">
                        +
                    </button>
                </div>
            </div>
            <div className="text-right">
                <p className="text-lg font-medium">
                    Subtotal: ${product.price * 3}
                </p>
                <button
                    onDoubleClick={() => HandleRemoveToCart(product._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Remove
                </button>
            </div>
        </div>
    );
}

export default CartItem;
