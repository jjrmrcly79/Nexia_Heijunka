// ========================================
// Lean Calculations — Pure Functions
// ========================================

/**
 * Calculate Takt Time
 * @param {number} availableTime - Available production time per shift (minutes)
 * @param {number} totalDemand - Total demand per shift (units)
 * @returns {number} Takt time in seconds
 */
export function calcTaktTime(availableTime, totalDemand) {
  if (!totalDemand || totalDemand <= 0) return 0;
  return (availableTime * 60) / totalDemand;
}

/**
 * Calculate Pitch
 * @param {number} taktTimeSeconds - Takt time in seconds
 * @param {number} packQuantity - Units per container/pack
 * @returns {number} Pitch in minutes
 */
export function calcPitch(taktTimeSeconds, packQuantity) {
  if (!packQuantity || packQuantity <= 0) return 0;
  return (taktTimeSeconds * packQuantity) / 60;
}

/**
 * Calculate EPEI (Every Part Every Interval)
 * @param {Array} products - Array of products with setupTime and runTimePerUnit
 * @param {number} availableTime - Available time in minutes
 * @param {number} totalDemand - Total demand across all products
 * @returns {object} { epeiDays, totalSetupTime, totalRunTime, availableForSetup }
 */
export function calcEPEI(products, availableTime, totalDemand) {
  if (!products || products.length === 0) {
    return { epeiDays: 0, totalSetupTime: 0, totalRunTime: 0, availableForSetup: 0 };
  }

  const totalSetupTime = products.reduce((sum, p) => sum + (p.setupTime || 0), 0);
  const totalRunTime = products.reduce((sum, p) => {
    const demand = p.demandPerDay || (p.weeklyDemand ? p.weeklyDemand / 5 : 0);
    return sum + demand * (p.runTimePerUnit || 0);
  }, 0);

  const availableForSetup = availableTime - totalRunTime;

  if (availableForSetup <= 0) {
    return { epeiDays: Infinity, totalSetupTime, totalRunTime, availableForSetup: 0 };
  }

  // EPEI = total setup time / available time for setups = how many days needed to cycle all products
  const epeiDays = totalSetupTime / availableForSetup;

  return {
    epeiDays: Math.max(epeiDays, 0),
    totalSetupTime,
    totalRunTime,
    availableForSetup: Math.max(availableForSetup, 0)
  };
}

/**
 * Level volume: distribute weekly demand evenly across working days
 * @param {Array} products - Array of products with weeklyDemand
 * @param {number} workingDays - Working days per week
 * @returns {Array} Products with dailyQuota added
 */
export function levelVolume(products, workingDays = 5) {
  if (!products || workingDays <= 0) return [];
  return products.map(p => ({
    ...p,
    dailyQuota: Math.ceil((p.weeklyDemand || 0) / workingDays)
  }));
}

/**
 * Level mix: create interleaved production pattern
 * @param {Array} products - Array of products with dailyQuota
 * @returns {Array} Sequence of product IDs/names in interleaved order
 */
export function levelMix(products) {
  if (!products || products.length === 0) return [];

  // Filter products with demand
  const withDemand = products.filter(p => (p.dailyQuota || 0) > 0);
  if (withDemand.length === 0) return [];

  const totalDaily = withDemand.reduce((sum, p) => sum + p.dailyQuota, 0);
  const sequence = [];

  // Create a working copy with remaining quotas
  const remaining = withDemand.map(p => ({
    ...p,
    remaining: p.dailyQuota,
    ratio: p.dailyQuota / totalDaily
  }));

  // Generate interleaved sequence using largest remainder method
  for (let i = 0; i < totalDaily; i++) {
    // Sort by remaining/total ratio — pick the one most "behind"
    remaining.sort((a, b) => {
      const aCredit = a.remaining / a.dailyQuota;
      const bCredit = b.remaining / b.dailyQuota;
      if (Math.abs(aCredit - bCredit) < 0.001) {
        return b.dailyQuota - a.dailyQuota; // tie-break by volume
      }
      return bCredit - aCredit;
    });

    const next = remaining[0];
    sequence.push({
      id: next.id,
      name: next.name,
      sku: next.sku,
      color: next.color
    });
    next.remaining--;
  }

  return sequence;
}

/**
 * Generate Heijunka intervals based on pitch
 * @param {number} availableTime - Available time in minutes
 * @param {number} pitchMinutes - Pitch interval in minutes
 * @returns {Array} Array of interval objects with start/end times
 */
export function generateIntervals(availableTime, pitchMinutes) {
  if (!pitchMinutes || pitchMinutes <= 0) return [];
  const intervals = [];
  let time = 0;
  let idx = 0;
  while (time + pitchMinutes <= availableTime) {
    intervals.push({
      index: idx,
      startMin: time,
      endMin: time + pitchMinutes,
      label: `${formatTime(time)} – ${formatTime(time + pitchMinutes)}`
    });
    time += pitchMinutes;
    idx++;
  }
  return intervals;
}

function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}:${m.toString().padStart(2, '0')}`;
}
