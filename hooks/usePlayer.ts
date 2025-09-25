import { useState, useCallback } from 'react';
import { Player, Equipment, AllocatableStat, BaseStats } from '../types';
import { INITIAL_PLAYER } from '../constants/player';
import { calculateDerivedStats } from '../utils/statCalculations';

// 初期プレイヤー状態を返すヘルパー
const getInitialPlayerState = (): Player => ({
    ...INITIAL_PLAYER,
    currentHp: calculateDerivedStats(INITIAL_PLAYER).maxHp,
});

export const usePlayer = () => {
  const [player, setPlayer] = useState<Player>(getInitialPlayerState());

  const resetPlayer = useCallback(() => {
    setPlayer(getInitialPlayerState());
  }, []);
  
  const resetPlayerForDeath = useCallback(() => {
    setPlayer(prevPlayer => {
        const preservedPlayer = {
            ...INITIAL_PLAYER,
            baseStats: {...prevPlayer.baseStats},
            equipment: {...prevPlayer.equipment},
            inventory: [...prevPlayer.inventory],
            level: prevPlayer.level,
            xp: prevPlayer.xp,
            xpToNextLevel: prevPlayer.xpToNextLevel,
            gold: prevPlayer.gold,
            statPoints: prevPlayer.statPoints,
            lastStatAllocation: prevPlayer.lastStatAllocation,
            isStatAllocationLocked: prevPlayer.isStatAllocationLocked,
        };
        return {
            ...preservedPlayer,
            currentHp: calculateDerivedStats(preservedPlayer).maxHp,
        }
    });
  }, []);

  const loadPlayer = useCallback((playerToLoad: Player) => {
      setPlayer(playerToLoad);
  }, []);

  const handleHeal = useCallback((addLog: (msg: string) => void) => {
    setPlayer(p => {
        const cost = p.level * 7;
        const stats = calculateDerivedStats(p);
        if (p.gold >= cost && p.currentHp < stats.maxHp) {
            addLog(`HPが全回復した！ (-${cost}G)`);
            return {
                ...p,
                currentHp: stats.maxHp,
                gold: p.gold - cost,
            };
        }
        if (p.gold < cost) {
            addLog(`ゴールドが足りない！`);
        } else if (p.currentHp >= stats.maxHp) {
            addLog('HPはすでに満タンだ。');
        }
        return p;
    });
  }, []);

  const handleBuyItem = useCallback((itemToBuy: Equipment, trackEquipmentCollection: (item: Equipment) => void, addLog: (msg: string) => void) => {
    setPlayer(p => {
        if (p.gold < itemToBuy.price) {
            return p;
        }

        const allPlayerItems = [...p.inventory, ...Object.values(p.equipment).filter((e): e is Equipment => e !== null)];
        const maxExistingLevel = allPlayerItems
            .filter(i => i.masterId === itemToBuy.masterId)
            .reduce((max, item) => Math.max(max, item.level), -1);

        if (itemToBuy.level <= maxExistingLevel) {
            addLog(`すでに「${itemToBuy.name}」の同等以上のものを持っています。`);
            return p; 
        }

        trackEquipmentCollection(itemToBuy);
        addLog(`「${itemToBuy.name}」を購入して装備した。`);

        const playerAfterPurchase = { ...p, gold: p.gold - itemToBuy.price };
        
        let newInventory = playerAfterPurchase.inventory.filter(i => i.masterId !== itemToBuy.masterId);
        
        const previouslyEquipped = playerAfterPurchase.equipment[itemToBuy.type];
        
        if (previouslyEquipped && previouslyEquipped.masterId !== itemToBuy.masterId) {
            newInventory.push(previouslyEquipped);
        }

        const newEquipment = { ...playerAfterPurchase.equipment, [itemToBuy.type]: itemToBuy };

        return { ...playerAfterPurchase, inventory: newInventory, equipment: newEquipment };
    });
  }, []);

  const handleEquipItem = useCallback((itemToEquip: Equipment) => {
    setPlayer(p => {
        const newInventory = [...p.inventory];
        const newEquipment = { ...p.equipment };
        const currentlyEquipped = p.equipment[itemToEquip.type];

        // Find and remove item from inventory
        const itemIndex = newInventory.findIndex(invItem => invItem.instanceId === itemToEquip.instanceId);
        if (itemIndex > -1) {
            newInventory.splice(itemIndex, 1);
        }

        // Add previously equipped item back to inventory
        if (currentlyEquipped) {
            newInventory.push(currentlyEquipped);
        }

        // Equip the new item
        newEquipment[itemToEquip.type] = itemToEquip;

        return { ...p, equipment: newEquipment, inventory: newInventory };
    });
  }, []);

  const handleUnequipItem = useCallback((itemToUnequip: Equipment) => {
      setPlayer(p => {
          const newInventory = [...p.inventory, itemToUnequip];
          const newEquipment = { ...p.equipment };

          newEquipment[itemToUnequip.type] = null;

          return { ...p, equipment: newEquipment, inventory: newInventory };
      });
  }, []);

  const handleStatAllocation = useCallback((allocatedStats: Record<AllocatableStat, number>) => {
    setPlayer(p => {
        const newBaseStats: BaseStats = { ...p.baseStats };
        let hpChange = 10; // Base HP gain from level up
        for (const [stat, value] of Object.entries(allocatedStats)) {
            newBaseStats[stat as AllocatableStat] += value as number;
        }
        
        hpChange += ((allocatedStats.stamina as number) || 0) * 10;
        hpChange += ((allocatedStats.strength as number) || 0) * 2;

        return {
            ...p,
            baseStats: newBaseStats,
            statPoints: 0,
            currentHp: p.currentHp + hpChange,
            lastStatAllocation: allocatedStats,
        };
    });
  }, []);

  const toggleStatAllocationLock = useCallback(() => {
    setPlayer(p => ({
      ...p,
      isStatAllocationLocked: !p.isStatAllocationLocked,
    }));
  }, []);


  return {
    player,
    setPlayer,
    resetPlayer,
    resetPlayerForDeath,
    loadPlayer,
    handleHeal,
    handleBuyItem,
    handleEquipItem,
    handleUnequipItem,
    handleStatAllocation,
    toggleStatAllocationLock,
  };
};