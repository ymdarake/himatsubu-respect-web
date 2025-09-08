import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, Enemy, Player as PlayerType, Structure, ShopType, Equipment, AllocatableStat, BaseStats, Gem, SceneryObject, PlayStats, Element, DamageInstance, DamageInfo } from '../types';
import { AREAS, INITIAL_PLAYER, GAME_SPEED, ATTACK_RANGE, STAGE_LENGTH, XP_FOR_NEXT_LEVEL_MULTIPLIER, HEALING_HOUSE_RANGE, PIXELS_PER_METER, LUCK_TO_GOLD_MULTIPLIER, SHOP_RANGE, STAT_POINTS_PER_LEVEL, BASE_DROP_CHANCE, LUCK_TO_DROP_CHANCE_MULTIPLIER, INITIAL_PLAY_STATS, BASE_EQUIPMENT_NAMES, ELEMENTAL_AFFINITY, ELEMENT_HEX_COLORS, ATTACK_SPEED_LEVELS } from '../constants';
import { playSound, resumeAudioContext, playBGM, stopBGM } from '../utils/audio';
import { calculateDerivedStats } from '../utils/statCalculations';
import { generateRandomEquipment, generateShopItems } from '../utils/itemGenerator';
import { spawnStructure as utilSpawnStructure, spawnScenery as utilSpawnScenery, spawnEnemy as utilSpawnEnemy } from '../utils/worldGenerator';

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
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
  const [enemyHits, setEnemyHits] = useState<Record<number, boolean>>({});
  const [log, setLog] = useState<string[]>([]);
  const [shopData, setShopData] = useState<{type: ShopType, items: Equipment[]} | null>(null);
  const [shopPrompt, setShopPrompt] = useState<boolean>(false);
  const [engagedEnemyId, setEngagedEnemyId] = useState<number | null>(null);
  const [playStats, setPlayStats] = useState<PlayStats>(INITIAL_PLAY_STATS);
  const [goldDrops, setGoldDrops] = useState<{id: number, x: number}[]>([]);
  const [damageInstances, setDamageInstances] = useState<DamageInstance[]>([]);

  const nextEnemyId = useRef(0);
  const lastSpawnPosition = useRef(0);
  const rightArrowPressed = useRef(false);
  const leftArrowPressed = useRef(false);
  const gameViewRef = useRef<HTMLDivElement>(null);
  const [gameViewWidth, setGameViewWidth] = useState(0);
  const justHealed = useRef(false);
  const shopTarget = useRef<Structure | null>(null);
  const nextSceneryId = useRef(0);
  const lastScenerySpawnX = useRef(0);
  const nextGoldDropId = useRef(0);
  const nextDamageInstanceId = useRef(0);
  const playerAttackReady = useRef(true);
  const enemyAttackTimers = useRef<Record<number, number>>({});

  const addLog = useCallback((message: string) => {
    setLog(prevLog => [message, ...prevLog].slice(0, 50));
  }, []);

  const calculatedStats = useMemo(() => calculateDerivedStats(player), [player]);
  
  const engagedEnemy = useMemo(() => enemies.find(e => e.id === engagedEnemyId), [enemies, engagedEnemyId]);
  const currentAreaIndex = Math.floor(stageIndex / 10);
  const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

  const spawnScenery = useCallback((fromX: number, toX: number) => {
    return utilSpawnScenery(fromX, toX, currentArea.name, nextSceneryId);
  }, [currentArea.name]);

  const spawnStructure = useCallback((targetStageIndex: number) => {
    return utilSpawnStructure(targetStageIndex);
  }, []);

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
        setEnemies([]);
        setPlayStats({ ...INITIAL_PLAY_STATS, startTime: Date.now(), collectedEquipment: new Set() });
        const initialScenery = spawnScenery(0, 2000);
        setScenery(initialScenery);
        setStructures([spawnStructure(1)].filter(Boolean) as Structure[]);
        setDistance(0);
        setStageIndex(0);
        nextEnemyId.current = 0;
        nextSceneryId.current = initialScenery.length;
        lastSpawnPosition.current = INITIAL_PLAYER.x;
        lastScenerySpawnX.current = 2000;
        justHealed.current = false;
        setGameState(GameState.PLAYING);
    });
  }, [spawnStructure, spawnScenery]);

  const spawnEnemy = useCallback((playerPositionX: number, currentStageIndex: number, viewWidth: number) => {
    return utilSpawnEnemy(
      playerPositionX,
      currentStageIndex,
      viewWidth,
      lastSpawnPosition.current,
      nextEnemyId
    );
  }, []);
  
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.SHOPPING && e.key === 'Escape') {
        setGameState(GameState.PLAYING);
        setShopData(null);
      }
      if (gameState === GameState.PLAYING) {
        if (e.key === 'ArrowRight') rightArrowPressed.current = true;
        if (e.key === 'ArrowLeft') leftArrowPressed.current = true;
        if (e.code === 'Space' && shopTarget.current) {
            e.preventDefault();
            const shopType = shopTarget.current.type as ShopType;
            const areaIndex = Math.floor(stageIndex / 10);
            const items = generateShopItems(shopType, areaIndex);
            setShopData({ type: shopType, items });
            setGameState(GameState.SHOPPING);
            setShopPrompt(false);
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
  }, [gameState, stageIndex]);
  
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
                    level: prevPlayer.level,
                    xp: prevPlayer.xp,
                    xpToNextLevel: prevPlayer.xpToNextLevel,
                    gold: prevPlayer.gold,
                    statPoints: prevPlayer.statPoints,
                };
                return {
                    ...preservedPlayer,
                    currentHp: calculateDerivedStats(preservedPlayer).maxHp,
                }
            });
            setStageIndex(0);
            setDistance(0);
            setEnemies([]);
            const initialScenery = spawnScenery(0, 2000);
            setScenery(initialScenery);
            setStructures([spawnStructure(1)].filter(Boolean) as Structure[]);
            lastSpawnPosition.current = INITIAL_PLAYER.x;
            lastScenerySpawnX.current = 2000;
            justHealed.current = false;
            
            resumeAudioContext().then(() => {
                playBGM();
                setGameState(GameState.PLAYING);
            });
        }, 2000);

        return () => clearTimeout(timer);
    }
  }, [gameState, spawnStructure, spawnScenery]);

  const trackEquipmentCollection = useCallback((itemName: string) => {
      const baseName = BASE_EQUIPMENT_NAMES.find(base => itemName.includes(base));
      if (baseName && !playStats.collectedEquipment.has(baseName)) {
          setPlayStats(prev => {
              const newSet = new Set(prev.collectedEquipment);
              newSet.add(baseName);
              return { ...prev, collectedEquipment: newSet };
          });
      }
  }, [playStats.collectedEquipment]);
    
  const handleBuyItem = useCallback((item: Equipment) => {
    if (player.gold >= item.price) {
      setPlayer(p => ({
        ...p,
        gold: p.gold - item.price,
        equipment: { ...p.equipment, [item.type]: item },
      }));
      trackEquipmentCollection(item.name);
      setGameState(GameState.PLAYING);
      setShopData(null);
    }
  }, [player.gold, trackEquipmentCollection]);

  const handleStatAllocation = (allocatedStats: Record<AllocatableStat, number>) => {
    setPlayer(p => {
        const newBaseStats: BaseStats = { ...p.baseStats };
        let hpChange = 0;
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
        };
    });
    setGameState(GameState.PLAYING);
  };

  const gameLoop = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    
    setPlayer(prevPlayer => {
      let playerUpdate = { ...prevPlayer };
      const currentCalculatedStats = calculatedStats;
      let newEnemies = [...enemies];
      let structuresUpdate = [...structures];
      let newScenery = [...scenery];
      let totalPlayerDamageThisFrame = 0;
      const now = Date.now();

      const houseToUse = structures.find(s => s.type === 'house' && Math.abs(s.x - playerUpdate.x) < HEALING_HOUSE_RANGE);
      if (houseToUse) {
        if (playerUpdate.currentHp < currentCalculatedStats.maxHp) {
          playerUpdate.currentHp = currentCalculatedStats.maxHp;
          if (!justHealed.current) { justHealed.current = true; }
        }
      } else {
        if (justHealed.current) { justHealed.current = false; }
      }
      
      const shopToVisit = structures.find(s => s.type.includes('_shop') && Math.abs(s.x - playerUpdate.x) < SHOP_RANGE);
      shopTarget.current = shopToVisit || null;
      if (shopTarget.current) {
        if (!shopPrompt) setShopPrompt(true);
      } else {
        if (shopPrompt) setShopPrompt(false);
      }

      const activeEnemies = newEnemies.filter(e => e.currentHp > 0);
      let currentEngagedEnemy = activeEnemies.find(e => e.id === engagedEnemyId);

      if (currentEngagedEnemy && Math.abs(currentEngagedEnemy.x - playerUpdate.x) > gameViewWidth) {
        setEngagedEnemyId(null);
        currentEngagedEnemy = undefined;
      }

      if (!currentEngagedEnemy) {
        const closestEnemyInFront = activeEnemies
            .filter(e => e.x > playerUpdate.x)
            .sort((a,b) => a.x - b.x)[0];
        
        if (closestEnemyInFront && closestEnemyInFront.x - playerUpdate.x < ATTACK_RANGE + 50) {
            setEngagedEnemyId(closestEnemyInFront.id);
            currentEngagedEnemy = closestEnemyInFront;
        }
      }

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
      
      const enemyToAttack = currentEngagedEnemy && Math.abs(currentEngagedEnemy.x - playerUpdate.x) <= ATTACK_RANGE ? currentEngagedEnemy : undefined;
      
      if (enemyToAttack && playerAttackReady.current) {
          playerAttackReady.current = false;
          setTimeout(() => { playerAttackReady.current = true; }, playerCooldown);
          
          playSound('playerAttack');
          
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
                              setPlayStats(prev => ({ ...prev, gemCollection: { ...prev.gemCollection, [gem.stat]: (prev.gemCollection[gem.stat] || 0) + gem.value }}));
                          } else {
                              const areaIndex = Math.floor(stageIndex / 10);
                              const droppedItem = generateRandomEquipment(areaIndex);
                              trackEquipmentCollection(droppedItem.name);
                              const currentItem = playerUpdate.equipment[droppedItem.type];
                              let isUpgrade = !currentItem;
                              if (currentItem) {
                                  const currentPower = Object.values(currentItem.stats).reduce((a, b) => a + (b || 0), 0);
                                  const droppedPower = Object.values(droppedItem.stats).reduce((a, b) => a + (b || 0), 0);
                                  if (droppedPower > currentPower) isUpgrade = true;
                              }
                              if (isUpgrade) {
                                  addLog(`✨ ${droppedItem.name}を見つけて装備した！`);
                                  playerUpdate.equipment[droppedItem.type] = droppedItem;
                              } else {
                                  addLog(`${droppedItem.name}を見つけたが、今の装備より弱かった。`);
                              }
                          }
                      }
                      targetIsDefeated = true;
                  }
                  return { ...e, currentHp: newHp };
              }
              return e;
          });

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
              if (Math.abs(enemy.x - playerUpdate.x) <= ATTACK_RANGE) {
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
                   const damageInstance: DamageInstance = { id: nextDamageInstanceId.current++, x: playerUpdate.x + 16, damages: [{ text: `${damage}`, color: damageColor }] };
                   setDamageInstances(prev => [...prev, damageInstance]);
                   setTimeout(() => setDamageInstances(prev => prev.filter(di => di.id !== damageInstance.id)), 1200);
              }
              enemy.attackState = 'attacking';
              enemy.attackStateTimer = now + enemy.attackAnimationTime;
          } else if (enemy.attackState === 'attacking' && now >= enemy.attackStateTimer) {
              enemy.attackState = 'idle';
          }

          if (enemy.id === engagedEnemyId && enemy.attackState === 'idle' && Math.abs(enemy.x - playerUpdate.x) <= ATTACK_RANGE) {
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
              addLog('力尽きた...');
              setGameState(GameState.PLAYER_DEAD);
          }
      }

      if (playerUpdate.xp >= playerUpdate.xpToNextLevel) {
          const remainingXp = playerUpdate.xp - playerUpdate.xpToNextLevel;
          playerUpdate.level += 1;
          addLog(`レベル ${playerUpdate.level} になった！`);
          playerUpdate.statPoints = (playerUpdate.statPoints || 0) + STAT_POINTS_PER_LEVEL;
          playerUpdate.xp = remainingXp;
          playerUpdate.xpToNextLevel = Math.floor(playerUpdate.xpToNextLevel * XP_FOR_NEXT_LEVEL_MULTIPLIER);
          setGameState(GameState.LEVEL_UP);
      }

      let dx = 0;
      if (rightArrowPressed.current || leftArrowPressed.current) {
        if (rightArrowPressed.current) dx += GAME_SPEED;
        if (leftArrowPressed.current) dx -= GAME_SPEED;
      }
      
      const isRetreating = dx < 0;
      if (enemyToAttack && dx > 0 && !isRetreating) dx = 0;

      if (playerUpdate.x + dx < INITIAL_PLAYER.x) dx = INITIAL_PLAYER.x - playerUpdate.x;
      playerUpdate.x += dx;
      playerUpdate.isWalking = dx !== 0;

      if (dx > 0) {
          setPlayStats(prev => ({ ...prev, totalDistanceTraveled: prev.totalDistanceTraveled + (dx / PIXELS_PER_METER) }));
      }
      
      const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
      let newStageIndex = stageIndex;
      const currentStageStartX = INITIAL_PLAYER.x + stageIndex * currentStagePixelLength;
      
      if (playerUpdate.x > currentStageStartX + currentStagePixelLength) {
          newStageIndex = stageIndex + 1;
          playerUpdate.x = INITIAL_PLAYER.x + newStageIndex * currentStagePixelLength;
          newEnemies = [];
          lastSpawnPosition.current = playerUpdate.x;
      } else if (playerUpdate.x < currentStageStartX && stageIndex > 0) {
          newStageIndex = stageIndex - 1;
          playerUpdate.x = INITIAL_PLAYER.x + newStageIndex * currentStagePixelLength + currentStagePixelLength - 64;
          newEnemies = [];
          lastSpawnPosition.current = playerUpdate.x - gameViewWidth;
      }
      
      const totalPixelsInCurrentStage = Math.max(0, playerUpdate.x - (INITIAL_PLAYER.x + newStageIndex * currentStagePixelLength));
      const distanceInStage = Math.min(STAGE_LENGTH, Math.floor(totalPixelsInCurrentStage / PIXELS_PER_METER));

      if (newStageIndex !== stageIndex) {
        setStageIndex(newStageIndex);
        setEngagedEnemyId(null);
        const newStructure = spawnStructure(newStageIndex);
        if (newStructure) {
          const areaIndex = Math.floor(newStageIndex / 10);
          if (!structures.some(s => s.id === areaIndex && s.type === newStructure.type)) {
            structuresUpdate.push(newStructure);
          }
        }
      }
      setDistance(distanceInStage);
      
      if (dx > 0 && playerUpdate.x + gameViewWidth > lastScenerySpawnX.current) {
        const newSceneryObjects = spawnScenery(lastScenerySpawnX.current, playerUpdate.x + gameViewWidth + 200);
        newScenery.push(...newSceneryObjects);
        lastScenerySpawnX.current = playerUpdate.x + gameViewWidth + 200;
      }

      if (dx > 0) {
          const newEnemy = spawnEnemy(playerUpdate.x, newStageIndex, gameViewWidth);
          if (newEnemy) { 
            newEnemies.push(newEnemy);
            lastSpawnPosition.current = newEnemy.x;
          }
      }
      
      setEnemies(newEnemies.filter(e => e.currentHp > 0 && Math.abs(e.x - playerUpdate.x) < gameViewWidth * 2));
      setStructures(structuresUpdate);
      setScenery(newScenery.filter(s => Math.abs(s.x - playerUpdate.x) < gameViewWidth * 2));
      return playerUpdate;
    });

  }, [gameState, enemies, structures, scenery, spawnEnemy, stageIndex, gameViewWidth, addLog, calculatedStats, shopPrompt, engagedEnemyId, generateRandomEquipment, spawnScenery, trackEquipmentCollection]);

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

  return {
    gameState,
    player,
    enemies,
    structures,
    scenery,
    log,
    shopData,
    shopPrompt,
    goldDrops,
    damageInstances,
    playerAction,
    enemyHits,
    calculatedStats,
    totalDistance,
    currentArea,
    engagedEnemy,
    playStats,
    gameViewRef,
    worldOffset,
    startGame,
    handleBuyItem,
    handleStatAllocation,
    onCloseShop
  };
};
