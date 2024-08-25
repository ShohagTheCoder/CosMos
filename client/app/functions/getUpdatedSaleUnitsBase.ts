import Product from "../products/interfaces/product.interface";

export function getUpdatedSaleUnitsBase(product: Product, base: string) {
    const baseValue = product.units[base].value;
    const units = Object.values(product.units);

    for (let i = 0; i < units.length; i++) {
        let unit = units[i];
        unit.value = unit.value / baseValue;
    }

    return units.reduce((acc: any, item) => {
        acc[item.unit] = item;
        return acc;
    }, {});
}
