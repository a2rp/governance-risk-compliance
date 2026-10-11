export const downloadCsv = (filename, headers, rows) => {
    const quote = (value) => '"' + String(value ?? "").replaceAll('"', '""') + '"';
    const contents = [headers, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
    const file = new Blob(["\uFEFF" + contents], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};
