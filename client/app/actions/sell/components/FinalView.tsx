export default function FinalView({ stateManager }: any) {
    const cart = stateManager.getData();

    return (
        // <div className="fixed z-50 bg-gray-800 h-svh w-svw flex justify-center items-start">
        <div className="bg-gray-800 w-full py-4">
            <div className="bg-gray-900 w-[400px] p-5 mx-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-800">
                            <td className="py-2 px-3">Name</td>
                            <td className="text-center py-2 px-3">Quantity</td>
                            <td className="text-end py-2 px-3">Subtotal</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(cart.products).map(
                            (product: any, index: number) => {
                                return (
                                    <tr
                                        key={product._id}
                                        className={`${
                                            index % 2 == 1
                                                ? "even:bg-gray-800"
                                                : ""
                                        }`}
                                    >
                                        <td className="py-2 px-3">
                                            {product.name}
                                        </td>
                                        <td className="text-center py-2 px-3">
                                            {product.quantity +
                                                " " +
                                                product.unit}
                                        </td>
                                        <td className="text-end py-2 px-3">
                                            {product.subTotal.toLocaleString()}{" "}
                                            ৳
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between py-2 px-3 mt-3 bg-green-900">
                    <p>Total price</p>
                    <p>{cart.totalPrice.toLocaleString()} ৳</p>
                </div>
            </div>
        </div>
    );
}
