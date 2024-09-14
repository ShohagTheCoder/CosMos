import { Unit } from "../products/interfaces/product.interface";

export default function getUnits(
    units: Record<string, Unit>
): Record<string, Unit> {
    return (
        Object.entries(units)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, unit]) => unit.enable) // Only keep units where enable is true
            .reduce((acc, [key, unit]) => {
                acc[key] = unit; // Reconstruct the object with enabled units
                return acc;
            }, {} as Record<string, Unit>)
    );
}
