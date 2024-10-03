export default function fixFloatingPoint(num: number, maxDecimalPlaces = 1) {
    // Convert the number to a string to handle precision issues
    const numStr = num.toString();

    // Check if the string contains a decimal point
    if (numStr.indexOf(".") !== -1) {
        // Find the index of the last non-zero digit after the decimal point, but limit to maxDecimalPlaces
        let lastNonZeroIndex = Math.min(
            numStr.indexOf(".") + maxDecimalPlaces,
            numStr.length - 1
        );
        while (
            lastNonZeroIndex > numStr.indexOf(".") &&
            numStr[lastNonZeroIndex] === "0"
        ) {
            lastNonZeroIndex--;
        }

        // If the last non-zero digit is followed by trailing zeros, remove them
        if (lastNonZeroIndex < numStr.length - 1) {
            return numStr.substring(0, lastNonZeroIndex + 1);
        }
    }

    return numStr;
}
