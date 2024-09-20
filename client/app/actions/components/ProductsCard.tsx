import getStockLine from "@/app/functions/getStockLine";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { useState } from "react";

interface ProductsCardProps {
    selected: number;
    // eslint-disable-next-line no-unused-vars
    callback: (product: ProductWithID) => void;
    products: Record<string, ProductWithID>;
}

function ProductsCard({ selected, callback, products }: ProductsCardProps) {
    const [showProductImage, setShowProductImage] = useState(true);

    // console.log("Products card");

    function handleCallback(id: string) {
        if (products) {
            callback(products[id]);
        }
    }

    return (
        <div>
            <div className="py-2 px-3 mb-3 bg-gray-300  dark:bg-gray-800">
                <button onClick={() => setShowProductImage(!showProductImage)}>
                    #image
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {Object.values(products).map(
                    (product: ProductWithID, key: number) => (
                        <div
                            key={product._id}
                            onClick={() => handleCallback(product._id)}
                            className={`max-w-sm rounded overflow-hidden bg-gray-300 dark:bg-gray-800 shadow ${
                                selected == key
                                    ? "bg-green-200 dark:bg-green-900"
                                    : ""
                            }`}
                        >
                            {showProductImage ? (
                                <img
                                    className="w-full md:h-[180px] xl:h-[220px] object-cover"
                                    src={`/images/products/${product.image}`}
                                    alt={product.name}
                                />
                            ) : (
                                ""
                            )}
                            <div>
                                <div className="p-3">
                                    <h2 className="font-semibold text-xl mb-1">
                                        {product.name}
                                    </h2>
                                    <p className="text-base mb-1">
                                        {product.description}
                                    </p>
                                    <p>
                                        #{" "}
                                        {getStockLine(
                                            product.stock,
                                            product.units
                                        )}
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-between items-center bg-gray-400 dark:bg-slate-700 py-2 px-3">
                                    <span>
                                        1{" "}
                                        {
                                            product.units[
                                                product.displaySaleUnit
                                            ].label
                                        }
                                    </span>
                                    <p className="font-semibold text-xl text-green-900 dark:text-green-300 inline-block">
                                        {product.price *
                                            product.units[
                                                product.displaySaleUnit
                                            ].value}
                                        <span> ৳</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProductsCard;
// import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
// import getStockLine from "@/app/functions/getStockLine";
// import { ProductWithID } from "@/app/products/interfaces/product.interface";
// import {  } from "@/app/utils/numberFormat";
// import React, { useState } from "react";

// interface ProductsCardProps {
//     selected: number;
//     // eslint-disable-next-line no-unused-vars
//     callback: (product: ProductWithID) => void;
//     products: Record<string, ProductWithID> | undefined;
// }

// function ProductsCard({ selected, callback, products }: ProductsCardProps) {
//     const [showProductImage, setShowProductImage] = useState(true);

//     console.log("Products card");

//     function handleCallback(id: string) {
//         if (products) {
//             callback(products[id]);
//         }
//     }

//     if (!products) {
//         return "Loding";
//     }

//     return (
//         <div>
//             <div className="py-2 px-3 mb-3 bg-gray-800">
//                 <button onClick={() => setShowProductImage(!showProductImage)}>
//                     #image
//                 </button>
//             </div>
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
//                 {Object.values(products).map(
//                     (product: ProductWithID, key: number) => (
//                         <div
//                             key={product._id}
//                             onClick={() => handleCallback(product._id)}
//                             className={`max-w-sm rounded overflow-hidden shadow-xl bg-gray-800 text-white ${
//                                 selected == key ? "bg-green-900" : "bg-black"
//                             }`}
//                         >
//                             {showProductImage ? (
//                                 <img
//                                     className="w-full h-[240px] object-cover"
//                                     src={`/images/products/${product.image}`}
//                                     alt={product.name}
//                                 />
//                             ) : (
//                                 ""
//                             )}
//                             <div className="p-3">
//                                 <h2 className="font-semibold text-xl mb-1">
//                                     {product.name}
//                                 </h2>
//                                 <p className="text-gray-300 text-base mb-1">
//                                     {product.description}
//                                 </p>
//                                 <p>
//                                     #{" "}
//                                     {getStockLine(product.stock, product.units)}
//                                 </p>
//                                 <p className="font-semibold text-xl text-green-400 inline-block">
//                                     {(
//                                         getProductUnitPrice(product) *
//                                             product.units[
//                                                 product.displaySaleUnit
//                                             ].value
//                                     )}
//                                     <span> ৳</span>
//                                 </p>
//                                 <span className="ms-2">
//                                     1{" "}
//                                     {
//                                         product.units[product.displaySaleUnit]
//                                             .label
//                                     }
//                                 </span>
//                             </div>
//                         </div>
//                     )
//                 )}
//             </div>
//         </div>
//     );
// }

// export default ProductsCard;
