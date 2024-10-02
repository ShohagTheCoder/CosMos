import getStockLine from "@/app/functions/getStockLine";
import { ProductWithID } from "@/app/products/interfaces/product.interface";

interface ProductsRowProps {
    selected: number;
    // eslint-disable-next-line no-unused-vars
    callback: (product: ProductWithID) => void;
    products: Record<string, ProductWithID>;
    showProductImage: boolean;
}

function ProductsRow({
    selected,
    callback,
    products,
    showProductImage = true,
}: ProductsRowProps) {
    function handleCallback(id: string) {
        if (products) {
            callback(products[id]);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {Object.values(products).map(
                (product: ProductWithID, key: number) => (
                    <div
                        key={product._id}
                        onClick={() => handleCallback(product._id)}
                        className={`flex rounded overflow-hidden bg-gray-300 dark:bg-gray-800 shadow ${
                            selected == key
                                ? "bg-green-200 dark:bg-green-900"
                                : ""
                        }`}
                    >
                        {showProductImage ? (
                            <img
                                className="w-[60px] object-cover"
                                src={`/images/products/${product.image}`}
                                alt={product.name}
                            />
                        ) : (
                            ""
                        )}
                        <div className="w-full flex justify-between items-center py-1">
                            <div className="flex items-center gap-3">
                                <div className="min-w-[200px] ps-3">
                                    <h2 className="font-semibold text-xl mb-1">
                                        {product.name}
                                    </h2>
                                    <p className="text-base mb-1">
                                        {product.description}
                                    </p>
                                </div>
                                {product.purchaseEnable ? (
                                    <p># {getStockLine(product)}</p>
                                ) : (
                                    <p>Available</p>
                                )}
                            </div>
                            <div className="flex gap-3 min-w-[200px] mr-3 justify-between items-center py-2 px-3">
                                <p>
                                    1{" "}
                                    {
                                        product.units[product.displaySaleUnit]
                                            .label
                                    }
                                </p>
                                <p className="font-semibold text-xl text-green-900 dark:text-green-300 inline-block">
                                    {product.price *
                                        product.units[product.displaySaleUnit]
                                            .value}
                                    <span> ৳</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

export default ProductsRow;
