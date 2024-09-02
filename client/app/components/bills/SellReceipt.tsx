import { ProductWithID } from "@/app/products/interfaces/product.interface";
import { RootState } from "@/app/store/store";
import React from "react";
import { useSelector } from "react-redux";

function SellReceipt() {
    const cart = useSelector((state: RootState) => state.cart);
    return (
        <div className="hidden print:block w-[400px] mx-auto bg-slate-900">
            <div className="text-center bg-black border-y-2 py-3">
                <p>The Shohag Shop</p>
            </div>
            <div className="spacer border-t-2 border-dashed"></div>
            <p className="py-2">23/12/2025</p>
            <div className="spacer border-t-2 border-dashed"></div>
            <div className="pt-2">
                {Object.values(cart.products).map((product: ProductWithID) => (
                    <div
                        key={product._id}
                        className="mb-2 flex justify-between"
                    >
                        <p>
                            {product.name +
                                " (" +
                                product.saleUnitsBase +
                                ") " +
                                product.price}{" "}
                            ৳
                        </p>
                        <p>{product.quantity + " (" + product.unit + ") "} </p>
                        <p>= {product.subTotal} ৳</p>
                    </div>
                ))}
            </div>
            <div className="spacer border-t-2 border-dashed"></div>
            <p>Total = </p>
            <div className="spacer border-t-2 border-dashed"></div>
            <div className="text-center bg-black border-y-2 py-3">
                <p>Thank you</p>
            </div>
        </div>
    );
}

export default SellReceipt;
