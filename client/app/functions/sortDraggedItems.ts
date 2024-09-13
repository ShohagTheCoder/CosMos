export default function sortDraggedItems<T>(
    items: T[],
    dragged: number,
    draggedOver: number
): T[] {
    // Return original array if indices are the same
    if (dragged === draggedOver) return items;

    // Check if indices are within valid bounds
    if (
        dragged < 0 ||
        dragged >= items.length ||
        draggedOver < 0 ||
        draggedOver >= items.length
    ) {
        return items;
    }

    // Clone the array to avoid mutating the original
    const itemsClone = [...items];

    // Swap the dragged and draggedOver items using destructuring
    [itemsClone[dragged], itemsClone[draggedOver]] = [
        itemsClone[draggedOver],
        itemsClone[dragged],
    ];

    return itemsClone;
}
