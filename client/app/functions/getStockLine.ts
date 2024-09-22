import { ProductWithID } from "../products/interfaces/product.interface";

export default function getStockLine(product: ProductWithID) {
    let output = "";
    let stock = product.stock.stock;
    let unit = product.units[product.displaySaleUnit];
    let quantity = 0;

    // Check if unit value is valid to avoid an infinite loop
    if (unit && unit.value > 0) {
        // Decrease stock by the value of the unit
        while (stock >= unit.value) {
            quantity++;
            stock -= unit.value;
        }
    }

    // Use unit.name or product.displaySaleUnit to create meaningful output
    output += quantity + " " + product.displaySaleUnit;

    if (stock > 0) {
        output += " " + stock + " " + (product.unit || product.displaySaleUnit); // Fallback to displaySaleUnit
    }

    return output;
}
