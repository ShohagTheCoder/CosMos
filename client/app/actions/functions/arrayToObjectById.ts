export function arrayToObjectById(items: any) {
    // Convert filtered array back to object
    return items.reduce((acc: any, item: any) => {
        acc[item._id] = item;
        return acc;
    }, {});
}
