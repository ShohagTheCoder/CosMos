import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductsTotalPrice(
    products: Record<string, ProductWithID>
): number {
    return Object.values(products).reduce(
        (total, product) => total + product.subTotal,
        0
    );
}
