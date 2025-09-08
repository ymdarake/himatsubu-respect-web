import { Equipment, ShopType, EquipmentType, Element } from '../types';
import { ELEMENTAL_PREFIXES } from '../constants';

export const generateRandomEquipment = (areaIndex: number): Equipment => {
    const tier = areaIndex;
    const prefixes = ["頑丈な", "上等な", "見事な", "きらめく", "古代の"];
    const prefix = prefixes[Math.min(tier, prefixes.length - 1)];

    const shopTypes: ShopType[] = ['weapon_shop', 'armor_shop', 'accessory_shop'];
    const shopType = shopTypes[Math.floor(Math.random() * shopTypes.length)];
    
    let name = "";
    let stats: Equipment['stats'] = {};
    let type: EquipmentType = 'weapon';
    const elementalDamages: Partial<Record<Element, number>> = {};
    let elementalPrefix = '';
    
    const qualityMultiplier = 1 + (Math.random() * 0.4 - 0.1); // -10% to +30% quality variation

    if (shopType === 'weapon_shop') {
      type = 'weapon';
      stats.physicalAttack = Math.ceil((5 + tier * 4) * qualityMultiplier);
      if (Math.random() < 0.8) {
          let elements: Element[] = ['火', '水', '風', '土', '光', '闇'];
          const numElements = 1 + (tier > 1 && Math.random() < 0.2 ? 1 : 0); // Chance for 2nd element
          for (let i = 0; i < numElements && elements.length > 0; i++) {
              const randomElement = elements.splice(Math.floor(Math.random() * elements.length), 1)[0];
              elementalDamages[randomElement] = Math.ceil((8 + tier * 3) * qualityMultiplier * (numElements > 1 ? 0.7 : 1));
          }
      }
      const elementsInWeapon = Object.keys(elementalDamages) as Element[];
      if (elementsInWeapon.length > 0) {
          elementalPrefix = ELEMENTAL_PREFIXES[elementsInWeapon[0]] + '・';
      }
      name = `${prefix}${elementalPrefix}ブレード`;
    } else if (shopType === 'armor_shop') {
      type = 'armor';
      name = `${prefix}ガード`;
      stats.physicalDefense = Math.ceil((3 + tier * 2) * qualityMultiplier);
      stats.maxHp = Math.ceil((10 + tier * 5) * qualityMultiplier);
    } else { // accessory_shop
      type = 'accessory';
      name = `${prefix}トーテム`;
      stats.speed = Math.ceil((2 + tier * 1) * qualityMultiplier);
      stats.luckValue = Math.ceil((2 + tier * 1) * qualityMultiplier);
    }
    
    const elementalPowerSum = Object.values(elementalDamages).reduce((a, b) => a + (b || 0), 0);
    const price = Math.floor((Object.values(stats).reduce((a, b) => a + (b || 0), 0) + elementalPowerSum) * 8);

    return { id: `drop-${Date.now()}`, name, type, stats, price, elementalDamages };
};

export const generateShopItems = (shopType: ShopType, areaIndex: number): Equipment[] => {
    const items: Equipment[] = [];
    const tier = areaIndex;
    const prefixes = ["頑丈な", "上等な", "見事な", "きらめく", "古代の"];
    const prefix = prefixes[Math.min(tier, prefixes.length - 1)];

    for (let i = 0; i < 3; i++) {
      const qualityMultiplier = 1 + (i * 0.3);
      let name = "";
      let stats: Equipment['stats'] = {};
      let type: EquipmentType = 'weapon';
      const elementalDamages: Partial<Record<Element, number>> = {};
      let elementalPrefix = '';

      if (shopType === 'weapon_shop') {
        type = 'weapon';
        stats.physicalAttack = Math.ceil((5 + tier * 4) * qualityMultiplier);
        if (Math.random() < 0.8) {
            let elements: Element[] = ['火', '水', '風', '土', '光', '闇'];
            const numElements = 1 + (tier > 1 && Math.random() < 0.2 ? 1 : 0);
            for (let j = 0; j < numElements && elements.length > 0; j++) {
                const randomElement = elements.splice(Math.floor(Math.random() * elements.length), 1)[0];
                elementalDamages[randomElement] = Math.ceil((8 + tier * 3) * qualityMultiplier * (numElements > 1 ? 0.7 : 1));
            }
        }
        const elementsInWeapon = Object.keys(elementalDamages) as Element[];
        if (elementsInWeapon.length > 0) {
            elementalPrefix = ELEMENTAL_PREFIXES[elementsInWeapon[0]] + '・';
        }
        name = `${prefix}${elementalPrefix}ソード`;
      } else if (shopType === 'armor_shop') {
        type = 'armor';
        name = `${prefix}メイル`;
        stats.physicalDefense = Math.ceil((3 + tier * 2) * qualityMultiplier);
        stats.maxHp = Math.ceil((10 + tier * 5) * qualityMultiplier);
      } else { // accessory_shop
        type = 'accessory';
        name = `${prefix}リング`;
        stats.speed = Math.ceil((2 + tier * 1) * qualityMultiplier);
        stats.luckValue = Math.ceil((2 + tier * 1) * qualityMultiplier);
      }
      
      if (i === 1) name = name.replace("ソード", "アックス").replace("メイル", "プレート").replace("リング", "アミュレット");
      if (i === 2) name = name.replace("ソード", "スピア").replace("メイル", "ヘルム").replace("リング", "チャーム");

      const elementalPowerSum = Object.values(elementalDamages).reduce((a, b) => a + (b || 0), 0);
      const price = Math.floor((Object.values(stats).reduce((a, b) => a + (b || 0), 0) + elementalPowerSum) * 8 * (1 + tier * 0.5));

      items.push({ id: `${shopType}-${tier}-${i}`, name, type, stats, price, elementalDamages });
    }
    return items;
};