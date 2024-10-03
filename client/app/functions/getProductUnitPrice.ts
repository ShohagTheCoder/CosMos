import Product, {
    ProductWithID,
} from "../products/interfaces/product.interface";

export default function getProductUnitPrice(product: Product | ProductWithID) {
    const { units, unit, prices, quantity = 1, price: basePrice } = product;
    const selectedUnitValue = units[unit].value;
    let finalPrice = basePrice;

    for (const priceInfo of Object.values(prices)) {
        if (
            selectedUnitValue * quantity <
            priceInfo.start * units[priceInfo.unit].value
        ) {
            break;
        }
        finalPrice = priceInfo.price;
    }

    return finalPrice;
}
