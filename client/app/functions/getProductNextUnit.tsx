import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductNextUnit(
    value: number,
    product: ProductWithID
) {
    let units = Object.keys(product.units);
    let currentIndex = units.indexOf(product.unit);
    let length = units.length - 1;

    if (currentIndex + value == length) {
        return units[0];
    }

    if (currentIndex + value < 0) {
        return units[length - 1];
    }

    return units[currentIndex + value];
}
