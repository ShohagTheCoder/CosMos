import Product from "../products/interfaces/product.interface";

export default function getProductSubTotalPrice(product: Product): number {
    const units = product.units;
    const unit = units[product.unit];
    const prices = product.prices;
    const quantity = product.quantity || 1;
    let result = 0;

    const pricesLength = Object.keys(product.prices).length - 1;
    for (let i = 0; i < pricesLength; i++) {
        const price = prices[i];
        result = quantity * product.price * unit.value - product.extraDiscount;

        if (unit.value * quantity <= price.max * units[price.unit].value) {
            break;
        }
    }

    return Math.ceil(result - product.extraDiscount);
}
