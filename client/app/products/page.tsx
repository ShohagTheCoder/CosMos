// "use client";
// import { useEffect, useState } from "react";
// import apiClient from "../utils/apiClient";
// import Link from "next/link";
// import Product from "./interfaces/product.interface";

// export default function Products() {
//     const [products, setProducts] = useState([]);
//     const [message, setMessage] = useState("No Message");

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const result = await apiClient.get("products");
//                 setProducts(result.data);
//                 setMessage("Products fetched");
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         fetchProducts();
//     }, []);

//     async function handleDeleteProduct(_id: any, index: number) {
//         const sure = window.confirm("Are you sure to delete the product?");
//         if (sure) {
//             try {
//                 const result = await apiClient.delete(`products/${_id}`);
//                 console.log(result.data);
//                 setMessage("Product deleted successfully");
//                 const updatedProducts = products;
//                 delete updatedProducts[index];
//                 setProducts(updatedProducts);
//             } catch (error) {
//                 setMessage("Failed to delete product");
//                 console.log("failed to delete product");
//             }
//         }
//     }

//     return (
//         <div className="container mx-auto px-4 py-8 dark:bg-gray-800">
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-2xl font-bold">Products</h2>
//                 <Link href="/products/create" className="btn btn-primary">
//                     Create
//                 </Link>
//             </div>
//             <div className="message">
//                 <p>{message}</p>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="table w-full shadow-md rounded-lg dark:border dark:border-gray-700 border-collapse: separate border-spacing-2 text-sm">
//                     <thead>
//                         <tr className="text-left bg-gray-100 dark:bg-gray-700">
//                             <th className="py-3 px-4">Name</th>
//                             <th className="py-3 px-4">Price</th>
//                             <th className="py-3 px-4">Description</th>
//                             <th className="py-3 px-4">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((product: Product, index: number) => (
//                             <tr
//                                 key={index}
//                                 className="hover:bg-gray-200 dark:hover:bg-gray-600"
//                             >
//                                 <td className="py-3 px-4">{product.name}</td>
//                                 <td className="py-3 px-4">{product.price}</td>
//                                 <td className="py-3 px-4">
//                                     {product.description}
//                                 </td>
//                                 <td className="py-3 px-4 flex justify-end space-x-2">
//                                     <Link
//                                         href={`/products/update/${product._id}`}
//                                         className="btn btn-sm btn-secondary"
//                                     >
//                                         Update
//                                     </Link>
//                                     <button
//                                         onClick={() =>
//                                             handleDeleteProduct(
//                                                 product._id,
//                                                 index
//                                             )
//                                         }
//                                         className="btn btn-sm btn-danger"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

"use client";
import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Link from "next/link";
import Product from "./interfaces/product.interface";
import { ERROR, NONE, SUCCESS } from "../utils/constants/message";
import Notification, {
    NotificationProps,
} from "../elements/notification/Notification";
import PulseLoading from "../elements/loding/PulseLoading";
import PulseFadeLoading from "../elements/loding/PulseFadeLoading";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [notification, setNotification] = useState<NotificationProps>({
        message: "",
        type: NONE,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await apiClient.get("products");
                setProducts(result.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchProducts();
    }, []);

    async function handleDeleteProduct(_id: any, index: number) {
        const sure = window.confirm("Are you sure to delete the product?");
        if (sure) {
            try {
                const result = await apiClient.delete(`products/${_id}`);
                console.log(result.data);
                const updatedProducts = [...products];
                updatedProducts.splice(index, 1);
                setProducts(updatedProducts);
                setNotification({
                    message: "Product deleted successfully",
                    type: SUCCESS,
                });
            } catch (error) {
                console.log("failed to delete product");
                setNotification({
                    message: "Faild to delete product",
                    type: ERROR,
                });
            }
        }
    }

    if (products.length == 0) {
        return (
            <div className="h-svh flex justify-center items-center">
                <PulseFadeLoading />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-8 pb-4 dark:bg-gray-800">
            <Notification
                type={notification.type}
                message={notification.message}
            />
            <div className="flex items-center justify-start gap-6 mb-4">
                <h2 className="text-2xl font-bold">Products</h2>
                <Link
                    href="/products/create"
                    target="_blank"
                    className="bg-gray-700 py-2 px-3 hover:bg-green-700 rounded-md"
                >
                    Create
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {products.map((product: Product, index: number) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-3 flex flex-col justify-between"
                    >
                        <img
                            src={`images/products/${product.image}`}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-t-md"
                        />
                        <div className="pt-3">
                            <h3 className="text-lg font-bold mb-2">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                {product.description}
                            </p>
                            <p className="text-xl font-semibold mb-4">
                                ${product.price}
                            </p>
                            <div className="flex justify-between">
                                <Link
                                    target="_black"
                                    href={`/products/update/${product._id}`}
                                    className="bg-gray-800 hover:bg-green-700 py-1 px-3 rounded-md"
                                >
                                    Update
                                </Link>
                                <button
                                    onDoubleClick={() =>
                                        handleDeleteProduct(product._id, index)
                                    }
                                    className="bg-gray-800 hover:bg-red-700 py-1 px-3 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
