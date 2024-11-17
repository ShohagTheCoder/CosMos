import getProductUnitPrice from "@/app/functions/getProductUnitPrice";
import getStockLine from "@/app/functions/getStockLine";
import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { setProduct } from "@/app/store/slices/productSlice";
import { useDispatch } from "react-redux";

interface ProductsCardProps {
    selected: number;
    // eslint-disable-next-line no-unused-vars
    callback: (product: ProductWithID) => void;
    products: Record<string, ProductWithID>;
    showProductImage: boolean;
    showProductDescription: boolean;
    // eslint-disable-next-line no-unused-vars
    setProductUpdateShortcut: (productId: string) => void;
}

function ProductsCard({
    selected,
    callback,
    products,
    showProductImage = true,
    showProductDescription = true,
    setProductUpdateShortcut,
}: ProductsCardProps) {
    const dispatch = useDispatch();

    function handleCallback(id: string) {
        if (products) {
            callback(products[id]);
        }
    }

    function handleProductUpdateShortcut(e: any, productId: string) {
        e.preventDefault();
        dispatch(setProduct(products[productId]));
        setProductUpdateShortcut(productId);
    }

    return (
        <div className="pb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Object.values(products)
                .slice(0, 20)
                .map((product: ProductWithID, key: number) => (
                    <div
                        onClick={() => handleCallback(product._id)}
                        onContextMenu={(e) =>
                            handleProductUpdateShortcut(e, product._id)
                        }
                        key={product._id}
                        className={`flex flex-col max-w-sm rounded-none overflow-hidden bg-gray-300 dark:hover:bg-green-900 dark:bg-gray-800 transition-transform shadow ${
                            selected == key
                                ? "bg-green-200 dark:bg-green-900"
                                : ""
                        }`}
                    >
                        {showProductImage ? (
                            <div className="w-full md:h-[160px] xl:h-[200px]">
                                <img
                                    className="w-full h-full object-cover"
                                    src={`/images/products/${
                                        product.image || "product.jpg"
                                    }`}
                                    alt={product.name}
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="flex flex-col flex-grow">
                            <div className="p-3">
                                <h2 className="font-semibold text-xl">
                                    {product.name}
                                </h2>
                                {showProductDescription ? (
                                    <p className="text-base">
                                        {product.description.length > 30
                                            ? `${product.description.slice(
                                                  0,
                                                  30
                                              )}...`
                                            : product.description}
                                    </p>
                                ) : (
                                    ""
                                )}
                                {product.purchaseEnable ? (
                                    <p className="mt-1">
                                        # {getStockLine(product)}
                                    </p>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="flex flex-wrap mt-auto justify-between items-center bg-gray-400 dark:bg-slate-700 py-2 px-3">
                                <span>
                                    1{" "}
                                    {
                                        product.units?.[product.displaySaleUnit]
                                            ?.label
                                    }
                                </span>
                                <p className="font-semibold text-xl text-green-900 dark:text-green-300 inline-block">
                                    {getProductUnitPrice(product) *
                                        product.units?.[product.displaySaleUnit]
                                            ?.value}
                                    <span> ৳</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default ProductsCard;
