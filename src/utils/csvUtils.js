import Papa from 'papaparse';

/**
 * Parse CSV text to array of objects
 */
export function parseCSV(csvText) {
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: h => h.trim().toLowerCase().replace(/\s+/g, '_')
    });
    return result.data;
}

/**
 * Parse CSV file (File object) to array of objects
 */
export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: h => h.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: (results) => resolve(results.data),
            error: (err) => reject(err)
        });
    });
}

/**
 * Export array of objects to CSV and trigger download
 */
export function exportCSV(data, filename = 'export.csv') {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
