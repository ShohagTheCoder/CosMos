import { ProductWithID } from "../products/interfaces/product.interface";
import getProductCount from "./getProductCount";
import getProductSubTotalPrice from "./getProductSubTotalPrice";
import getProductUnitPrice from "./getProductUnitPrice";
import getUnits from "./getUnits";

export default function getUpdatedProduct(
    product: ProductWithID,
    quantity: number | undefined,
    unit: string | undefined
): ProductWithID {
    let item = { ...product };
    // If new quantity
    if (quantity) {
        item.quantity = quantity;
    }

    // If new unit
    if (unit) {
        // Update discount value on unit change
        item.discount =
            (item.units[unit].value / item.units[item.unit].value) *
            item.discount;
        // Update unit
        item.unit = unit;
    }

    // Update price, count and subTotal
    item.price = getProductUnitPrice(item);
    item.count = getProductCount(item);
    item.subTotal = getProductSubTotalPrice(item);
    item.units = getUnits(item.units);

    return item;
}
