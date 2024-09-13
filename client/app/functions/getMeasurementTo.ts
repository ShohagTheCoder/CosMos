import { ProductWithID } from "../products/interfaces/product.interface";
import getCurrentMeasurement from "./getCurrentMeasurement";

export default function getMeasurementTo(product: ProductWithID, to: number) {
    const measurements = product.measurements;
    const measurementsLength = measurements.length;
    let currentMeasurementIndex = getCurrentMeasurement(product);

    // Loop through
    let measurement;
    if (currentMeasurementIndex + to == measurementsLength) {
        measurement = measurements[0];
    } else if (currentMeasurementIndex + to < 0) {
        measurement = measurements[measurements.length - 1];
    } else {
        measurement = measurements[currentMeasurementIndex + to];
    }

    return measurement;
}
