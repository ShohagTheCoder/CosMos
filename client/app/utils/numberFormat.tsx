export function convertStandardToBnBD(standardNumber: number) {
    const bnBDFormat = new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2, // Adjust as needed
    });
    return bnBDFormat.format(standardNumber);
}

export function convertBnBDToStandard(bnBDNumberString: string) {
    // Define mappings from Bangla digits to standard digits
    const banglaToStandardMap: any = {
        "০": "0",
        "১": "1",
        "২": "2",
        "৩": "3",
        "৪": "4",
        "৫": "5",
        "৬": "6",
        "৭": "7",
        "৮": "8",
        "৯": "9",
    };

    // Replace Bangla digits with standard digits
    let standardNumberString = bnBDNumberString.replace(
        /[০১২৩৪৫৬৭৮৯]/g,
        (match) => banglaToStandardMap[match]
    );

    // Remove commas (thousands separator)
    standardNumberString = standardNumberString.replace(/,/g, "");

    // Convert to a standard number
    const number = parseFloat(standardNumberString);

    return number;
}
