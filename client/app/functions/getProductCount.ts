import { ProductWithID } from "../products/interfaces/product.interface";

export default function getProductCount(product: ProductWithID): number {
    const units = product.units;
    const unit = units[product.unit];
    return product.quantity * unit.value;
}
