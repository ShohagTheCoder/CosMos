import Product from "../products/interfaces/product.interface";

export default function getProductUnitPrice(product: Product): number {
    const units = product.units;
    const unit = units[product.unit];
    const prices = product.prices;
    const quantity = product.quantity || 1;
    let result = product.price;

    const pricesLength = Object.keys(product.prices).length;
    for (let i = 0; i < pricesLength; i++) {
        const price = prices[i];
        result = Math.ceil(price.price);
        if (unit.value * quantity < price.max * units[price.unit].value) {
            return result;
        }
    }

    return result;
}
