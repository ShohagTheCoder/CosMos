export function arrayToObjectById<T extends { _id: string }>(
    items: T[] = [], // Default to empty array
    exclude: ((item: T) => boolean) | null = null
): Record<string, T> {
    if (exclude) {
        return items.reduce((acc: Record<string, T>, item: T) => {
            if (!exclude(item)) {
                acc[item._id] = item;
            }
            return acc;
        }, {});
    }

    return items.reduce((acc: Record<string, T>, item: T) => {
        acc[item._id] = item;
        return acc;
    }, {});
}
