import Product from "../products/interfaces/product.interface";

export default function updatePricesForNewBase(product: Product, base: string) {
    const baseValue = product.units[base].value;
    let prices = product.prices;
    console.log(base);
    console.log("base value " + baseValue);

    for (let i = 0; i < prices.length; i++) {
        const price = prices[i];
        prices[i].price = price.price * baseValue;
    }

    return prices;
}
