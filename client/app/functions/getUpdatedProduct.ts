import { ProductWithID } from "../products/interfaces/product.interface";
import getProductCount from "./getProductCount";
import getProductSubTotalPrice from "./getProductSubTotalPrice";
import getProductUnitPrice from "./getProductUnitPrice";

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
    item.newPrice = item.price + item.updatePrice;
    item.count = getProductCount(item);
    item.subTotal = getProductSubTotalPrice(item);

    return item;
}
