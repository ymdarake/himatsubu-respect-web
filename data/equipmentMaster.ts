import { EquipmentMaster } from '../types';
import { WEAPON_MASTER_DATA } from './weapons';
import { ARMOR_MASTER_DATA } from './armor';
import { ACCESSORY_MASTER_DATA } from './accessories';

export const EQUIPMENT_MASTER_DATA: EquipmentMaster[] = [
  ...WEAPON_MASTER_DATA,
  ...ARMOR_MASTER_DATA,
  ...ACCESSORY_MASTER_DATA,
];
