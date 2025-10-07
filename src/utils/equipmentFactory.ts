import { Equipment, DerivedStat, Element } from '../types';
import { EQUIPMENT_MASTER_DATA } from '../data/equipmentMaster';

export const equipmentFactory = (masterId: string, level: number): Equipment | null => {
  const masterData = EQUIPMENT_MASTER_DATA.find(e => e.masterId === masterId);
  if (!masterData) {
    console.error(`Equipment master data not found for masterId: ${masterId}`);
    return null;
  }

  const calculatedStats: Partial<Record<DerivedStat, number>> = {};
  for (const [stat, baseValue] of Object.entries(masterData.baseStats)) {
    if (baseValue !== undefined) {
      const growthValue = masterData.statGrowth[stat as DerivedStat] || 0;
      calculatedStats[stat as DerivedStat] = baseValue + (growthValue * level);
    }
  }

  const calculatedElementalDamages: Partial<Record<Element, number>> = {};
  if (masterData.elementalDamages) {
    for (const [element, baseValue] of Object.entries(masterData.elementalDamages)) {
      if (baseValue !== undefined) {
        const growthValue = masterData.elementalDamageGrowth?.[element as Element] || 0;
        const rawValue = baseValue + (growthValue * level);
        
        // Round to the nearest multiple of 5
        const roundedValue = Math.round(rawValue / 5) * 5;

        // If the value is positive after rounding, enforce a minimum of 10.
        // This makes elemental damage more meaningful and avoids trivially small values.
        const finalValue = roundedValue > 0 ? Math.max(10, roundedValue) : 0;
        
        if (finalValue > 0) {
            calculatedElementalDamages[element as Element] = finalValue;
        }
      }
    }
  }

  const instance: Equipment = {
    instanceId: `${masterId}-${level}-${Date.now()}-${Math.random()}`,
    masterId: masterData.masterId,
    level: level,
    name: `${masterData.name} Lv.${level + 1}`,
    type: masterData.type,
    stats: calculatedStats,
    price: masterData.basePrice + (masterData.priceGrowth * level),
    elementalDamages: Object.keys(calculatedElementalDamages).length > 0 ? calculatedElementalDamages : undefined,
  };

  return instance;
};