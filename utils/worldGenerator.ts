import React from 'react';
import { Structure, ShopType, SceneryObject, Enemy } from '../types';
import { AREAS, ENEMY_DATA, INITIAL_PLAYER, PIXELS_PER_METER, SCENERY_CONFIG, SHOP_TYPES, STAGE_LENGTH } from '../constants';
import { calculateEnemyStats } from './statCalculations';

const createStructureForStage = (targetStageIndex: number): Structure | null => {
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
};

export const spawnStructuresForStage = (targetStageIndex: number): Structure[] => {
    const structure = createStructureForStage(targetStageIndex);
    return structure ? [structure] : [];
};

export const spawnSceneryForStage = (stageIndex: number, nextSceneryId: React.MutableRefObject<number>): SceneryObject[] => {
    const stageStartX = INITIAL_PLAYER.x + (stageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    const stageEndX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER);
    const areaIndex = Math.floor(stageIndex / 10);
    const currentAreaName = AREAS[Math.min(areaIndex, AREAS.length - 1)].name;

    const newScenery: SceneryObject[] = [];
    const sceneryTypes = SCENERY_CONFIG[currentAreaName] || [];
    
    for (let x = stageStartX; x < stageEndX; x += 50) { // Check every 50 pixels
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
};

export const spawnEnemiesForStage = (
    stageIndex: number,
    nextEnemyId: React.MutableRefObject<number>
): Enemy[] => {
    const enemies: Enemy[] = [];
    const stageStartX = INITIAL_PLAYER.x + (stageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    const stageEndX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER);

    const currentAreaIndex = Math.floor(stageIndex / 10);
    const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

    const numberOfEnemies = 2 + Math.floor(Math.random() * 3); // 2-4 enemies per stage

    for(let i = 0; i < numberOfEnemies; i++) {
        const spawnPadding = 150;
        const spawnableWidth = stageEndX - stageStartX - (spawnPadding * 2);
        const spawnPosition = stageStartX + spawnPadding + Math.random() * spawnableWidth;

        const availableEnemyNames = currentArea.enemyTypes;
        const randomEnemyName = availableEnemyNames[Math.floor(Math.random() * availableEnemyNames.length)];
        const enemyData = ENEMY_DATA[randomEnemyName];
        
        const enemyLevel = 1 + stageIndex;
        const { scaledBaseStats, derivedStats } = calculateEnemyStats(enemyData, enemyLevel);

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
        enemies.push(newEnemy);
    }
    return enemies.sort((a,b) => a.x - b.x);
};