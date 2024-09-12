import { Unit } from "../products/interfaces/product.interface";

export default function getBiggestUnitFor(
    quantity: number,
    units: Record<string, Unit>
): Unit | null {
    const unitsArray = Object.values(units);

    // Return null if there are no units
    if (unitsArray.length === 0) return null;

    // Use reduce to find the biggest unit that is less than the quantity
    const selectedUnit = unitsArray.reduce<Unit | null>((biggest, unit) => {
        if (
            unit.value <= quantity &&
            (!biggest || unit.value > biggest.value)
        ) {
            return unit;
        }
        return biggest;
    }, null);

    return selectedUnit;
}
