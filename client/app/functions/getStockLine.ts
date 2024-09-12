import { Unit } from "../products/interfaces/product.interface";
import getBiggestUnitFor from "./getBiggestUnitFor";

export default function getStockLine(stock: any, units: Record<string, Unit>) {
    let output = "";
    let quantity = stock.stock;

    while (quantity > 0) {
        const unit = getBiggestUnitFor(quantity, units);
        if (unit) {
            let value = Math.floor(quantity / unit.value); // Get the number of units
            quantity -= value * unit.value; // Reduce quantity by the total value of those units

            if (value > 0) {
                output += value + " " + unit.unit + ", ";
            }
        } else {
            break; // Break if no valid unit is found
        }
    }

    // Remove the last comma and space if present
    if (output.endsWith(", ")) {
        output = output.slice(0, -2);
    }

    return output;
}
