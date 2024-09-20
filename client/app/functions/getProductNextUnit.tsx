import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductNextUnit(
    value: number,
    product: ProductWithID
): string {
    // Filter enabled units
    const enabledUnits = Object.values(product.units)
        .filter((unit) => unit.enable)
        .map((unit) => unit.unit);

    const currentIndex = enabledUnits.indexOf(product.unit);
    const totalUnits = enabledUnits.length;

    // Calculate next index using modulo to wrap around the array
    const nextIndex = (currentIndex + value + totalUnits) % totalUnits;

    return enabledUnits[nextIndex];
}
