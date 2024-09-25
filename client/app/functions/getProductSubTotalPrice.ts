import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductSubTotalPrice(
    product: ProductWithID
): number {
    return (
        (product.price - product.discount / product.units[product.unit].value) *
            product.count -
        product.extraDiscount
    );
}
