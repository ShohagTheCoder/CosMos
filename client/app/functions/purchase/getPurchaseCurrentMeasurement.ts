import { ProductWithID } from "../../products/interfaces/product.interface";

export default function getPurchaseCurrentMeasurement(
    product: ProductWithID
): number {
    const measurements = product.measurements;
    const units = product.units;

    let i;
    const length = measurements.length;
    for (i = 0; i < length; i++) {
        const measurement = measurements[i];
        const unit = product.units[measurement.unit];
        if (
            units[product.unit].value * product.quantity <
            measurement.value * unit.value
        ) {
            return i - 1;
        }
    }

    return i - 1;
}
