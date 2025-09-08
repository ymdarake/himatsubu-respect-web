import { Equipment, ShopType, EquipmentMaster } from '../types';
import { EQUIPMENT_MASTER_DATA } from '../data/equipmentMaster';
import { equipmentFactory } from './equipmentFactory';

// Defines which items are available in which area tier.
// Higher tiers include items from lower tiers to increase variety.
const ITEM_POOLS: Record<string, string[]> = {
    wpn_t0: ['wpn_short_sword', 'wpn_hand_axe', 'wpn_dagger', 'wpn_fire_rod', 'wpn_club', 'wpn_staff', 'wpn_water_knife'],
    wpn_t1: ['wpn_long_sword', 'wpn_saber', 'wpn_spear', 'wpn_wind_spear', 'wpn_iron_axe', 'wpn_mace', 'wpn_light_wand', 'wpn_gladius', 'wpn_javelin'],
    wpn_t2: ['wpn_broadsword', 'wpn_battle_axe', 'wpn_main_gauche', 'wpn_heavy_lance', 'wpn_ice_brand', 'wpn_claymore', 'wpn_flail', 'wpn_rock_hammer', 'wpn_scimitar', 'wpn_dark_rod', 'wpn_zweihander', 'wpn_cutlass'],
    wpn_t3: ['wpn_mithril_sword', 'wpn_estoc', 'wpn_earth_hammer', 'wpn_thunder_staff', 'wpn_warhammer', 'wpn_poison_dagger', 'wpn_silver_sword', 'wpn_trident', 'wpn_partisan', 'wpn_shamshir'],
    wpn_t4: ['wpn_flamberge', 'wpn_rune_blade', 'wpn_rapier', 'wpn_katana', 'wpn_holy_lance', 'wpn_great_axe', 'wpn_morning_star', 'wpn_wizard_staff', 'wpn_gale_bow', 'wpn_crystal_sword', 'wpn_ogre_killer', 'wpn_runic_axe'],
    wpn_t5: ['wpn_vorpal_sword', 'wpn_executioner', 'wpn_assassins_knife', 'wpn_dark_scythe', 'wpn_staff_of_wisdom', 'wpn_masamune', 'wpn_defender', 'wpn_magus_rod', 'wpn_blood_sword', 'wpn_gothic_rod', 'wpn_zwill_blade', 'wpn_titans_glove', 'wpn_deathbringer'],
    wpn_t6: ['wpn_excalibur', 'wpn_gungnir', 'wpn_mjolnir', 'wpn_ragnarok', 'wpn_ultima_weapon', 'wpn_muramasa', 'wpn_staff_of_the_magi', 'wpn_dragon_whisker', 'wpn_holy_rod', 'wpn_kaiser_knuckle', 'wpn_chaos_blade', 'wpn_lightbringer', 'wpn_save_the_queen', 'wpn_heavenly_axis', 'wpn_apocalypse'],

    arm_t0: ['arm_leather_vest', 'arm_cloth_robe', 'arm_hard_leather', 'arm_copper_plate', 'arm_wind_mantle', 'arm_student_uniform', 'arm_travelers_garb'],
    arm_t1: ['arm_chain_mail', 'arm_iron_plate', 'arm_ring_mail', 'arm_mage_robe', 'arm_silk_robe', 'arm_kenpo_gi', 'arm_flame_mail', 'arm_ice_armor', 'arm_bone_mail', 'arm_black_robe'],
    arm_t2: ['arm_bronze_armor', 'arm_scale_mail', 'arm_silver_plate', 'arm_ninja_suit', 'arm_earth_garb', 'arm_sorcerers_robe', 'arm_plate_mail', 'arm_viking_mail'],
    arm_t3: ['arm_steel_armor', 'arm_mithril_chain', 'arm_elemental_garb', 'arm_wyvern_mail', 'arm_white_robe', 'arm_black_garb', 'arm_golden_armor', 'arm_gaia_gear', 'arm_red_jacket'],
    arm_t4: ['arm_knights_armor', 'arm_sages_surplice', 'arm_brigandine', 'arm_dark_armor', 'arm_diamond_armor', 'arm_reflect_mail', 'arm_power_vest', 'arm_luminous_robe', 'arm_genji_armor', 'arm_brave_suit'],
    arm_t5: ['arm_shadow_garb', 'arm_dragon_mail', 'arm_crystal_armor', 'arm_holy_armor', 'arm_mirror_mail', 'arm_carabineer_mail', 'arm_judges_robe', 'arm_force_armor', 'arm_demon_mail', 'arm_goddess_gown'],
    arm_t6: ['arm_robe_of_lords', 'arm_adamant_armor', 'arm_maximillian', 'arm_aegis_shield', 'arm_grand_armor', 'arm_minerva_bustier', 'arm_dragon_lord_armor', 'arm_behemoth_plate', 'arm_celestial_garb', 'arm_chaos_armor'],

    acc_t0: ['acc_speed_ring', 'acc_power_wrist', 'acc_vitality_charm', 'acc_magic_earring', 'acc_leather_gloves', 'acc_flame_ring', 'acc_tough_ring', 'acc_buckler', 'acc_sandals'],
    acc_t1: ['acc_lucky_clover', 'acc_talisman', 'acc_gauntlet', 'acc_battle_boots', 'acc_aqua_pendant', 'acc_gale_charm', 'acc_iron_bangle', 'acc_earring'],
    acc_t2: ['acc_power_glove', 'acc_mithril_bangle', 'acc_silver_spectacles', 'acc_amulet', 'acc_circlet', 'acc_stone_belt', 'acc_shadow_orb', 'acc_warrior_ring', 'acc_glass_tiara', 'acc_thieves_armlet'],
    acc_t3: ['acc_sages_ring', 'acc_hermes_sandals', 'acc_barrier_ring', 'acc_giant_belt', 'acc_berserkers_ring', 'acc_mage_gloves', 'acc_running_shoes', 'acc_holy_symbol', 'acc_titans_belt', 'acc_mythril_gloves'],
    acc_t4: ['acc_hyper_wrist', 'acc_angel_ring', 'acc_sorcerers_mantle', 'acc_elf_cloak', 'acc_sorcerers_shoes', 'acc_diamond_ring', 'acc_feather_hat', 'acc_champions_belt', 'acc_elemental_charm'],
    acc_t5: ['acc_thiefs_glove', 'acc_black_belt', 'acc_lapis_lazuli', 'acc_gold_hairpin', 'acc_protect_ring', 'acc_assassins_ring', 'acc_archmage_hat', 'acc_genji_glove', 'acc_crystal_orb'],
    acc_t6: ['acc_heros_badge', 'acc_ribbon', 'acc_sovereigns_ring', 'acc_cursed_ring', 'acc_safety_bit', 'acc_soul_of_thamasa', 'acc_ultima_pendant', 'acc_luna_crest', 'acc_valkyrie_profile'],
};

const buildTierPool = (tier: number) => {
    let pool: string[] = [];
    for (let i = 0; i <= tier; i++) {
        pool = pool.concat(
            ITEM_POOLS[`wpn_t${i}`] || [],
            ITEM_POOLS[`arm_t${i}`] || [],
            ITEM_POOLS[`acc_t${i}`] || []
        );
    }
    return pool.map(masterId => ({ masterId }));
};

const ITEM_POOL_BY_AREA_TIER: Record<number, { masterId: string }[]> = {
    0: buildTierPool(0), // Area 0-9
    1: buildTierPool(1), // Area 10-19
    2: buildTierPool(2), // Area 20-29
    3: buildTierPool(3), // Area 30-39
    4: buildTierPool(4), // Area 40-49
    5: buildTierPool(5), // Area 50-59
    6: buildTierPool(6), // Area 60+
};

const getAvailableItemsForArea = (areaIndex: number, type: ShopType | 'any'): EquipmentMaster[] => {
    const tier = Math.min(Math.floor(areaIndex / 10), Object.keys(ITEM_POOL_BY_AREA_TIER).length - 1);
    const pool = ITEM_POOL_BY_AREA_TIER[tier] || ITEM_POOL_BY_AREA_TIER[0];
    
    let equipmentTypeFilter: string | null = null;
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
    
    const levelVariance = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const level = Math.max(0, areaIndex + levelVariance);

    const newItem = equipmentFactory(randomMasterItem.masterId, level);
    
    return newItem || equipmentFactory('wpn_short_sword', 0)!;
};

export const generateShopItems = (shopType: ShopType, areaIndex: number): Equipment[] => {
    const items: Equipment[] = [];
    const availableMasterItems = getAvailableItemsForArea(areaIndex, shopType);

    // Shuffle and pick up to 5 unique items to display
    const shuffled = availableMasterItems.sort(() => 0.5 - Math.random());
    const itemsToGenerate = shuffled.slice(0, 5);
    
    for (const masterItem of itemsToGenerate) {
        const levelVariance = Math.floor(Math.random() * 3) - 1; // -1 to +1
        const level = Math.max(0, areaIndex + levelVariance);
        const newItem = equipmentFactory(masterItem.masterId, level);
        if (newItem) {
            items.push(newItem);
        }
    }
    
    // Fallback if shop is empty
    if (items.length === 0) {
        const defaultMasterId = shopType === 'weapon_shop' ? 'wpn_short_sword' : shopType === 'armor_shop' ? 'arm_leather_vest' : 'acc_speed_ring';
        const fallbackItem = equipmentFactory(defaultMasterId, areaIndex);
        if (fallbackItem) items.push(fallbackItem);
    }

    return items.sort((a, b) => a.price - b.price);
};