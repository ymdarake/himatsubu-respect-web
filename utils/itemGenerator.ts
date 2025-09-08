import { Equipment, ShopType, EquipmentMaster } from '../types';
import { EQUIPMENT_MASTER_DATA } from '../data/equipmentMaster';
import { equipmentFactory } from './equipmentFactory';


// Define which items are available in which area tier
const ITEM_POOL_BY_AREA_TIER: Record<number, { masterId: string }[]> = {
    0: [
        { masterId: 'wpn_short_sword' },
        { masterId: 'arm_leather_vest' },
        { masterId: 'acc_speed_ring' },
    ],
    1: [
        { masterId: 'wpn_short_sword' },
        { masterId: 'wpn_fire_rod' },
        { masterId: 'arm_iron_plate' },
        { masterId: 'acc_speed_ring' },
    ],
    2: [
        { masterId: 'wpn_long_sword' },
        { masterId: 'wpn_fire_rod' },
        { masterId: 'arm_iron_plate' },
        { masterId: 'acc_power_glove' },
    ],
    3: [
        { masterId: 'wpn_long_sword' },
        { masterId: 'wpn_ice_brand' },
        { masterId: 'arm_steel_armor' },
        { masterId: 'acc_power_glove' },
    ],
};


const getAvailableItemsForArea = (areaIndex: number, type: ShopType | 'any'): EquipmentMaster[] => {
    const tier = Math.min(areaIndex, Object.keys(ITEM_POOL_BY_AREA_TIER).length - 1);
    const pool = ITEM_POOL_BY_AREA_TIER[tier] || ITEM_POOL_BY_AREA_TIER[0];
    
    let equipmentTypeFilter: string = '';
    if (type === 'weapon_shop') equipmentTypeFilter = 'weapon';
    if (type === 'armor_shop') equipmentTypeFilter = 'armor';
    if (type === 'accessory_shop') equipmentTypeFilter = 'accessory';
    
    const masterItems = pool
        .map(item => EQUIPMENT_MASTER_DATA.find(master => master.masterId === item.masterId))
        .filter((item): item is EquipmentMaster => !!item);

    if (equipmentTypeFilter) {
        return masterItems.filter(item => item.type === equipmentTypeFilter);
    }
    return masterItems;
};

export const generateRandomEquipment = (areaIndex: number): Equipment => {
    const availableItems = getAvailableItemsForArea(areaIndex, 'any');
    if (availableItems.length === 0) {
        return equipmentFactory('wpn_short_sword', 0)!;
    }
    const randomMasterItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    // Level can be +/- 1 from the area index
    const level = Math.max(0, areaIndex + Math.floor(Math.random() * 3) - 1);

    const newItem = equipmentFactory(randomMasterItem.masterId, level);
    
    // Fallback in case factory fails
    return newItem || equipmentFactory('wpn_short_sword', 0)!;
};

export const generateShopItems = (shopType: ShopType, areaIndex: number): Equipment[] => {
    const items: Equipment[] = [];
    const availableMasterItems = getAvailableItemsForArea(areaIndex, shopType);

    // Ensure we have some items to show, even if the pool is small for the type
    const itemsToGenerate = availableMasterItems.length > 0 ? availableMasterItems.slice(0, 3) : [];
    
    for (const masterItem of itemsToGenerate) {
        // Generate items with slightly varying levels for the shop
        const baseLevel = areaIndex;
        const level = Math.max(0, baseLevel + Math.floor(Math.random() * 3) - 1);
        const newItem = equipmentFactory(masterItem.masterId, level);
        if (newItem) {
            items.push(newItem);
        }
    }
    
    // If shop is empty, add a default item to ensure it's not blank
    if (items.length === 0) {
        const defaultMasterId = shopType === 'weapon_shop' ? 'wpn_short_sword' : shopType === 'armor_shop' ? 'arm_leather_vest' : 'acc_speed_ring';
        const fallbackItem = equipmentFactory(defaultMasterId, areaIndex);
        if (fallbackItem) items.push(fallbackItem);
    }

    return items;
};