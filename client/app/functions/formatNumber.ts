export default function formatNumber(value: number, dicimal: number = 2) {
    return value % 1 === 0 ? value.toString() : value.toFixed(dicimal);
}
