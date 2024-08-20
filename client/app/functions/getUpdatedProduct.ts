import Product, {
    ProductWithID,
} from "../products/interfaces/product.interface";
import getProductSubTotalPrice from "./getProductSubTotalPrice";
import getProductUnitPrice from "./getProductUnitPrice";

export default function getUpdatedProduct(
    product: ProductWithID,
    quantity: any,
    unit: any
): ProductWithID {
    if (quantity != null) {
        product.quantity += quantity;
    }

    if (unit != null) {
        product.unit = unit;
    }

    product.price = getProductUnitPrice(product);
    product.subTotal = getProductSubTotalPrice(product);

    return product;
}
