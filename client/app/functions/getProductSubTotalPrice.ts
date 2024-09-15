import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductSubTotalPrice(
    product: ProductWithID
): number {
    const units = product.units;
    const prices = product.prices;
    let result = 0;

    const pricesLength = Object.keys(product.prices).length;
    for (let i = 0; i < pricesLength; i++) {
        const price = prices[i];
        result = product.count * (product.price - product.updatePrice);

        if (product.count <= price.max * units[price.unit].value) {
            break;
        }
    }
    result = result - product.quantity * product.discount;
    return Math.ceil(result - product.extraDiscount);
}
