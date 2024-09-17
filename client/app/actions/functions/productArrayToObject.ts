import getUpdatedProduct from "@/app/functions/getUpdatedProduct";
import { ProductWithID } from "@/app/products/interfaces/product.interface";

export function productArrayToObject(
    items: ProductWithID[] = [], // Default to empty array
    exclude: ((item: ProductWithID) => boolean) | undefined = undefined
): Record<string, ProductWithID> {
    if (exclude) {
        return items.reduce(
            (acc: Record<string, ProductWithID>, item: ProductWithID) => {
                if (!exclude(item)) {
                    acc[item._id] = getUpdatedProduct(
                        item,
                        undefined,
                        undefined
                    );
                }
                return acc;
            },
            {}
        );
    }

    return items.reduce(
        (acc: Record<string, ProductWithID>, item: ProductWithID) => {
            acc[item._id] = getUpdatedProduct(item, undefined, undefined);
            return acc;
        },
        {}
    );
}
