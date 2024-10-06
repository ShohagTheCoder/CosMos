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
        <div className="pb-4 space-y-3">
            {Object.values(products)
                .slice(0, 20)
                .map((product: ProductWithID, key: number) => (
                    <div
                        key={product._id}
                        onClick={() => handleCallback(product._id)}
                        className={`grid w-full grid-cols-5 rounded overflow-hidden bg-gray-300 dark:bg-gray-800 shadow ${
                            selected == key
                                ? "bg-green-200 dark:bg-green-900"
                                : ""
                        }`}
                    >
                        <div className="col-span-2 flex flex-wrap">
                            {showProductImage ? (
                                <img
                                    className="w-[60px] object-cover"
                                    src={`/images/products/${
                                        product.image || "product.jpg"
                                    }`}
                                    alt={product.name}
                                />
                            ) : (
                                ""
                            )}
                            <div className="py-1 ps-3">
                                <h2 className="font-semibold text-xl mb-1">
                                    {product.name}
                                </h2>
                                <p className="text-base">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end items-center">
                            <p>
                                {product.purchaseEnable
                                    ? `# ${getStockLine(product)}`
                                    : "Available"}
                            </p>
                        </div>
                        <div className="flex justify-end items-center">
                            <p className="">
                                1 {product.units[product.displaySaleUnit].label}
                            </p>
                        </div>
                        <div className="pe-4 flex justify-end items-center">
                            <p className="font-semibold text-xl text-green-900 dark:text-green-300">
                                {product.price *
                                    product.units[product.displaySaleUnit]
                                        .value}
                                <span> ৳</span>
                            </p>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default ProductsRow;
