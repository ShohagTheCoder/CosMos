import { ProductWithID } from "../products/interfaces/product.interface";

export default function getCartProductsTotalPrice(
    products: Record<string, ProductWithID>
): number {
    console.log(products);
    let total = 0;

    for (let key in products) {
        total += products[key].subTotal;
    }

    return total;
}
