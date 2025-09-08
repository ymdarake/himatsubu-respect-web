import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, Enemy, Player as PlayerType, Structure, ShopType, Equipment, EquipmentType, AllocatableStat, BaseStats, Gem, DerivedStat, DERIVED_STAT_NAMES, SceneryObject, PlayStats, Element, DamageInstance, DamageInfo } from './types';
import { AREAS, INITIAL_PLAYER, ENEMY_DATA, GAME_SPEED, ATTACK_RANGE, STAGE_LENGTH, XP_FOR_NEXT_LEVEL_MULTIPLIER, HEALING_HOUSE_RANGE, PIXELS_PER_METER, LUCK_TO_GOLD_MULTIPLIER, SHOP_RANGE, SHOP_TYPES, STAT_POINTS_PER_LEVEL, BASE_DROP_CHANCE, LUCK_TO_DROP_CHANCE_MULTIPLIER, SCENERY_CONFIG, INITIAL_PLAY_STATS, BASE_EQUIPMENT_NAMES, ELEMENTAL_AFFINITY, ELEMENT_HEX_COLORS, ELEMENTAL_PREFIXES, ATTACK_SPEED_LEVELS } from './constants';
import Player from './components/Player';
import EnemyComponent from './components/Enemy';
import HealthBar from './components/HealthBar';
import XpBar from './components/XpBar';
import House from './components/House';
import Shop from './components/Shop';
import ShopStructure from './components/ShopStructure';
import EquipmentPanel from './components/EquipmentPanel';
import { playSound, resumeAudioContext, playBGM, stopBGM } from './utils/audio';
import LevelUpModal from './components/LevelUpModal';
import Scenery from './components/Scenery';
import EnemyStatusPanel from './components/EnemyStatusPanel';
import PlayStatsPanel from './components/PlayStatsPanel';
import DamageTextComponent from './components/DamageText';

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};


const App: React.FC = () => {
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

  const calculatedStats = useMemo(() => {
    const base = player.baseStats;
    const derived: Record<DerivedStat, number> = {
        maxHp: 20 + (base.stamina * 10) + (base.strength * 2),
        physicalAttack: 5 + (base.strength * 2) + (base.speedAgility * 1),
        physicalDefense: (base.stamina * 1) + (base.strength * 1),
        magicalAttack: (base.intelligence * 2),
        magicalDefense: (base.intelligence * 2) + (base.stamina * 1),
        speed: 10 + (base.speedAgility * 2),
        luckValue: 5 + (base.luck * 1),
    };

    const equipmentList = [player.equipment.weapon, player.equipment.armor, player.equipment.accessory];
    for (const item of equipmentList) {
        if (item) {
            for (const [stat, value] of Object.entries(item.stats)) {
                if (derived.hasOwnProperty(stat) && value) {
                    derived[stat as keyof typeof derived] += value;
                }
            }
        }
    }
    return derived;
  }, [player]);
  
  const engagedEnemy = useMemo(() => enemies.find(e => e.id === engagedEnemyId), [enemies, engagedEnemyId]);
  const currentAreaIndex = Math.floor(stageIndex / 10);
  const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

  const spawnScenery = useCallback((fromX: number, toX: number): SceneryObject[] => {
      const newScenery: SceneryObject[] = [];
      const sceneryTypes = SCENERY_CONFIG[currentArea.name] || [];
      
      for (let x = fromX; x < toX; x += 50) { // Check every 50 pixels
          for (const type of sceneryTypes) {
              if (Math.random() < type.density / 10) { // Density is per 500px, so divide by 10
                  const variant = type.variants[Math.floor(Math.random() * type.variants.length)];
                  newScenery.push({
                      id: nextSceneryId.current++,
                      type: type.type,
                      x: x + (Math.random() - 0.5) * 40,
                      variant: { ...variant, scale: 0.8 + Math.random() * 0.4 }
                  });
              }
          }
      }
      return newScenery;
  }, [currentArea.name]);

  const spawnStructure = useCallback((targetStageIndex: number): Structure | null => {
    const stageStartX = INITIAL_PLAYER.x + (targetStageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    const positionX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER / 2) + (Math.random() - 0.5) * 200;
    const areaIndex = Math.floor(targetStageIndex / 10);
    
    // Stage 2 of an area (index 1)
    if (targetStageIndex % 10 === 1) {
      return { id: areaIndex, type: 'house', x: positionX };
    }
    // Stage 6 of an area (index 5)
    if (targetStageIndex % 10 === 5) {
      const shopType = SHOP_TYPES[areaIndex % SHOP_TYPES.length];
      return { id: areaIndex, type: shopType, x: positionX };
    }
    return null;
  }, []);


  const startGame = useCallback(() => {
    resumeAudioContext().then(() => {
        stopBGM();
        playBGM();
        const initialCalculatedStats = calculatedStats;
        const initialPlayerState = {
            ...INITIAL_PLAYER,
            currentHp: initialCalculatedStats.maxHp,
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
  }, [calculatedStats, spawnStructure, spawnScenery]);

  const spawnEnemy = useCallback((playerPositionX: number, currentStageIndex: number, viewWidth: number): Enemy | null => {
    const spawnAheadDistance = viewWidth;
    if (!viewWidth) return null;

    const currentStagePixelLength = STAGE_LENGTH * PIXELS_PER_METER;
    const currentStageEndX = INITIAL_PLAYER.x + (currentStageIndex * currentStagePixelLength) + currentStagePixelLength;
    
    const currentAreaIndex = Math.floor(currentStageIndex / 10);
    const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

    if (playerPositionX + spawnAheadDistance > lastSpawnPosition.current) {
        const spawnPosition = lastSpawnPosition.current + 250 + Math.random() * 200;

        if (spawnPosition >= currentStageEndX - 80) {
            return null;
        }

        const availableEnemyNames = currentArea.enemyTypes;
        const randomEnemyName = availableEnemyNames[Math.floor(Math.random() * availableEnemyNames.length)];
        const enemyData = ENEMY_DATA[randomEnemyName];
        
        const enemyLevel = 1 + currentStageIndex;

        // Scale base stats with level
        const scaledBaseStats: BaseStats = { ...enemyData.baseStats };
        for (const stat in scaledBaseStats) {
            const key = stat as keyof BaseStats;
            const levelMultiplier = 1 + (enemyLevel - 1) * 0.15 + Math.pow(enemyLevel - 1, 2) * 0.005;
            scaledBaseStats[key] = Math.floor(scaledBaseStats[key] * levelMultiplier);
        }

        // Calculate derived stats from scaled base stats (using different base values than player)
        const derivedStats = {
            maxHp: Math.floor(10 + (scaledBaseStats.stamina * 5) + (scaledBaseStats.strength * 1.5)),
            physicalAttack: Math.floor(2 + (scaledBaseStats.strength * 1.8) + (scaledBaseStats.speedAgility * 0.5)),
            physicalDefense: Math.floor((scaledBaseStats.stamina * 0.8) + (scaledBaseStats.strength * 0.4)),
            magicalAttack: Math.floor((scaledBaseStats.intelligence * 2)),
            magicalDefense: Math.floor((scaledBaseStats.intelligence * 1.5) + (scaledBaseStats.stamina * 1)),
            speed: Math.floor(5 + (scaledBaseStats.speedAgility * 1.5)),
            luckValue: Math.floor(1 + (scaledBaseStats.luck * 1)),
        };

        const newEnemy: Enemy = {
            id: nextEnemyId.current++,
            name: enemyData.name,
            level: enemyLevel,
            baseStats: scaledBaseStats,
            maxHp: derivedStats.maxHp,
            currentHp: derivedStats.maxHp,
            physicalAttack: derivedStats.physicalAttack,
            physicalDefense: derivedStats.physicalDefense,
            magicalAttack: derivedStats.magicalAttack,
            magicalDefense: derivedStats.magicalDefense,
            speed: derivedStats.speed,
            luckValue: derivedStats.luckValue,
            element: enemyData.element,
            x: spawnPosition,
            attackState: 'idle',
            attackStateTimer: 0,
            color: enemyData.color,
            shape: enemyData.shape,
            xpValue: enemyData.xpValue,
            goldValue: enemyData.goldValue,
            attackPrepareTime: enemyData.attackPrepareTime,
            attackAnimationTime: enemyData.attackAnimationTime,
        };
        lastSpawnPosition.current = spawnPosition;
        return newEnemy;
    }
    return null;
  }, []);

  const generateRandomEquipment = useCallback((areaIndex: number): Equipment => {
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
  }, []);

  const generateShopItems = useCallback((shopType: ShopType, areaIndex: number): Equipment[] => {
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
  }, [gameState, stageIndex, generateShopItems]);
  
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
                const newBaseStats = {...prevPlayer.baseStats};
                const newEquipment = {...prevPlayer.equipment};
                // Calculate max HP with the preserved stats
                const tempMaxHp = 20 + (newBaseStats.stamina * 10) + (newBaseStats.strength * 2);
                
                return {
                    ...INITIAL_PLAYER,
                    baseStats: newBaseStats,
                    equipment: newEquipment,
                    currentHp: tempMaxHp, // Full heal based on persisted stats
                    level: prevPlayer.level,
                    xp: prevPlayer.xp,
                    xpToNextLevel: prevPlayer.xpToNextLevel,
                    gold: prevPlayer.gold,
                    statPoints: prevPlayer.statPoints,
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
        
        // From formula: HP: 20 + (体力 * 10) + (腕力 * 2)
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

      // Determine attack cooldowns based on relative speed
      let playerCooldown = 500; // Default when no enemy
      let engagedEnemyCooldown = 2000; // Default when no enemy

      if (currentEngagedEnemy) {
          const playerSpeed = currentCalculatedStats.speed;
          const enemySpeed = currentEngagedEnemy.speed;
          const speedRatio = playerSpeed > 0 && enemySpeed > 0 ? playerSpeed / enemySpeed : 1;
          
          const speedLevel = ATTACK_SPEED_LEVELS.find(level => speedRatio <= level.ratio) || ATTACK_SPEED_LEVELS[3]; // Fallback to normal
          playerCooldown = speedLevel.cooldown;
          
          engagedEnemyCooldown = Math.max(200, playerCooldown / speedRatio);
      }
      
      const enemyToAttack = currentEngagedEnemy && Math.abs(currentEngagedEnemy.x - playerUpdate.x) <= ATTACK_RANGE ? currentEngagedEnemy : undefined;
      
      // Player attack logic
      if (enemyToAttack && playerAttackReady.current) {
          playerAttackReady.current = false;
          setTimeout(() => { playerAttackReady.current = true; }, playerCooldown);
          
          playSound('playerAttack');
          
          setPlayerAction('attack');
          setTimeout(() => setPlayerAction(undefined), 300);

          let totalDamage = 0;
          const damageInfos: DamageInfo[] = [];

          // --- Physical Damage ---
          const physicalDamage = Math.max(1, Math.floor(currentCalculatedStats.physicalAttack * (0.8 + Math.random() * 0.4)) - enemyToAttack.physicalDefense);
          totalDamage += physicalDamage;
          damageInfos.push({ text: `${physicalDamage}`, color: '#FFFFFF' });
          
          // --- Magical Damage ---
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
            const newInstance: DamageInstance = {
              id: nextDamageInstanceId.current++,
              x: enemyToAttack.x + (Math.random() - 0.5) * 20,
              damages: damageInfos,
            };
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
                      if (e.id === engagedEnemyId) {
                        setEngagedEnemyId(null);
                      }
                      const xpGained = Math.floor(e.xpValue * (1 + stageIndex * 0.05));
                      playerUpdate.xp += xpGained;
                      setPlayStats(prev => ({ ...prev, totalXpGained: prev.totalXpGained + xpGained }));

                      const goldDropped = Math.floor(e.goldValue * (1 + currentCalculatedStats.luckValue * LUCK_TO_GOLD_MULTIPLIER));
                      playerUpdate.gold += goldDropped;
                      
                      const newDrop = { id: nextGoldDropId.current++, x: e.x + 10 };
                      setGoldDrops(prev => [...prev, newDrop]);
                      setTimeout(() => {
                        setGoldDrops(prev => prev.filter(d => d.id !== newDrop.id));
                      }, 1000);

                      addLog(`${e.name} レベル${e.level}を倒した！ +${goldDropped}G, +${xpGained}XP`);
                      
                      const dropChance = BASE_DROP_CHANCE + currentCalculatedStats.luckValue * LUCK_TO_DROP_CHANCE_MULTIPLIER;
                      if (Math.random() < dropChance) {
                          const isGemDrop = Math.random() < 0.3; // 30% chance for a gem
                          if (isGemDrop) {
                              const stats: AllocatableStat[] = ['strength', 'stamina', 'intelligence', 'speedAgility', 'luck'];
                              const randomStat = stats[Math.floor(Math.random() * stats.length)];
                              const gem: Gem = { name: `Gem of ${randomStat}`, stat: randomStat, value: 1 };
                              addLog(`✨ ${baseStatNames[gem.stat]}のジェムを見つけた！ ${baseStatNames[gem.stat]}が ${gem.value} 上がった！`);
                              playerUpdate.baseStats[gem.stat] += gem.value;
                              setPlayStats(prev => ({
                                  ...prev,
                                  gemCollection: {
                                      ...prev.gemCollection,
                                      [gem.stat]: (prev.gemCollection[gem.stat] || 0) + gem.value,
                                  }
                              }));
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
                   let rawDamage: number;
                   let damage: number;
                   let damageColor = '#FFFFFF';
                   
                   if (isMagicalAttack) {
                       const affinityMultiplier = ELEMENTAL_AFFINITY[enemy.element][player.equipment.armor?.elementalDamages ? Object.keys(player.equipment.armor.elementalDamages)[0] as Element : '無'] || 1; // Simplified for armor element
                       rawDamage = Math.floor(enemy.magicalAttack * (0.8 + Math.random() * 0.4));
                       const effectiveDamage = rawDamage * affinityMultiplier;
                       damage = Math.max(1, Math.floor(effectiveDamage) - currentCalculatedStats.magicalDefense);
                       damageColor = ELEMENT_HEX_COLORS[enemy.element];
                   } else {
                       rawDamage = Math.floor(enemy.physicalAttack * (0.8 + Math.random() * 0.4));
                       damage = Math.max(1, rawDamage - currentCalculatedStats.physicalDefense);
                   }
                   totalPlayerDamageThisFrame += damage;
                   
                   const damageInstance: DamageInstance = {
                     id: nextDamageInstanceId.current++,
                     x: playerUpdate.x + 16,
                     damages: [{ text: `${damage}`, color: damageColor }],
                   };
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
      if (enemyToAttack && dx > 0 && !isRetreating) {
        dx = 0;
      }

      if (playerUpdate.x + dx < INITIAL_PLAYER.x) { dx = INITIAL_PLAYER.x - playerUpdate.x; }
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
          if (newEnemy) { newEnemies.push(newEnemy); }
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono text-white p-4 overflow-hidden bg-gray-900">
      <style>{`
        @keyframes gold-drop {
            0% { transform: translateY(0) scale(0.8); opacity: 1; }
            100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        .animate-gold-drop { animation: gold-drop 1s ease-out forwards; }
      `}</style>
      <div className="w-full max-w-5xl border-4 border-gray-700 bg-gray-800 rounded-lg shadow-2xl p-4 relative flex flex-col">
        <div ref={gameViewRef} className="relative w-full h-80 rounded overflow-hidden">
          
          {gameState !== GameState.START && (
            <>
              <div className="absolute top-4 left-4 z-10 w-64">
                <div className="flex justify-between text-xs mb-1 text-white" style={{textShadow: '1px 1px 2px black'}}>
                    <span>HP</span>
                    <span>{player.currentHp} / {calculatedStats.maxHp}</span>
                </div>
                <HealthBar current={player.currentHp} max={calculatedStats.maxHp} />
              </div>

              <div className="absolute top-4 right-4 z-10 p-3 bg-black bg-opacity-60 rounded-lg border-2 border-gray-600">
                  <p className="text-3xl font-bold">{totalDistance}m</p>
              </div>
            </>
          )}

          <div className={`absolute top-0 left-0 w-full h-[70%] transition-colors duration-1000 ${currentArea.bgColor}`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-[30%] transition-colors duration-1000 ${currentArea.groundColor}`}></div>
          
          <div className="absolute top-0 left-0 h-full w-full" style={{ transform: `translateX(${worldOffset}px)` }}>
            {scenery.map(s => <Scenery key={s.id} scenery={s} />)}
            { gameState !== GameState.START && 
                <Player isAttacking={playerAction === 'attack'} isHit={playerAction === 'hit'} isWalking={player.isWalking} isDead={gameState === GameState.PLAYER_DEAD} x={player.x} />
            }
            {structures.map(structure => (
              structure.type === 'house' 
                ? <House key={`${structure.id}-${structure.type}`} structure={structure} />
                : <ShopStructure key={`${structure.id}-${structure.type}`} structure={structure} />
            ))}
            {enemies.map(enemy => (
                <EnemyComponent key={enemy.id} enemy={enemy} isHit={enemyHits[enemy.id] || false} />
            ))}
            {goldDrops.map(drop => (
              <div key={drop.id} className="absolute text-yellow-400 font-bold animate-gold-drop text-lg" style={{ left: `${drop.x}px`, bottom: '60px', zIndex: 25 }}>
                  💰G
              </div>
            ))}
            {damageInstances.map(instance => (
                <DamageTextComponent key={instance.id} instance={instance} />
            ))}
          </div>

           {shopPrompt && gameState === GameState.PLAYING && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <p className="text-white text-lg font-bold animate-pulse p-3 bg-gray-800 rounded-lg border-2 border-yellow-400 shadow-lg">スペースキーでお店に入る</p>
            </div>
          )}
            
           {gameState === GameState.START && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20">
               <h1 className="text-5xl font-bold text-white mb-2">サイドスクロールクエスト</h1>
               <p className="text-yellow-300 mb-2">どこまで進めるかな！</p>
                <p className="text-white mb-8 text-lg"><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">◀</kbd> や <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">▶</kbd> を押して移動</p>
               <button onClick={startGame} className="px-8 py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-transform transform hover:scale-105 animate-bounce">
                 ゲームスタート
               </button>
             </div>
          )}
        </div>
        
        {gameState !== GameState.START && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {/* Base Stats Panel */}
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
                    <div className="text-center mb-2 border-b border-gray-700 pb-1">
                        <span className="font-bold text-lg">レベル {player.level}</span>
                    </div>
                    <div className="space-y-1">
                        {Object.entries(player.baseStats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between">
                                <span>{baseStatNames[stat as keyof typeof baseStatNames]}</span>
                                <span className="font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Derived Stats Panel */}
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                        {Object.entries(calculatedStats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                            <span>{DERIVED_STAT_NAMES[stat as keyof typeof DERIVED_STAT_NAMES]}</span>
                            <span className="font-bold">{Math.floor(value)}</span>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Equipment Panel */}
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
                    <EquipmentPanel equipment={player.equipment} />
                </div>

                {/* Conditional Panel: Enemy or Play Stats */}
                { engagedEnemy ? (
                    <EnemyStatusPanel enemy={engagedEnemy} />
                ) : (
                    <PlayStatsPanel playStats={playStats} player={player} />
                )}
            </div>
            {/* Log Panel */}
            <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-40 overflow-y-auto">
                 <div className="space-y-1 text-xs">
                    {log.map((message, index) => (
                        <p key={index} className="text-gray-300">{message}</p>
                    ))}
                 </div>
            </div>
          </div>
        )}
      </div>
      {gameState === GameState.SHOPPING && shopData && (
        <Shop shopData={shopData} playerData={{ gold: player.gold }} equipment={player.equipment} onBuy={handleBuyItem} onClose={() => { setGameState(GameState.PLAYING); setShopData(null); }} />
      )}
      {gameState === GameState.LEVEL_UP && (
        <LevelUpModal player={player} onConfirm={handleStatAllocation} />
      )}
    </div>
  );
};

export default App;