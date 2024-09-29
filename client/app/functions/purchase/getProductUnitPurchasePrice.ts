import Product, {
    ProductWithID,
} from "@/app/products/interfaces/product.interface";

export default function getProductUnitPurchasePrice(
    product: Product | ProductWithID
): number {
    const {
        units,
        unit,
        purchasePrices,
        quantity = 1,
        price: basePrice,
    } = product;
    const selectedUnitValue = units[unit].value;
    let finalPrice = basePrice;

    for (const priceInfo of Object.values(purchasePrices)) {
        if (
            selectedUnitValue * quantity <
            priceInfo.start * units[priceInfo.unit].value
        ) {
            break;
        }
        finalPrice = Math.ceil(priceInfo.price);
    }

    return finalPrice;
}
