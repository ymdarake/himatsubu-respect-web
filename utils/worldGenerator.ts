import React from 'react';
import { Structure, ShopType, SceneryObject, Enemy } from '../types';
import { AREAS, ENEMY_DATA, INITIAL_PLAYER, PIXELS_PER_METER, SCENERY_CONFIG, SHOP_TYPES, STAGE_LENGTH, GEM_SLIME_SPAWN_CHANCE } from '../constants';
import { calculateEnemyStats } from './statCalculations';

const createStructureForStage = (targetStageIndex: number): Structure | null => {
    const stageStartX = INITIAL_PLAYER.x + (targetStageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    // Center the structure with some randomness
    const positionX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER / 2) + (Math.random() - 0.5) * 200;
    
    const areaIndex = Math.floor(targetStageIndex / 10);
    // 0-indexed stage number within the area (0-9)
    const stageInArea = targetStageIndex % 10;

    // Rule: House on the 7th stage (index 6)
    if (stageInArea === 6) { 
        return { id: targetStageIndex, type: 'house', x: positionX };
    }

    // Rule: Shops on the 3rd (index 2) and 6th (index 5) stages
    if (stageInArea === 2 || stageInArea === 5) {
        // Calculate the global sequence index for the shop to cycle through types
        const shopSequenceIndex = areaIndex * 2 + (stageInArea === 5 ? 1 : 0);
        const shopType = SHOP_TYPES[shopSequenceIndex % SHOP_TYPES.length];
        return { id: targetStageIndex, type: shopType, x: positionX };
    }

    // No structure for this stage
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
    nextEnemyId: React.MutableRefObject<number>,
    structures: Structure[]
): Enemy[] => {
    const enemies: Enemy[] = [];
    const stageStartX = INITIAL_PLAYER.x + (stageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    const stageEndX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER);

    const currentAreaIndex = Math.floor(stageIndex / 10);
    const currentArea = AREAS[Math.min(currentAreaIndex, AREAS.length - 1)];

    const numberOfEnemies = 4 + Math.floor(Math.random() * 2); // 4-5 enemies per stage

    const MIN_ENEMY_SEPARATION = 100;
    const MAX_SPAWN_ATTEMPTS = 20;
    const spawnPadding = 150;
    const spawnableWidth = stageEndX - stageStartX - (spawnPadding * 2);

    for(let i = 0; i < numberOfEnemies; i++) {
        let spawnPosition = 0;
        let positionIsSafe = false;
        let attempts = 0;

        while (!positionIsSafe && attempts < MAX_SPAWN_ATTEMPTS) {
            attempts++;
            spawnPosition = stageStartX + spawnPadding + Math.random() * spawnableWidth;

            // Check for separation from structures
            let tooCloseToStructure = false;
            const ENEMY_WIDTH = 80;
            const COLLISION_BUFFER = 20; // 20px padding on each side

            for (const structure of structures) {
                const STRUCTURE_WIDTH = structure.type === 'house' ? 120 : 96;
                
                const structureLeft = structure.x - COLLISION_BUFFER;
                const structureRight = structure.x + STRUCTURE_WIDTH + COLLISION_BUFFER;
                const enemyLeft = spawnPosition;
                const enemyRight = spawnPosition + ENEMY_WIDTH;

                // Check for overlap
                if (enemyRight > structureLeft && enemyLeft < structureRight) {
                    tooCloseToStructure = true;
                    break;
                }
            }
            if (tooCloseToStructure) {
                continue;
            }

            // Check for separation from other newly spawned enemies
            let tooCloseToOtherEnemy = false;
            for (const existingEnemy of enemies) {
                if (Math.abs(existingEnemy.x - spawnPosition) < MIN_ENEMY_SEPARATION) {
                    tooCloseToOtherEnemy = true;
                    break;
                }
            }
            if (tooCloseToOtherEnemy) {
                continue; // Position is unsafe, try again
            }

            // If all checks pass, the position is safe
            positionIsSafe = true;
        }

        if (positionIsSafe) {
            let randomEnemyName: string;
            // 5% chance to spawn a Gem Slime, otherwise spawn a regular enemy for the area
            if (Math.random() < GEM_SLIME_SPAWN_CHANCE) {
                randomEnemyName = 'ジェムスライム';
            } else {
                const availableEnemyNames = currentArea.enemyTypes;
                randomEnemyName = availableEnemyNames[Math.floor(Math.random() * availableEnemyNames.length)];
            }
            
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
    }
    return enemies.sort((a,b) => a.x - b.x);
};
