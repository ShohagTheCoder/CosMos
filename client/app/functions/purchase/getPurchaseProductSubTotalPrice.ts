import { ProductWithID } from "../../products/interfaces/product.interface";

export default function getPurchaseProductSubTotalpurchasePrice(
    product: ProductWithID
): number {
    const units = product.units;
    const purchasePrices = product.purchasePrices;
    let result = 0;

    const purchasePricesLength = Object.keys(product.purchasePrices).length;
    for (let i = 0; i < purchasePricesLength; i++) {
        const purchasePrice = purchasePrices[i];
        result = product.count * product.price;

        if (
            product.count <=
            purchasePrice.max * units[purchasePrice.unit].value
        ) {
            break;
        }
    }
    result = result - product.quantity * product.discount;
    return Math.ceil(result - product.extraDiscount);
}
