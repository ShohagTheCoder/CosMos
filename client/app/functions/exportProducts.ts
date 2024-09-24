import { ProductWithID } from "../products/interfaces/product.interface";

export default function exportProducts(
    products: ProductWithID[],
    format = "json"
) {
    if (!products || products.length === 0) {
        console.error("No products to export.");
        return;
    }

    const jsonExport = () => {
        const jsonString = JSON.stringify(products, null, 2); // Pretty JSON format
        const blob = new Blob([jsonString], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "products.json";
        link.click();
    };

    const csvExport = () => {
        const headers = Object.keys(products[0]).join(","); // CSV header row
        const rows = products
            .map((product) => Object.values(product).join(","))
            .join("\n");

        const csvString = `${headers}\n${rows}`;
        const blob = new Blob([csvString], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "products.csv";
        link.click();
    };

    if (format === "json") {
        jsonExport();
    } else if (format === "csv") {
        csvExport();
    } else {
        console.error("Unsupported export format. Use 'json' or 'csv'.");
    }
}
