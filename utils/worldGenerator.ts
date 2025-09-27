import React from 'react';
import { Structure, SceneryObject, Enemy } from '../types';
import { calculateEnemyStats } from './statCalculations';
import { AREAS, SCENERY_CONFIG } from '../data/areas';
import { ENEMY_DATA } from '../data/enemies';
import { INITIAL_PLAYER } from '../constants/player';
import { PIXELS_PER_METER, SHOP_TYPES, STAGE_LENGTH, GEM_SLIME_SPAWN_CHANCE } from '../constants/game';

const createStructureForStage = (targetStageIndex: number): Structure | null => {
    const stageStartX = INITIAL_PLAYER.x + (targetStageIndex * STAGE_LENGTH * PIXELS_PER_METER);
    // Center the structure with some randomness
    const positionX = stageStartX + (STAGE_LENGTH * PIXELS_PER_METER / 2) + (Math.random() - 0.5) * 200;
    
    const areaIndex = Math.floor(targetStageIndex / 10);
    // 0-indexed stage number within the area (0-9)
    const stageInArea = targetStageIndex % 10;

    // Rule: Teleporter on the 1st stage of each area.
    if (targetStageIndex % 10 === 0) {
        return { id: targetStageIndex, type: 'teleporter', x: stageStartX + 200 }; // Place it near the start
    }

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

    const ENEMY_WIDTH = 128;
    const MIN_ENEMY_SEPARATION = ENEMY_WIDTH + 20;
    const spawnPadding = 150;
    const spawnAreaStart = stageStartX + spawnPadding;
    const spawnAreaEnd = stageEndX - spawnPadding - ENEMY_WIDTH;

    // 1. Create a list of all possible spawn positions (slots) based on separation distance
    const allPossibleSlots: number[] = [];
    for (let x = spawnAreaStart; x <= spawnAreaEnd; x += MIN_ENEMY_SEPARATION) {
        allPossibleSlots.push(x);
    }
    
    // 2. Filter out slots that would cause an enemy to overlap with a structure
    const COLLISION_BUFFER = 20;
    const availableSlots = allPossibleSlots.filter(pos => {
        const enemyStart = pos;
        const enemyEnd = pos + ENEMY_WIDTH;

        // .some returns true if the enemy overlaps with ANY structure
        const overlapsWithAStructure = structures.some(structure => {
            let STRUCTURE_WIDTH = 96; // Default for shop/teleporter
            if (structure.type === 'house') STRUCTURE_WIDTH = 120;
            
            const structureStart = structure.x - COLLISION_BUFFER;
            const structureEnd = structure.x + STRUCTURE_WIDTH + COLLISION_BUFFER;
            
            // Standard Axis-Aligned Bounding Box (AABB) overlap check on 1D axis
            // Returns true if they overlap, false otherwise.
            return enemyStart < structureEnd && enemyEnd > structureStart;
        });
        
        // A slot is available if it does NOT overlap with any structure
        return !overlapsWithAStructure;
    });


    // 3. Shuffle the available slots to randomize enemy positions
    // Fisher-Yates shuffle algorithm
    for (let i = availableSlots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableSlots[i], availableSlots[j]] = [availableSlots[j], availableSlots[i]];
    }

    // 4. Take the required number of spawn positions from the shuffled list
    const spawnPositions = availableSlots.slice(0, numberOfEnemies);

    // Now, iterate through the deterministically found spawn positions
    for (const spawnPosition of spawnPositions) {
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
            // Add a small random offset to the final position for more natural placement
            x: spawnPosition + (Math.random() - 0.5) * 10,
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