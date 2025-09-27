
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, Enemy, Player as PlayerType, Structure, ShopType, Equipment, AllocatableStat, BaseStats, Gem, SceneryObject, PlayStats, Element, DamageInstance, DamageInfo } from '../types';
import { playSound, resumeAudioContext, playBGM, stopBGM, setMutedState } from '../utils/audio';
import { calculateDerivedStats } from '../utils/statCalculations';
import { generateRandomEquipment, generateShopItems } from '../utils/itemGenerator';
import { spawnStructuresForStage, spawnSceneryForStage, spawnEnemiesForStage } from '../utils/worldGenerator';
import { AREAS } from '../data/areas';
import { INITIAL_PLAYER, INITIAL_PLAY_STATS } from '../constants/player';
import { GAME_SPEED, ATTACK_RANGE, STAGE_LENGTH, XP_FOR_NEXT_LEVEL_MULTIPLIER, HEALING_HOUSE_RANGE, PIXELS_PER_METER, SHOP_RANGE, STAT_POINTS_PER_LEVEL, BASE_DROP_CHANCE, LUCK_TO_DROP_CHANCE_MULTIPLIER, ENEMY_PANEL_DISPLAY_RANGE, TELEPORTER_RANGE } from '../constants/game';
import { ELEMENTAL_AFFINITY, ATTACK_SPEED_LEVELS } from '../constants/combat';
import { ELEMENT_HEX_COLORS } from '../constants/ui';
import { usePlayer } from './usePlayer';

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};

const SAVE_KEY = 'sidescroll-quest-savegame';
const MUTE_KEY = 'sidescroll-quest-muted';

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
  const { 
    player, 
    setPlayer, 
    resetPlayer, 
    resetPlayerForDeath, 
    loadPlayer,
    handleHeal: playerHeal,
    handleBuyItem: playerBuyItem,
    handleEquipItem,
    handleUnequipItem,
    handleStatAllocation: playerStatAllocation,
    toggleStatAllocationLock,
  } = usePlayer();
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
  const [teleporterPrompt, setTeleporterPrompt] = useState<boolean>(false);
  const [engagedEnemyId, setEngagedEnemyId] = useState<number | null>(null);
  const [displayedEnemyId, setDisplayedEnemyId] = useState<number | null>(null);
  const [playStats, setPlayStats] = useState<PlayStats>(INITIAL_PLAY_STATS);
  const [goldDrops, setGoldDrops] = useState<{id: number, x: number}[]>([]);
  const [damageInstances, setDamageInstances] = useState<DamageInstance[]>([]);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextEnemyId = useRef(0);
  const rightArrowPressed = useRef(false);
  const leftArrowPressed = useRef(false);
  const gameViewRef = useRef<HTMLDivElement>(null);
  const [gameViewWidth, setGameViewWidth] = useState(0);
  const shopTarget = useRef<Structure | null>(null);
  const houseTarget = useRef<Structure | null>(null);
  const teleporterTarget = useRef<Structure | null>(null);
  const nextSceneryId = useRef(0);
  const nextGoldDropId = useRef(0);
  const nextDamageInstanceId = useRef(0);
  const playerAttackReady = useRef(true);
  const enemyAttackTimers = useRef<Record<number, number>>({});

  const addLog = useCallback((message: string) => {
    setLog(prevLog => [message, ...prevLog].slice(0, 50));
  }, []);

  const calculatedStats = useMemo(() => calculateDerivedStats(player), [player]);
  
  const totalElementalDamages = useMemo(() => {
    const totals: Partial<Record<Element, number>> = {};
    const equipmentList = [player.equipment.weapon, player.equipment.armor, player.equipment.accessory];

    for (const item of equipmentList) {
        if (item && item.elementalDamages) {
            for (const [element, power] of Object.entries(item.elementalDamages)) {
                if (power) {
                    const elemKey = element as Element;
                    // FIX: Cast `power` to a number, as Object.entries can produce `unknown` values.
                    totals[elemKey] = (totals[elemKey] || 0) + Number(power);
                }
            }
        }
    }
    return totals;
  }, [player.equipment]);

  const displayedEnemy = useMemo(() => enemies.find(e => e.id === displayedEnemyId), [enemies, displayedEnemyId]);
  const currentAreaIndex = Math.floor(stageIndex / 10);
  const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

  // BGM control based on area
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
        playBGM(currentAreaIndex);
    }
  }, [currentAreaIndex, gameState]);

  // Load mute state on initial mount
  useEffect(() => {
    const savedMute = localStorage.getItem(MUTE_KEY);
    if (savedMute) {
        const initialMute = JSON.parse(savedMute);
        setIsMuted(initialMute);
        setMutedState(initialMute);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => {
      const newMuted = !prevMuted;
      localStorage.setItem(MUTE_KEY, JSON.stringify(newMuted));
      setMutedState(newMuted);
      if (!newMuted && gameState === GameState.PLAYING) {
        playBGM(currentAreaIndex);
      }
      return newMuted;
    });
  }, [gameState, currentAreaIndex]);


  // Check for save data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            JSON.parse(savedData);
            setHasSaveData(true);
        } catch {
            localStorage.removeItem(SAVE_KEY);
        }
    }
  }, []);

  const saveCurrentGame = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;
    try {
        const saveData = {
            player,
            stageIndex,
            playStats: {
                ...playStats,
                collectedEquipment: Array.from(playStats.collectedEquipment),
            },
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        setHasSaveData(true);
    } catch (error) {
        console.error("Failed to save game:", error);
    }
  }, [gameState, player, stageIndex, playStats]);

  const saveAndExit = useCallback(() => {
    if (gameState === GameState.PLAYING) {
        addLog('ゲームをセーブしてタイトルに戻ります。');
        saveCurrentGame();
    }
    stopBGM();
    setLog([]);
    setEnemies([]);
    setStructures([]);
    setScenery([]);
    setGoldDrops([]);
    setDamageInstances([]);
    setDisplayedEnemyId(null);
    setEngagedEnemyId(null);
    setDistance(0);
    setGameState(GameState.START);
  }, [gameState, addLog, saveCurrentGame]);

  // Autosave interval and save on unload
  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
        return;
    }

    const intervalId = setInterval(saveCurrentGame, 10000); // Save every 10 seconds
    window.addEventListener('beforeunload', saveCurrentGame);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener('beforeunload', saveCurrentGame);
    };
  }, [gameState, saveCurrentGame]);

  useEffect(() => {
    if (isTransitioning) {
        if (stageIndex === 0) {
            nextEnemyId.current = 0;
            nextSceneryId.current = 0;
        }
        const newStructures = spawnStructuresForStage(stageIndex);
        setStructures(newStructures);
        setEnemies(spawnEnemiesForStage(stageIndex, nextEnemyId, newStructures));
        setEngagedEnemyId(null);
        setDisplayedEnemyId(null);

        setIsTransitioning(false); // Transition complete
    }
  }, [isTransitioning, stageIndex]);


  const continueGame = useCallback(() => {
    const savedDataString = localStorage.getItem(SAVE_KEY);
    if (!savedDataString) return;

    try {
        const savedData = JSON.parse(savedDataString);
        let loadedPlayer: PlayerType = savedData.player;
        const loadedStageIndex: number = savedData.stageIndex;
        const loadedPlayStats: PlayStats = {
            ...savedData.playStats,
            collectedEquipment: new Set(savedData.playStats.collectedEquipment),
            startTime: Date.now(), // Reset start time, continue with saved playTime
        };
        
        // Reset player position to the start of the saved stage
        const stageStartX = INITIAL_PLAYER.x + loadedStageIndex * STAGE_LENGTH * PIXELS_PER_METER;
        loadedPlayer = {
            ...loadedPlayer,
            x: stageStartX,
        };
        
        loadPlayer(loadedPlayer);
        setStageIndex(loadedStageIndex);
        setPlayStats(loadedPlayStats);
        
        // Player is at the start of the stage, so distance within stage is 0.
        setDistance(0);

        addLog(`中断したところから再開しました。ステージ${loadedStageIndex + 1}の最初から始まります。`);

        resumeAudioContext().then(() => {
            const areaIndex = Math.floor(loadedStageIndex / 10);
            playBGM(areaIndex);
            setIsTransitioning(true); // Trigger stage load
            setGameState(GameState.PLAYING);
        });
    } catch (error) {
        console.error("Failed to load game:", error);
        localStorage.removeItem(SAVE_KEY);
        setHasSaveData(false);
    }
  }, [addLog, loadPlayer]);

  const startGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setHasSaveData(false);
    resumeAudioContext().then(() => {
        playBGM(0);
        setLog([]);
        resetPlayer();
        setPlayStats({ ...INITIAL_PLAY_STATS, startTime: Date.now(), collectedEquipment: new Set() });
        setDistance(0);
        
        setStageIndex(0);
        setIsTransitioning(true); // Trigger stage load
        setGameState(GameState.PLAYING);
    });
  }, [resetPlayer]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
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
    setGameState(GameState.IN_HOUSE);
    setHousePrompt(false);
  }, []);

  const onCloseHouse = useCallback(() => {
      setGameState(GameState.PLAYING);
  }, []);

  const handleHeal = useCallback(() => {
    playerHeal(addLog);
  }, [playerHeal, addLog]);

  const triggerAction = useCallback(() => {
    if (shopTarget.current) {
        const shopType = shopTarget.current.type as ShopType;
        const items = generateShopItems(shopType, stageIndex);
        setShopData({ type: shopType, items });
        setGameState(GameState.SHOPPING);
        setShopPrompt(false);
    } else if (houseTarget.current) {
        enterHouse();
    } else if (teleporterTarget.current) {
        setGameState(GameState.TELEPORTING);
        setTeleporterPrompt(false);
    }
  }, [stageIndex, enterHouse]);

  const onCloseShop = useCallback(() => {
    setGameState(GameState.PLAYING);
    setShopData(null);
  }, []);

  const onCloseTeleporter = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const handleTeleport = useCallback((targetStageIndex: number) => {
      const cost = Math.abs(targetStageIndex - stageIndex) * 7;
      if (player.gold < cost) {
          addLog("ゴールドが足りません！");
          return;
      }

      const areaIndex = Math.floor(targetStageIndex / 10);
      const area = AREAS[Math.min(areaIndex, AREAS.length - 1)];
      const stageInArea = (targetStageIndex % 10) + 1;

      addLog(`${area.name} ${stageInArea} へ転送します... (-${cost}G)`);
      
      setPlayer(p => ({
          ...p,
          gold: p.gold - cost,
          x: INITIAL_PLAYER.x + targetStageIndex * STAGE_LENGTH * PIXELS_PER_METER,
      }));
      setStageIndex(targetStageIndex);
      setIsTransitioning(true); // Trigger stage load on teleport
      setGameState(GameState.PLAYING);
  }, [player.gold, stageIndex, addLog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === GameState.SHOPPING) onCloseShop();
        else if (gameState === GameState.IN_HOUSE) onCloseHouse();
        else if (gameState === GameState.TELEPORTING) onCloseTeleporter();
      }

      if (e.code === 'Space') {
          e.preventDefault();
          if (gameState === GameState.PLAYING) {
              if (shopTarget.current || houseTarget.current || teleporterTarget.current) {
                triggerAction();
              }
          } else if (gameState === GameState.SHOPPING) onCloseShop();
          else if (gameState === GameState.IN_HOUSE) onCloseHouse();
          else if (gameState === GameState.TELEPORTING) onCloseTeleporter();
      }

      if (gameState === GameState.PLAYING) {
        if (e.key === 'ArrowRight') rightArrowPressed.current = true;
        if (e.key === 'ArrowLeft') leftArrowPressed.current = true;
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
  }, [gameState, triggerAction, onCloseHouse, onCloseShop, onCloseTeleporter]);
  
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
            resetPlayerForDeath();
            setDistance(0);
            
            resumeAudioContext().then(() => {
                playBGM(0);
                setStageIndex(0);
                setIsTransitioning(true); // Trigger stage 0 load
                setGameState(GameState.PLAYING);
            });
        }, 2000);

        return () => clearTimeout(timer);
    }
  }, [gameState, resetPlayerForDeath]);

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
    playerBuyItem(itemToBuy, trackEquipmentCollection, addLog);
  }, [playerBuyItem, trackEquipmentCollection, addLog]);

  const handleStatAllocation = useCallback((allocatedStats: Record<AllocatableStat, number>) => {
    playerStatAllocation(allocatedStats);
    setGameState(GameState.PLAYING);
  }, [playerStatAllocation]);

  const updateGameLogic = useCallback((deltaTime: number) => {
    if (gameState !== GameState.PLAYING || isTransitioning) return;
    
    let playerUpdate = { ...player };
    let newEnemies = [...enemies];
    const currentCalculatedStats = calculatedStats;
    const now = Date.now();

    // --- Helper functions for game logic sections ---

    const processPlayerAttack = (enemyToAttack: Enemy | undefined) => {
        if (!enemyToAttack || !playerAttackReady.current) return;
        
        playerAttackReady.current = false;
        const playerSpeed = currentCalculatedStats.speed;
        const enemySpeed = enemyToAttack.speed;
        const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
        const speedLevel = ATTACK_SPEED_LEVELS.find(level => speedRatio <= level.ratio) || ATTACK_SPEED_LEVELS[3];
        setTimeout(() => { playerAttackReady.current = true; }, speedLevel.cooldown);
        
        playSound('playerAttack');
        
        const attackDirection = enemyToAttack.x > playerUpdate.x ? 'right' : 'left';
        setPlayerAttackDirection(attackDirection);
        setPlayerAction('attack');
        setTimeout(() => setPlayerAction(undefined), 300);

        let totalDamage = 0;
        const damageInfos: DamageInfo[] = [];

        // Physical Damage
        const basePhysicalAttack = currentCalculatedStats.physicalAttack;
        const effectiveDefense = enemyToAttack.physicalDefense;
        const totalStat = basePhysicalAttack + effectiveDefense;
        const damageMultiplier = totalStat > 0 ? basePhysicalAttack / totalStat : 1;
        let rawPhysicalDamage = basePhysicalAttack * damageMultiplier * (0.9 + Math.random() * 0.2);

        // Critical Hit
        const criticalChance = Math.min(0.75, currentCalculatedStats.luckValue / 400);
        const isCritical = Math.random() < criticalChance;
        if (isCritical) rawPhysicalDamage *= 1.5;
        
        const finalPhysicalDamage = Math.max(1, Math.floor(rawPhysicalDamage));
        totalDamage += finalPhysicalDamage;
        damageInfos.push({ text: `${finalPhysicalDamage}${isCritical ? '!' : ''}`, color: isCritical ? '#fde047' : '#FFFFFF' });
        
        // Elemental Damage
        for (const [element, power] of Object.entries(totalElementalDamages)) {
            const affinityMultiplier = ELEMENTAL_AFFINITY[element as Element][enemyToAttack.element];
            const baseMagicalDamage = (currentCalculatedStats.magicalAttack * 1.5) * (1 + (power as number) / 100);
            const rawMagicalDamage = Math.floor(baseMagicalDamage * (0.9 + Math.random() * 0.2));
            const effectiveMagicalDamage = rawMagicalDamage * affinityMultiplier;
            const finalMagicalDamage = Math.max(1, Math.floor(effectiveMagicalDamage) - enemyToAttack.magicalDefense);
            totalDamage += finalMagicalDamage;
            damageInfos.push({ text: `${finalMagicalDamage}`, color: ELEMENT_HEX_COLORS[element as Element] });
        }

        if (damageInfos.length > 0) {
          const newInstance: DamageInstance = { id: nextDamageInstanceId.current++, x: enemyToAttack.x + (Math.random() - 0.5) * 20, damages: damageInfos };
          setDamageInstances(prev => [...prev, newInstance]);
          setTimeout(() => setDamageInstances(prev => prev.filter(d => d.id !== newInstance.id)), 1200);
        }

        let targetIsDefeated = false;
        newEnemies = newEnemies.map(e => {
            if (e.id !== enemyToAttack.id) return e;

            playSound('enemyHit');
            const newHp = Math.max(0, e.currentHp - totalDamage);
            if (newHp === 0) {
                // Handle defeat
                targetIsDefeated = true;
                setPlayStats(prev => ({ ...prev, enemiesDefeated: prev.enemiesDefeated + 1 }));
                if (e.id === engagedEnemyId) setEngagedEnemyId(null);
                if (e.id === displayedEnemyId) setDisplayedEnemyId(null);
                
                const xpGained = Math.floor(e.xpValue * (1 + stageIndex * 0.05));
                playerUpdate.xp += xpGained;
                setPlayStats(prev => ({ ...prev, totalXpGained: prev.totalXpGained + xpGained }));

                const baseGoldFromEnemy = e.goldValue * (0.8 + Math.random() * 0.4);
                const luckBonusMultiplier = 1 + (currentCalculatedStats.luckValue * 0.0025);
                const goldDropped = Math.min(10, Math.floor(baseGoldFromEnemy * luckBonusMultiplier));
                playerUpdate.gold += goldDropped;
                
                const newDrop = { id: nextGoldDropId.current++, x: e.x + 10 };
                setGoldDrops(prev => [...prev, newDrop]);
                setTimeout(() => setGoldDrops(prev => prev.filter(d => d.id !== newDrop.id)), 1000);

                addLog(`${e.name} レベル${e.level}を倒した！ +${goldDropped}G, +${xpGained}XP`);
                
                // Handle drops
                if (e.name === 'ジェムスライム') {
                    const numberOfGems = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
                    const allStats: AllocatableStat[] = ['strength', 'stamina', 'intelligence', 'speedAgility', 'luck'];
                    const droppedGemsCount: Partial<Record<AllocatableStat, number>> = {};

                    for (let i = 0; i < numberOfGems; i++) {
                        const randomStat = allStats[Math.floor(Math.random() * allStats.length)];
                        droppedGemsCount[randomStat] = (droppedGemsCount[randomStat] || 0) + 1;
                    }
                    
                    setPlayStats(prev => {
                        const newCollection = { ...prev.gemCollection };
                        for (const [stat, count] of Object.entries(droppedGemsCount)) {
                           if (count) {
                                newCollection[stat as AllocatableStat] += count;
                           }
                        }
                        return { ...prev, gemCollection: newCollection };
                    });
                
                    const logMessages = Object.entries(droppedGemsCount)
                        .filter(([, count]) => count && count > 0)
                        .map(([stat, count]) => `${baseStatNames[stat as AllocatableStat]}のジェムx${count}`);
                    
                    if(logMessages.length > 0) {
                      addLog(`💎 ジェムを${numberOfGems}個手に入れた！ (${logMessages.join(', ')})`);
                    }
                } else {
                    const dropChance = BASE_DROP_CHANCE + currentCalculatedStats.luckValue * LUCK_TO_DROP_CHANCE_MULTIPLIER;
                    if (Math.random() < dropChance) {
                        const droppedItem = generateRandomEquipment(stageIndex);
                        playerUpdate = addEquipmentToPlayer(playerUpdate, droppedItem, trackEquipmentCollection, addLog);
                    }
                }
            }
            return { ...e, currentHp: newHp };
        });

        if(!targetIsDefeated) {
            setEnemyHits(prev => ({...prev, [enemyToAttack.id]: true}));
            setTimeout(() => setEnemyHits(prev => ({...prev, [enemyToAttack.id]: false })), 300);
        }
    };

    const processEnemyAIAndAttacks = () => {
        let totalPlayerDamageThisFrame = 0;
        let lastAttackingEnemy: Enemy | null = null;

        newEnemies = newEnemies.map(enemy => {
            if (enemy.currentHp <= 0) return enemy;

            const updatedEnemy = { ...enemy };

            if (updatedEnemy.attackState === 'preparing' && now >= updatedEnemy.attackStateTimer) {
                playSound('enemyAttack');
                
                const playerWidth = 64;
                const enemyWidth = 128;
                const distanceBetweenCenters = Math.abs((playerUpdate.x + playerWidth / 2) - (updatedEnemy.x + enemyWidth / 2));
                if (distanceBetweenCenters <= (playerWidth / 2) + (enemyWidth / 2) + ATTACK_RANGE) {
                    const damageInfos: DamageInfo[] = [];

                    const enemyAttack = updatedEnemy.physicalAttack;
                    const playerDefense = currentCalculatedStats.physicalDefense;
                    const totalStat = enemyAttack + playerDefense;
                    const damageMultiplier = totalStat > 0 ? enemyAttack / totalStat : 1;
                    let rawPhysicalDamage = enemyAttack * damageMultiplier * (0.9 + Math.random() * 0.2);
                    const finalPhysicalDamage = Math.max(1, Math.floor(rawPhysicalDamage));
                    totalPlayerDamageThisFrame += finalPhysicalDamage;
                    damageInfos.push({ text: `${finalPhysicalDamage}`, color: '#FFFFFF' });
                    
                    if (updatedEnemy.magicalAttack > updatedEnemy.physicalAttack) {
                        const power = updatedEnemy.baseStats.intelligence;
                        const baseMagicalDamage = (updatedEnemy.magicalAttack * 1.5) * (1 + power / 100);
                        const finalMagicalDamage = Math.max(1, Math.floor(baseMagicalDamage) - currentCalculatedStats.magicalDefense);
                        totalPlayerDamageThisFrame += finalMagicalDamage;
                        damageInfos.push({ text: `${finalMagicalDamage}`, color: ELEMENT_HEX_COLORS[updatedEnemy.element] });
                    }

                    if (damageInfos.length > 0) {
                        lastAttackingEnemy = updatedEnemy;
                        const damageInstance: DamageInstance = { id: nextDamageInstanceId.current++, x: playerUpdate.x + 16, damages: damageInfos };
                        setDamageInstances(prev => [...prev, damageInstance]);
                        setTimeout(() => setDamageInstances(prev => prev.filter(di => di.id !== damageInstance.id)), 1200);
                    }
                }
                updatedEnemy.attackState = 'attacking';
                updatedEnemy.attackStateTimer = now + updatedEnemy.attackAnimationTime;
            } else if (updatedEnemy.attackState === 'attacking' && now >= updatedEnemy.attackStateTimer) {
                updatedEnemy.attackState = 'idle';
            }

            if (updatedEnemy.id === engagedEnemyId && updatedEnemy.attackState === 'idle') {
                const lastAttackTime = enemyAttackTimers.current[updatedEnemy.id] || 0;
                const playerSpeed = currentCalculatedStats.speed;
                const enemySpeed = updatedEnemy.speed;
                const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
                const speedLevel = ATTACK_SPEED_LEVELS.find(level => speedRatio <= level.ratio) || ATTACK_SPEED_LEVELS[3];
                const engagedEnemyCooldown = Math.max(200, speedLevel.cooldown / speedRatio);

                if (now - lastAttackTime > engagedEnemyCooldown) {
                    updatedEnemy.attackState = 'preparing';
                    updatedEnemy.attackStateTimer = now + updatedEnemy.attackPrepareTime;
                    enemyAttackTimers.current[updatedEnemy.id] = now;
                }
            }
            return updatedEnemy;
        });

        return { totalPlayerDamageThisFrame, lastAttackingEnemy };
    };

    const applyPlayerDamageAndCheckDeath = (damage: number, attacker: Enemy | null) => {
        if (damage <= 0) return false;

        playSound('playerHit');
        playerUpdate.currentHp = Math.max(0, playerUpdate.currentHp - damage);
        setPlayerAction('hit');
        setTimeout(() => setPlayerAction(undefined), 300);

        if (playerUpdate.currentHp === 0) {
            playSound('playerDeath');
            addLog(attacker ? `${attacker.name} Lv.${attacker.level}にやられた…` : '力尽きた…');
            setGameState(GameState.PLAYER_DEAD);
            return true;
        }
        return false;
    };
    
    const handlePlayerLevelUp = () => {
        if (playerUpdate.xp < playerUpdate.xpToNextLevel) return;

        const remainingXp = playerUpdate.xp - playerUpdate.xpToNextLevel;
        playerUpdate.level += 1;
        addLog(`レベル ${playerUpdate.level} になった！`);
        playSound('levelUp');
        playerUpdate.xp = remainingXp;
        playerUpdate.xpToNextLevel = Math.floor(playerUpdate.xpToNextLevel * XP_FOR_NEXT_LEVEL_MULTIPLIER);
        
        if (playerUpdate.isStatAllocationLocked && playerUpdate.lastStatAllocation) {
            const newBaseStats: BaseStats = { ...playerUpdate.baseStats };
            let hpChange = 10;
            const lastAllocation = playerUpdate.lastStatAllocation;
            // FIX: Reverted to using Object.entries to iterate over stats.
            // This is more direct and consistent with other parts of the codebase (e.g., usePlayer.ts).
            for (const [stat, value] of Object.entries(lastAllocation)) {
                // FIX: Cast `value` to a number, as Object.entries can produce `unknown` values.
                newBaseStats[stat as AllocatableStat] += Number(value);
            }
            hpChange += ((lastAllocation.stamina as number) || 0) * 10 + ((lastAllocation.strength as number) || 0) * 2;
            playerUpdate.baseStats = newBaseStats;
            playerUpdate.currentHp += hpChange;
            addLog('ステータスが自動的に割り振られました。');
        } else {
            playerUpdate.statPoints = (playerUpdate.statPoints || 0) + STAT_POINTS_PER_LEVEL;
            setGameState(GameState.LEVEL_UP);
        }
    };

    const handlePlayerMovementAndStageChanges = (currentEngagedEnemy: Enemy | undefined) => {
        let dx = 0;
        const PLAYER_MOVE_SPEED_PPS = GAME_SPEED * 20;
        if (rightArrowPressed.current) dx += PLAYER_MOVE_SPEED_PPS * deltaTime;
        if (leftArrowPressed.current) dx -= PLAYER_MOVE_SPEED_PPS * deltaTime;

        if (currentEngagedEnemy) {
            const playerWidth = 64;
            const enemyWidth = 128;
            const playerFutureX = playerUpdate.x + dx;
            if (dx > 0 && (playerUpdate.x + playerWidth) <= currentEngagedEnemy.x && (playerFutureX + playerWidth) > currentEngagedEnemy.x) {
                dx = currentEngagedEnemy.x - (playerUpdate.x + playerWidth);
            } else if (dx < 0 && playerUpdate.x >= (currentEngagedEnemy.x + enemyWidth) && playerFutureX < (currentEngagedEnemy.x + enemyWidth)) {
                dx = (currentEngagedEnemy.x + enemyWidth) - playerUpdate.x;
            }
        }

        if (playerUpdate.x + dx < INITIAL_PLAYER.x) dx = INITIAL_PLAYER.x - playerUpdate.x;
        
        playerUpdate.x += dx;
        playerUpdate.isWalking = dx !== 0;
        if (dx > 0) setPlayStats(prev => ({ ...prev, totalDistanceTraveled: prev.totalDistanceTraveled + (dx / PIXELS_PER_METER) }));
        
        const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
        let nextStageIndex = stageIndex;
        const currentStageStartX = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength;
        
        if (playerUpdate.x > currentStageStartX + currentStagePixelLength) {
            nextStageIndex++;
            setStageIndex(nextStageIndex);
            setIsTransitioning(true);
            playerUpdate.x = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength;
        } else if (playerUpdate.x < currentStageStartX && nextStageIndex > 0) {
            nextStageIndex--;
            setStageIndex(nextStageIndex);
            setIsTransitioning(true);
            playerUpdate.x = INITIAL_PLAYER.x + nextStageIndex * currentStagePixelLength + currentStagePixelLength - 64;
        }
        
        const totalPixelsInCurrentStage = Math.max(0, playerUpdate.x - (INITIAL_PLAYER.x + stageIndex * currentStagePixelLength));
        setDistance(Math.min(STAGE_LENGTH, Math.floor(totalPixelsInCurrentStage / PIXELS_PER_METER)));
    };
    
    // --- Main Logic Flow for this Tick ---

    // Update prompts
    houseTarget.current = structures.find(s => s.type === 'house' && Math.abs(s.x - playerUpdate.x) < HEALING_HOUSE_RANGE) || null;
    setHousePrompt(!!houseTarget.current);
    shopTarget.current = structures.find(s => s.type.includes('_shop') && Math.abs(s.x - playerUpdate.x) < SHOP_RANGE) || null;
    setShopPrompt(!!shopTarget.current);
    teleporterTarget.current = structures.find(s => s.type === 'teleporter' && Math.abs(s.x - playerUpdate.x) < TELEPORTER_RANGE) || null;
    setTeleporterPrompt(!!teleporterTarget.current);

    // Update displayed enemy
    const activeEnemies = newEnemies.filter(e => e.currentHp > 0);
    if (displayedEnemyId === null && activeEnemies.length > 0) {
        const closest = activeEnemies.map(e => ({ e, d: Math.abs(e.x - playerUpdate.x) })).filter(d => d.d <= ENEMY_PANEL_DISPLAY_RANGE).sort((a,b) => a.d - b.d)[0];
        if(closest) setDisplayedEnemyId(closest.e.id);
    }

    // Update engaged enemy and ensure consistency within the current frame
    let currentEngagedEnemy = activeEnemies.find(e => e.id === engagedEnemyId);
    if (!currentEngagedEnemy && activeEnemies.length > 0) {
        const newTarget = activeEnemies.sort((a,b) => Math.abs(a.x - playerUpdate.x) - Math.abs(b.x - playerUpdate.x))[0];
        setEngagedEnemyId(newTarget.id);
        currentEngagedEnemy = newTarget; // Use the new target immediately in this frame
    }
    
    // Determine enemy to attack
    let enemyToAttack: Enemy | undefined = undefined;
    if (currentEngagedEnemy) {
      const distanceBetweenCenters = Math.abs((playerUpdate.x + 32) - (currentEngagedEnemy.x + 64));
      if (distanceBetweenCenters <= 32 + 64 + ATTACK_RANGE) {
        enemyToAttack = currentEngagedEnemy;
      }
    }

    // Execute game logic
    processPlayerAttack(enemyToAttack);
    const { totalPlayerDamageThisFrame, lastAttackingEnemy } = processEnemyAIAndAttacks();
    const isPlayerDead = applyPlayerDamageAndCheckDeath(totalPlayerDamageThisFrame, lastAttackingEnemy);

    if (!isPlayerDead) {
      handlePlayerLevelUp();
      handlePlayerMovementAndStageChanges(currentEngagedEnemy);
    }
    
    // Update state
    setEnemies(newEnemies.filter(e => e.currentHp > 0));
    setPlayer(playerUpdate);

  }, [gameState, isTransitioning, player, enemies, structures, stageIndex, distance, addLog, calculatedStats, engagedEnemyId, trackEquipmentCollection, displayedEnemyId, gameViewWidth, totalElementalDamages]);

  const savedCallback = useRef(updateGameLogic);
  useEffect(() => {
    savedCallback.current = updateGameLogic;
  }, [updateGameLogic]);
    
  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
        return;
    }
    
    const FPS = 60;
    const interval = 1000 / FPS;
    const deltaTime = interval / 1000;

    const gameLoopInterval = setInterval(() => {
      savedCallback.current(deltaTime);
    }, interval);

    return () => {
      clearInterval(gameLoopInterval);
    };
  }, [gameState]);
  
  const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
  const currentStageStartX = INITIAL_PLAYER.x + stageIndex * currentStagePixelLength;
  const currentStageEndX = currentStageStartX + currentStagePixelLength;
  let targetScrollX = player.x - 150; 
  const scrollX = Math.max(currentStageStartX - INITIAL_PLAYER.x, Math.min(targetScrollX, currentStageEndX - gameViewWidth));
  const worldOffset = -scrollX;
  
  const handlePointerDown = (direction: 'left' | 'right') => {
    if (direction === 'left') leftArrowPressed.current = true;
    if (direction === 'right') rightArrowPressed.current = true;
  };

  const handlePointerUp = () => {
    leftArrowPressed.current = false;
    rightArrowPressed.current = false;
  };
  
  const handleActionPress = () => {
    triggerAction();
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
    teleporterPrompt,
    goldDrops,
    damageInstances,
    playerAction,
    playerAttackDirection,
    enemyHits,
    calculatedStats,
    totalElementalDamages,
    totalDistance,
    currentArea,
    displayedEnemy,
    playStats,
    gameViewRef,
    worldOffset,
    stageIndex,
    startGame,
    continueGame,
    hasSaveData,
    handleBuyItem,
    handleStatAllocation,
    onCloseShop,
    handleEquipItem,
    handleUnequipItem,
    onCloseHouse,
    handleHeal,
    toggleStatAllocationLock,
    handlePointerDown,
    handlePointerUp,
    handleActionPress,
    saveAndExit,
    isMuted,
    toggleMute,
    handleTeleport,
    onCloseTeleporter,
  };
};