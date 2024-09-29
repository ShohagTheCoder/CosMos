import Product, {
    ProductWithID,
} from "../../products/interfaces/product.interface";
import getProductCount from "../getProductCount";
import getProductSubTotalPrice from "../getProductSubTotalPrice";
import getProductUnitPrice from "../getProductUnitPrice";
import getPurchaseProductSubTotalPrice from "./getPurchaseProductSubTotalPrice";
import getPurchaseProductUnitPrice from "./getProductUnitPurchasePrice";

export default function getUpdatedPurchaseProduct(
    product: ProductWithID,
    quantity: any,
    unit: any
): ProductWithID {
    // If new quantity
    if (quantity != null) {
        product.quantity += quantity;
    }

    // If new unit
    if (unit != null) {
        // Update discount value on unit change
        product.discount =
            (product.units[unit].value / product.units[product.unit].value) *
            product.discount;
        // Update unit
        product.unit = unit;
    }

    // Update price, count and subTotal
    product.price = getPurchaseProductUnitPrice(product);
    product.count = getProductCount(product);
    product.subTotal = getPurchaseProductSubTotalPrice(product);

    return product;
}
