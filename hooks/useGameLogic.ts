import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, Enemy, Player as PlayerType, Structure, ShopType, Equipment, AllocatableStat, BaseStats, Gem, SceneryObject, PlayStats, Element, DamageInstance, DamageInfo } from '../types';
import { AREAS, INITIAL_PLAYER, GAME_SPEED, ATTACK_RANGE, STAGE_LENGTH, XP_FOR_NEXT_LEVEL_MULTIPLIER, HEALING_HOUSE_RANGE, PIXELS_PER_METER, LUCK_TO_GOLD_MULTIPLIER, SHOP_RANGE, STAT_POINTS_PER_LEVEL, BASE_DROP_CHANCE, LUCK_TO_DROP_CHANCE_MULTIPLIER, INITIAL_PLAY_STATS, ELEMENTAL_AFFINITY, ELEMENT_HEX_COLORS, ATTACK_SPEED_LEVELS, ENEMY_PANEL_DISPLAY_RANGE } from '../constants';
import { playSound, resumeAudioContext, playBGM, stopBGM } from '../utils/audio';
import { calculateDerivedStats } from '../utils/statCalculations';
import { generateRandomEquipment, generateShopItems } from '../utils/itemGenerator';
import { spawnStructuresForStage, spawnSceneryForStage, spawnEnemiesForStage } from '../utils/worldGenerator';

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};

const addEquipmentToPlayer = (player: PlayerType, newItem: Equipment, trackEquipment: (item: Equipment) => void, logFn: (msg: string) => void): PlayerType => {
    const allPlayerItems = [
        ...player.inventory,
        ...Object.values(player.equipment).filter((e): e is Equipment => e !== null)
    ];

    const existingVersions = allPlayerItems.filter(i => i.masterId === newItem.masterId);
    const maxExistingLevel = existingVersions.reduce((max, item) => Math.max(max, item.level), -1);

    if (newItem.level <= maxExistingLevel) {
        logFn(`${newItem.name}はすでに同等以上のものを持っているため、処分した。`);
        return player;
    }
    
    trackEquipment(newItem);
    const newPlayerState = { ...player };

    newPlayerState.inventory = player.inventory.filter(i => i.masterId !== newItem.masterId);

    const equippedSlot = (Object.keys(player.equipment) as Array<keyof typeof player.equipment>)
        .find(slot => player.equipment[slot]?.masterId === newItem.masterId);
    
    if (equippedSlot) {
        newPlayerState.equipment = { ...player.equipment, [equippedSlot]: newItem };
        logFn(`✨ ${newItem.name}を入手し、古いものと交換して装備した！`);
    } else {
        newPlayerState.inventory.push(newItem);
        logFn(`✨ ${newItem.name}を見つけて持ち物に追加した！`);
    }
    
    return newPlayerState;
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [player, setPlayer] = useState<PlayerType>(INITIAL_PLAYER);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [scenery, setScenery] = useState<SceneryObject[]>([]);
  const [distance, setDistance] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [playerAction, setPlayerAction] = useState<'attack' | 'hit' | undefined>(undefined);
  const [playerAttackDirection, setPlayerAttackDirection] = useState<'left' | 'right'>('right');
  const [enemyHits, setEnemyHits] = useState<Record<number, boolean>>({});
  const [log, setLog] = useState<string[]>([]);
  const [shopData, setShopData] = useState<{type: ShopType, items: Equipment[]} | null>(null);
  const [shopPrompt, setShopPrompt] = useState<boolean>(false);
  const [housePrompt, setHousePrompt] = useState<boolean>(false);
  const [engagedEnemyId, setEngagedEnemyId] = useState<number | null>(null);
  const [displayedEnemyId, setDisplayedEnemyId] = useState<number | null>(null);
  const [playStats, setPlayStats] = useState<PlayStats>(INITIAL_PLAY_STATS);
  const [goldDrops, setGoldDrops] = useState<{id: number, x: number}[]>([]);
  const [damageInstances, setDamageInstances] = useState<DamageInstance[]>([]);

  const nextEnemyId = useRef(0);
  const rightArrowPressed = useRef(false);
  const leftArrowPressed = useRef(false);
  const gameViewRef = useRef<HTMLDivElement>(null);
  const [gameViewWidth, setGameViewWidth] = useState(0);
  const shopTarget = useRef<Structure | null>(null);
  const houseTarget = useRef<Structure | null>(null);
  const nextSceneryId = useRef(0);
  const nextGoldDropId = useRef(0);
  const nextDamageInstanceId = useRef(0);
  const playerAttackReady = useRef(true);
  const enemyAttackTimers = useRef<Record<number, number>>({});

  const addLog = useCallback((message: string) => {
    setLog(prevLog => [message, ...prevLog].slice(0, 50));
  }, []);

  const calculatedStats = useMemo(() => calculateDerivedStats(player), [player]);
  
  const displayedEnemy = useMemo(() => enemies.find(e => e.id === displayedEnemyId), [enemies, displayedEnemyId]);
  const currentAreaIndex = Math.floor(stageIndex / 10);
  const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

  const loadStage = useCallback((index: number) => {
      if (index === 0) {
          nextEnemyId.current = 0;
          nextSceneryId.current = 0;
      }
      setEnemies(spawnEnemiesForStage(index, nextEnemyId));
      setScenery(spawnSceneryForStage(index, nextSceneryId));
      setStructures(spawnStructuresForStage(index));
      setEngagedEnemyId(null);
      setDisplayedEnemyId(null);
  }, []);

  useEffect(() => {
    // This hook now only triggers when the stageIndex changes, preventing reloads on gameState changes (like exiting a shop).
    if (gameState === GameState.PLAYING) {
      loadStage(stageIndex);
    }
  }, [stageIndex, loadStage]);

  const startGame = useCallback(() => {
    resumeAudioContext().then(() => {
        stopBGM();
        playBGM();
        const initialPlayerState = {
            ...INITIAL_PLAYER,
            currentHp: calculateDerivedStats(INITIAL_PLAYER).maxHp,
        };
        setLog([]);
        setPlayer(initialPlayerState);
        setPlayStats({ ...INITIAL_PLAY_STATS, startTime: Date.now(), collectedEquipment: new Set() });
        setDistance(0);
        
        setStageIndex(0);
        loadStage(0); // Explicitly load stage 0 on game start
        setGameState(GameState.PLAYING);
    });
  }, [loadStage]);
  
  useEffect(() => {
    let timer: number;
    if (gameState === GameState.PLAYING) {
        timer = window.setInterval(() => {
            setPlayStats(prev => ({
                ...prev,
                playTime: prev.playTime + 1,
            }));
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);
  
  const enterHouse = useCallback(() => {
    setPlayer(p => {
        const stats = calculateDerivedStats(p);
        if (p.currentHp < stats.maxHp) {
            addLog('家で休んで体力が全回復した！');
            return { ...p, currentHp: stats.maxHp };
        }
        return p;
    });
    setGameState(GameState.EQUIPMENT_CHANGE);
    setHousePrompt(false);
  }, [addLog]);

  const onCloseEquipmentChange = useCallback(() => {
      setGameState(GameState.PLAYING);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === GameState.SHOPPING) {
            setGameState(GameState.PLAYING);
            setShopData(null);
        } else if (gameState === GameState.EQUIPMENT_CHANGE) {
            onCloseEquipmentChange();
        }
      }

      if (gameState === GameState.PLAYING) {
        if (e.key === 'ArrowRight') rightArrowPressed.current = true;
        if (e.key === 'ArrowLeft') leftArrowPressed.current = true;
        if (e.code === 'Space') {
            if (shopTarget.current) {
                e.preventDefault();
                const shopType = shopTarget.current.type as ShopType;
                const areaIndex = Math.floor(stageIndex / 10);
                const items = generateShopItems(shopType, areaIndex);
                setShopData({ type: shopType, items });
                setGameState(GameState.SHOPPING);
                setShopPrompt(false);
            } else if (houseTarget.current) {
                e.preventDefault();
                enterHouse();
            }
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') rightArrowPressed.current = false;
      if (e.key === 'ArrowLeft') leftArrowPressed.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, stageIndex, enterHouse, onCloseEquipmentChange]);
  
  useEffect(() => {
    if (gameViewRef.current) {
      const observer = new ResizeObserver(entries => {
        if (entries[0]) {
          setGameViewWidth(entries[0].contentRect.width);
        }
      });
      observer.observe(gameViewRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const totalDistance = stageIndex * STAGE_LENGTH + distance;
  useEffect(() => {
    if (totalDistance > playStats.farthestDistance) {
        setPlayStats(prev => ({ ...prev, farthestDistance: totalDistance }));
    }
  }, [totalDistance, playStats.farthestDistance]);

  useEffect(() => {
    if (gameState === GameState.PLAYER_DEAD) {
        stopBGM();
        const timer = setTimeout(() => {
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
            setDistance(0);
            
            resumeAudioContext().then(() => {
                playBGM();
                // Setting stageIndex to 0 and gameState to PLAYING will trigger the loading useEffect.
                setStageIndex(0);
                setGameState(GameState.PLAYING);
            });
        }, 2000);

        return () => clearTimeout(timer);
    }
  }, [gameState]);

  const trackEquipmentCollection = useCallback((item: Equipment) => {
      setPlayStats(prev => {
          if (prev.collectedEquipment.has(item.masterId)) {
              return prev;
          }
          const newSet = new Set(prev.collectedEquipment);
          newSet.add(item.masterId);
          return { ...prev, collectedEquipment: newSet };
      });
  }, []);
    
  const handleBuyItem = useCallback((itemToBuy: Equipment) => {
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
  }, [addLog, trackEquipmentCollection]);

  const handleStatAllocation = (allocatedStats: Record<AllocatableStat, number>) => {
    setPlayer(p => {
        const newBaseStats: BaseStats = { ...p.baseStats };
        let hpChange = 10; // Base HP gain from level up
        for (const [stat, value] of Object.entries(allocatedStats)) {
            newBaseStats[stat as AllocatableStat] += value;
        }
        
        hpChange += allocatedStats.stamina * 10;
        hpChange += allocatedStats.strength * 2;

        return {
            ...p,
            baseStats: newBaseStats,
            statPoints: 0,
            currentHp: p.currentHp + hpChange,
            lastStatAllocation: allocatedStats,
        };
    });
    setGameState(GameState.PLAYING);
  };

  const toggleStatAllocationLock = useCallback(() => {
    setPlayer(p => ({
      ...p,
      isStatAllocationLocked: !p.isStatAllocationLocked,
    }));
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    
    let newEnemies = [...enemies]; // Create a mutable copy for this frame
    
    setPlayer(prevPlayer => {
      let playerUpdate = { ...prevPlayer };
      const currentCalculatedStats = calculatedStats;
      let totalPlayerDamageThisFrame = 0;
      let lastAttackingEnemy: Enemy | null = null;
      const now = Date.now();

      const houseToUse = structures.find(s => s.type === 'house' && Math.abs(s.x - playerUpdate.x) < HEALING_HOUSE_RANGE);
      houseTarget.current = houseToUse || null;
      setHousePrompt(!!houseTarget.current);
      
      const shopToVisit = structures.find(s => s.type.includes('_shop') && Math.abs(s.x - playerUpdate.x) < SHOP_RANGE);
      shopTarget.current = shopToVisit || null;
      setShopPrompt(!!shopTarget.current);

      const activeEnemies = newEnemies.filter(e => e.currentHp > 0);
      
      // Display Panel Logic
      if (displayedEnemyId === null) {
          const closestEnemyInRange = activeEnemies
              .map(enemy => ({ enemy, distance: Math.abs(enemy.x - playerUpdate.x) }))
              .filter(data => data.distance <= ENEMY_PANEL_DISPLAY_RANGE)
              .sort((a, b) => a.distance - b.distance)[0];
          
          if (closestEnemyInRange) {
              setDisplayedEnemyId(closestEnemyInRange.enemy.id);
          }
      }

      let newEngagedEnemyId = engagedEnemyId;

      if (activeEnemies.length > 0) {
        const enemiesByDistance = activeEnemies
          .map(enemy => ({ enemy, distance: Math.abs(enemy.x - playerUpdate.x) }))
          .sort((a, b) => a.distance - b.distance);
        
        const closestEnemyData = enemiesByDistance[0];
        const currentEngagedEnemyInLoop = activeEnemies.find(e => e.id === engagedEnemyId);

        if (!currentEngagedEnemyInLoop) {
          // If no enemy is engaged, target the closest one.
          newEngagedEnemyId = closestEnemyData.enemy.id;
        } else {
          const currentEngagedDistance = Math.abs(currentEngagedEnemyInLoop.x - playerUpdate.x);
          const SWITCH_TARGET_THRESHOLD = 50; // px

          // Switch target if a new enemy is significantly closer.
          if (
            closestEnemyData.enemy.id !== currentEngagedEnemyInLoop.id &&
            currentEngagedDistance > closestEnemyData.distance + SWITCH_TARGET_THRESHOLD
          ) {
            newEngagedEnemyId = closestEnemyData.enemy.id;
          }
        }
      } else {
        // No enemies on screen, so no one to engage.
        newEngagedEnemyId = null;
      }
      
      // Update state if the engaged enemy has changed.
      if (newEngagedEnemyId !== engagedEnemyId) {
        setEngagedEnemyId(newEngagedEnemyId);
      }

      const currentEngagedEnemy = activeEnemies.find(e => e.id === newEngagedEnemyId);

      let playerCooldown = 500;
      let engagedEnemyCooldown = 2000;

      if (currentEngagedEnemy) {
          const playerSpeed = currentCalculatedStats.speed;
          const enemySpeed = currentEngagedEnemy.speed;
          const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
          
          const speedLevel = ATTACK_SPEED_LEVELS.find(level => speedRatio <= level.ratio) || ATTACK_SPEED_LEVELS[3];
          playerCooldown = speedLevel.cooldown;
          
          engagedEnemyCooldown = Math.max(200, playerCooldown / speedRatio);
      }
      
      let enemyToAttack: Enemy | undefined = undefined;
      if (currentEngagedEnemy) {
        const playerWidth = 64; // from Player.tsx w-16
        const enemyWidth = 80;  // from Enemy.tsx w-20
        const playerCenter = playerUpdate.x + playerWidth / 2;
        const enemyCenter = currentEngagedEnemy.x + enemyWidth / 2;
        const distanceBetweenCenters = Math.abs(playerCenter - enemyCenter);
        const combinedHalfWidths = (playerWidth / 2) + (enemyWidth / 2);

        if (distanceBetweenCenters <= combinedHalfWidths + ATTACK_RANGE) {
          enemyToAttack = currentEngagedEnemy;
        }
      }
      
      if (enemyToAttack && playerAttackReady.current) {
          playerAttackReady.current = false;
          setTimeout(() => { playerAttackReady.current = true; }, playerCooldown);
          
          playSound('playerAttack');
          
          const attackDirection = enemyToAttack.x > playerUpdate.x ? 'right' : 'left';
          setPlayerAttackDirection(attackDirection);
          setPlayerAction('attack');
          setTimeout(() => setPlayerAction(undefined), 300);

          let totalDamage = 0;
          const damageInfos: DamageInfo[] = [];

          const physicalDamage = Math.max(1, Math.floor(currentCalculatedStats.physicalAttack * (0.8 + Math.random() * 0.4)) - enemyToAttack.physicalDefense);
          totalDamage += physicalDamage;
          damageInfos.push({ text: `${physicalDamage}`, color: '#FFFFFF' });
          
          const weapon = playerUpdate.equipment.weapon;
          if (weapon && weapon.elementalDamages) {
            for (const [element, power] of Object.entries(weapon.elementalDamages)) {
              if(power){
                const affinityMultiplier = ELEMENTAL_AFFINITY[element as Element][enemyToAttack.element];
                const baseMagicalDamage = power * (1 + currentCalculatedStats.magicalAttack * 0.04);
                const rawMagicalDamage = Math.floor(baseMagicalDamage * (0.9 + Math.random() * 0.2));
                const effectiveMagicalDamage = rawMagicalDamage * affinityMultiplier;
                const finalMagicalDamage = Math.max(1, Math.floor(effectiveMagicalDamage) - enemyToAttack.magicalDefense);
                totalDamage += finalMagicalDamage;
                damageInfos.push({ text: `${finalMagicalDamage}`, color: ELEMENT_HEX_COLORS[element as Element] });
              }
            }
          }

          if (damageInfos.length > 0) {
            const newInstance: DamageInstance = { id: nextDamageInstanceId.current++, x: enemyToAttack.x + (Math.random() - 0.5) * 20, damages: damageInfos };
            setDamageInstances(prev => [...prev, newInstance]);
            setTimeout(() => setDamageInstances(prev => prev.filter(d => d.id !== newInstance.id)), 1200);
          }

          let targetIsDefeated = false;
          newEnemies = newEnemies.map(e => {
              if (e.id === enemyToAttack.id) {
                  playSound('enemyHit');
                  const newHp = Math.max(0, e.currentHp - totalDamage);
                  if (newHp === 0) {
                      setPlayStats(prev => ({ ...prev, enemiesDefeated: prev.enemiesDefeated + 1 }));
                      if (e.id === engagedEnemyId) setEngagedEnemyId(null);
                      if (e.id === displayedEnemyId) setDisplayedEnemyId(null);
                      const xpGained = Math.floor(e.xpValue * (1 + stageIndex * 0.05));
                      playerUpdate.xp += xpGained;
                      setPlayStats(prev => ({ ...prev, totalXpGained: prev.totalXpGained + xpGained }));

                      const goldDropped = Math.floor(e.goldValue * (1 + currentCalculatedStats.luckValue * LUCK_TO_GOLD_MULTIPLIER));
                      playerUpdate.gold += goldDropped;
                      
                      const newDrop = { id: nextGoldDropId.current++, x: e.x + 10 };
                      setGoldDrops(prev => [...prev, newDrop]);
                      setTimeout(() => setGoldDrops(prev => prev.filter(d => d.id !== newDrop.id)), 1000);

                      addLog(`${e.name} レベル${e.level}を倒した！ +${goldDropped}G, +${xpGained}XP`);
                      
                      const dropChance = BASE_DROP_CHANCE + currentCalculatedStats.luckValue * LUCK_TO_DROP_CHANCE_MULTIPLIER;
                      if (Math.random() < dropChance) {
                          const isGemDrop = Math.random() < 0.3;
                          if (isGemDrop) {
                              const stats: AllocatableStat[] = ['strength', 'stamina', 'intelligence', 'speedAgility', 'luck'];
                              const randomStat = stats[Math.floor(Math.random() * stats.length)];
                              const gem: Gem = { name: `Gem of ${randomStat}`, stat: randomStat, value: 1 };
                              addLog(`✨ ${baseStatNames[gem.stat]}のジェムを見つけた！ ${baseStatNames[gem.stat]}が ${gem.value} 上がった！`);
                              playerUpdate.baseStats[gem.stat] += gem.value;
                              setPlayStats(prev => ({ ...prev, gemCollection: { ...prev.gemCollection, [gem.stat]: (prev.gemCollection[gem.stat] || 0) + 1 }}));
                          } else {
                              const areaIndex = Math.floor(stageIndex / 10);
                              const droppedItem = generateRandomEquipment(areaIndex);
                              playerUpdate = addEquipmentToPlayer(playerUpdate, droppedItem, trackEquipmentCollection, addLog);
                          }
                      }
                      targetIsDefeated = true;
                  }
                  return { ...e, currentHp: newHp };
              }
              return e;
          });
          setEnemies(newEnemies.filter(e => e.currentHp > 0));

          if(!targetIsDefeated) {
              setEnemyHits(prev => ({...prev, [enemyToAttack.id]: true}));
              setTimeout(() => setEnemyHits(prev => {
                  const newHits = {...prev};
                  delete newHits[enemyToAttack.id];
                  return newHits;
              }), 300);
          }
      }
      
      newEnemies.forEach(enemy => {
          if (enemy.currentHp <= 0) return;
          
          if (enemy.attackState === 'preparing' && now >= enemy.attackStateTimer) {
              playSound('enemyAttack');
              
              const playerWidth = 64;
              const enemyWidth = 80;
              const playerCenter = playerUpdate.x + playerWidth / 2;
              const enemyCenter = enemy.x + enemyWidth / 2;
              const distanceBetweenCenters = Math.abs(playerCenter - enemyCenter);
              const combinedHalfWidths = (playerWidth / 2) + (enemyWidth / 2);

              if (distanceBetweenCenters <= combinedHalfWidths + ATTACK_RANGE) {
                   const isMagicalAttack = enemy.magicalAttack > enemy.physicalAttack;
                   let damage: number;
                   let damageColor = '#FFFFFF';
                   if (isMagicalAttack) {
                       const affinityMultiplier = ELEMENTAL_AFFINITY[enemy.element][player.equipment.armor?.elementalDamages ? Object.keys(player.equipment.armor.elementalDamages)[0] as Element : '無'] || 1;
                       const rawDamage = Math.floor(enemy.magicalAttack * (0.8 + Math.random() * 0.4));
                       const effectiveDamage = rawDamage * affinityMultiplier;
                       damage = Math.max(1, Math.floor(effectiveDamage) - currentCalculatedStats.magicalDefense);
                       damageColor = ELEMENT_HEX_COLORS[enemy.element];
                   } else {
                       const rawDamage = Math.floor(enemy.physicalAttack * (0.8 + Math.random() * 0.4));
                       damage = Math.max(1, rawDamage - currentCalculatedStats.physicalDefense);
                   }
                   totalPlayerDamageThisFrame += damage;
                   lastAttackingEnemy = enemy;
                   const damageInstance: DamageInstance = { id: nextDamageInstanceId.current++, x: playerUpdate.x + 16, damages: [{ text: `${damage}`, color: damageColor }] };
                   setDamageInstances(prev => [...prev, damageInstance]);
                   setTimeout(() => setDamageInstances(prev => prev.filter(di => di.id !== damageInstance.id)), 1200);
              }
              enemy.attackState = 'attacking';
              enemy.attackStateTimer = now + enemy.attackAnimationTime;
          } else if (enemy.attackState === 'attacking' && now >= enemy.attackStateTimer) {
              enemy.attackState = 'idle';
          }

          if (enemy.id === engagedEnemyId && enemy.attackState === 'idle') {
              const lastAttackTime = enemyAttackTimers.current[enemy.id] || 0;
              if (now - lastAttackTime > engagedEnemyCooldown) {
                  enemy.attackState = 'preparing';
                  enemy.attackStateTimer = now + enemy.attackPrepareTime;
                  enemyAttackTimers.current[enemy.id] = now;
              }
          }
      });

      if (totalPlayerDamageThisFrame > 0) {
          playSound('playerHit');
          playerUpdate.currentHp = Math.max(0, playerUpdate.currentHp - totalPlayerDamageThisFrame);
          setPlayerAction('hit');
          setTimeout(() => setPlayerAction(undefined), 300);
          if (playerUpdate.currentHp === 0) {
              playSound('playerDeath');
              if (lastAttackingEnemy) {
                addLog(`${lastAttackingEnemy.name} Lv.${lastAttackingEnemy.level}にやられた…`);
              } else {
                addLog('力尽きた…');
              }
              setGameState(GameState.PLAYER_DEAD);
          }
      }

      if (playerUpdate.xp >= playerUpdate.xpToNextLevel) {
          const remainingXp = playerUpdate.xp - playerUpdate.xpToNextLevel;
          playerUpdate.level += 1;
          addLog(`レベル ${playerUpdate.level} になった！`);
          playSound('levelUp');
          playerUpdate.xp = remainingXp;
          playerUpdate.xpToNextLevel = Math.floor(playerUpdate.xpToNextLevel * XP_FOR_NEXT_LEVEL_MULTIPLIER);
          
          if (playerUpdate.isStatAllocationLocked && playerUpdate.lastStatAllocation) {
              const newBaseStats: BaseStats = { ...playerUpdate.baseStats };
              let hpChange = 10;
              for (const [stat, value] of Object.entries(playerUpdate.lastStatAllocation)) {
                  newBaseStats[stat as AllocatableStat] += value;
              }

              hpChange += (playerUpdate.lastStatAllocation.stamina || 0) * 10;
              hpChange += (playerUpdate.lastStatAllocation.strength || 0) * 2;
              
              playerUpdate.baseStats = newBaseStats;
              playerUpdate.currentHp += hpChange;
              addLog('ステータスが自動的に割り振られました。');

          } else {
              playerUpdate.statPoints = (playerUpdate.statPoints || 0) + STAT_POINTS_PER_LEVEL;
              setGameState(GameState.LEVEL_UP);
          }
      }

      let dx = 0;
      if (rightArrowPressed.current) dx += GAME_SPEED;
      if (leftArrowPressed.current) dx -= GAME_SPEED;

      // Collision detection with engaged enemy, considering character widths
      if (currentEngagedEnemy) {
        const playerWidth = 64; // from Player.tsx w-16
        const enemyWidth = 80;  // from Enemy.tsx w-20
        const playerFutureX = playerUpdate.x + dx;

        // Player is moving right and is about to collide/pass the enemy
        if (dx > 0 && (playerUpdate.x + playerWidth) <= currentEngagedEnemy.x && (playerFutureX + playerWidth) > currentEngagedEnemy.x) {
            // Adjust dx to stop the player exactly at the enemy's edge
            dx = currentEngagedEnemy.x - (playerUpdate.x + playerWidth);
        }
        // Player is moving left and is about to collide/pass the enemy
        else if (dx < 0 && playerUpdate.x >= (currentEngagedEnemy.x + enemyWidth) && playerFutureX < (currentEngagedEnemy.x + enemyWidth)) {
            // Adjust dx to stop the player exactly at the enemy's edge
            dx = (currentEngagedEnemy.x + enemyWidth) - playerUpdate.x;
        }
      }

      if (playerUpdate.x + dx < INITIAL_PLAYER.x) dx = INITIAL_PLAYER.x - playerUpdate.x;
      
      playerUpdate.x += dx;
      playerUpdate.isWalking = dx !== 0;

      if (dx > 0) {
          setPlayStats(prev => ({ ...prev, totalDistanceTraveled: prev.totalDistanceTraveled + (dx / PIXELS_PER_METER) }));
      }
      
      const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
      
      // Use local variables to track changes within this game tick to prevent display flickering.
      let nextStageIndex = stageIndex;
      const currentStageStartX = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength;
      
      if (playerUpdate.x > currentStageStartX + currentStagePixelLength) {
          nextStageIndex++;
          setStageIndex(nextStageIndex);
          playerUpdate.x = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength;
      } else if (playerUpdate.x < currentStageStartX && nextStageIndex > 0) {
          nextStageIndex--;
          setStageIndex(nextStageIndex);
          playerUpdate.x = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength + currentStagePixelLength - 64;
      }
      
      // Always calculate distance based on the new, correct stage index for this tick.
      const totalPixelsInCurrentStage = Math.max(0, playerUpdate.x - (INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength));
      const distanceInStage = Math.min(STAGE_LENGTH, Math.floor(totalPixelsInCurrentStage / PIXELS_PER_METER));
      setDistance(distanceInStage);

      return playerUpdate;
    });

  }, [gameState, enemies, structures, stageIndex, distance, addLog, calculatedStats, engagedEnemyId, trackEquipmentCollection, displayedEnemyId]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        const loop = setInterval(gameLoop, 50);
        return () => clearInterval(loop);
    }
  }, [gameState, gameLoop]);
  
  const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
  const currentStageStartX = INITIAL_PLAYER.x + stageIndex * currentStagePixelLength;
  const currentStageEndX = currentStageStartX + currentStagePixelLength;
  let targetScrollX = player.x - 150; 
  const scrollX = Math.max(currentStageStartX - INITIAL_PLAYER.x, Math.min(targetScrollX, currentStageEndX - gameViewWidth));
  const worldOffset = -scrollX;

  const onCloseShop = () => {
    setGameState(GameState.PLAYING);
    setShopData(null);
  }

  const handleEquipItem = (itemToEquip: Equipment) => {
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
  };

  const handleUnequipItem = (itemToUnequip: Equipment) => {
      setPlayer(p => {
          const newInventory = [...p.inventory, itemToUnequip];
          const newEquipment = { ...p.equipment };

          newEquipment[itemToUnequip.type] = null;

          return { ...p, equipment: newEquipment, inventory: newInventory };
      });
  };

  return {
    gameState,
    player,
    enemies,
    structures,
    scenery,
    log,
    shopData,
    shopPrompt,
    housePrompt,
    goldDrops,
    damageInstances,
    playerAction,
    playerAttackDirection,
    enemyHits,
    calculatedStats,
    totalDistance,
    currentArea,
    displayedEnemy,
    playStats,
    gameViewRef,
    worldOffset,
    startGame,
    handleBuyItem,
    handleStatAllocation,
    onCloseShop,
    handleEquipItem,
    handleUnequipItem,
    onCloseEquipmentChange,
    toggleStatAllocationLock,
  };
};