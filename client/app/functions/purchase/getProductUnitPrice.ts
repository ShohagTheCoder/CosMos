import Product, {
    ProductWithID,
} from "@/app/products/interfaces/product.interface";

export default function getProductUnitpurchasePrice(
    product: ProductWithID | Product
): number {
    const units = product.units;
    const unit = units[product.unit];
    const purchasePrices = product.purchasePrices;
    const quantity = product.quantity || 1;
    let result = product.price;

    const purchasePricesLength = Object.keys(product.purchasePrices).length;
    for (let i = 0; i < purchasePricesLength; i++) {
        const purchasePrice = purchasePrices[i];
        result = Math.ceil(purchasePrice.price);
        if (
            unit.value * quantity <
            purchasePrice.max * units[purchasePrice.unit].value
        ) {
            return result;
        }
    }

    return result;
}
