// ========================================
// ABC Analysis — Pareto Classification
// ========================================

/**
 * Classify products into A, B, C categories based on demand volume
 * A = top 80% of cumulative demand
 * B = next 15%
 * C = remaining 5%
 * 
 * @param {Array} products - Array of products with totalDemand or weeklyDemand
 * @returns {Array} Products sorted by demand DESC with abcClass and cumulativePercent
 */
export function classifyABC(products) {
    if (!products || products.length === 0) return [];

    // Calculate total demand for each product
    const withTotal = products.map(p => ({
        ...p,
        totalDemand: p.totalDemand || (p.weeklyDemand || 0) * 4 ||
            (p.demandHistory ? p.demandHistory.reduce((s, v) => s + v, 0) : 0)
    }));

    // Sort by demand descending
    const sorted = [...withTotal].sort((a, b) => b.totalDemand - a.totalDemand);

    const grandTotal = sorted.reduce((sum, p) => sum + p.totalDemand, 0);
    if (grandTotal === 0) return sorted.map(p => ({ ...p, abcClass: 'C', cumulativePercent: 0, demandPercent: 0 }));

    let cumulative = 0;
    return sorted.map(p => {
        const demandPercent = (p.totalDemand / grandTotal) * 100;
        cumulative += demandPercent;

        let abcClass;
        if (cumulative <= 80) {
            abcClass = 'A';
        } else if (cumulative <= 95) {
            abcClass = 'B';
        } else {
            abcClass = 'C';
        }

        return {
            ...p,
            demandPercent: Math.round(demandPercent * 10) / 10,
            cumulativePercent: Math.round(cumulative * 10) / 10,
            abcClass
        };
    });
}
