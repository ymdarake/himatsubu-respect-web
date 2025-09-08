import React, { useState, useEffect } from 'react';
import { GameState, AllocatableStat, DerivedStat, DERIVED_STAT_NAMES } from './types';
import { useGameLogic } from './hooks/useGameLogic';
import Player from './components/Player';
import EnemyComponent from './components/Enemy';
import HealthBar from './components/HealthBar';
import House from './components/House';
import Shop from './components/Shop';
import ShopStructure from './components/ShopStructure';
import EquipmentPanel from './components/EquipmentPanel';
import LevelUpModal from './components/LevelUpModal';
import Scenery from './components/Scenery';
import EnemyStatusPanel from './components/EnemyStatusPanel';
import PlayStatsPanel from './components/PlayStatsPanel';
import DamageTextComponent from './components/DamageText';
import EquipmentChangeModal from './components/EquipmentChangeModal';
import TouchControls from './components/TouchControls';

const baseStatNames: Record<AllocatableStat, string> = {
  strength: '腕力',
  stamina: '体力',
  intelligence: '知力',
  speedAgility: '敏捷',
  luck: '幸運',
};

const App: React.FC = () => {
  const {
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
    handlePointerDown,
    handlePointerUp,
    handleActionPress,
  } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-mono text-white p-2 sm:p-4 overflow-hidden bg-gray-900">
      <style>{`
        @keyframes gold-drop {
            0% { transform: translateY(0) scale(0.8); opacity: 1; }
            100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        .animate-gold-drop { animation: gold-drop 1s ease-out forwards; }
      `}</style>
      <div className="w-full max-w-5xl border-4 border-gray-700 bg-gray-800 rounded-lg shadow-2xl p-2 sm:p-4 relative flex flex-col">
        <div ref={gameViewRef} className="relative w-full h-64 sm:h-80 rounded overflow-hidden">
          
          {gameState !== GameState.START && (
            <>
              <div className="absolute top-4 left-4 z-10 w-48 sm:w-64">
                <div className="flex justify-between text-xs mb-1 text-white" style={{textShadow: '1px 1px 2px black'}}>
                    <span>HP</span>
                    <span>{player.currentHp} / {calculatedStats.maxHp}</span>
                </div>
                <HealthBar current={player.currentHp} max={calculatedStats.maxHp} />
              </div>

              <div className="absolute top-4 right-4 z-10 p-2 sm:p-3 bg-black bg-opacity-60 rounded-lg border-2 border-gray-600">
                  <p className="text-xl sm:text-3xl font-bold">{totalDistance}m</p>
              </div>
            </>
          )}

          <div className={`absolute top-0 left-0 w-full h-[70%] transition-colors duration-1000 ${currentArea.bgColor}`}></div>
          <div className={`absolute bottom-0 left-0 w-full h-[30%] transition-colors duration-1000 ${currentArea.groundColor}`}></div>
          
          <div className="absolute top-0 left-0 h-full w-full" style={{ transform: `translateX(${worldOffset}px)` }}>
            {scenery.map(s => <Scenery key={s.id} scenery={s} />)}
            { gameState !== GameState.START && 
                <Player 
                  isAttacking={playerAction === 'attack'} 
                  isHit={playerAction === 'hit'} 
                  isWalking={player.isWalking} 
                  isDead={gameState === GameState.PLAYER_DEAD} 
                  x={player.x}
                  attackDirection={playerAttackDirection}
                />
            }
            {structures.map(structure => (
              structure.type === 'house' 
                ? <House key={`${structure.id}-${structure.type}`} structure={structure} />
                : <ShopStructure key={`${structure.id}-${structure.type}`} structure={structure} />
            ))}
            {enemies.map(enemy => (
                <EnemyComponent key={enemy.id} enemy={enemy} isHit={enemyHits[enemy.id] || false} playerX={player.x} />
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
              <p className="text-white text-sm sm:text-lg font-bold animate-pulse p-2 sm:p-3 bg-gray-800 rounded-lg border-2 border-yellow-400 shadow-lg">スペースキーまたはアクションボタンでお店に入る</p>
            </div>
          )}
          {housePrompt && gameState === GameState.PLAYING && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <p className="text-white text-sm sm:text-lg font-bold animate-pulse p-2 sm:p-3 bg-gray-800 rounded-lg border-2 border-green-400 shadow-lg">スペースキーまたはアクションボタンで家に入る</p>
            </div>
          )}
            
           {gameState === GameState.START && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
               <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">サイドスクロールクエスト</h1>
               <p className="text-yellow-300 mb-2">どこまで進めるかな！</p>
                <p className="text-white mb-8 text-base sm:text-lg"><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">◀</kbd> や <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">▶</kbd> を押して移動</p>
               <button onClick={startGame} className="px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-transform transform hover:scale-105 animate-bounce">
                 ゲームスタート
               </button>
             </div>
          )}
          {gameState === GameState.PLAYING && (
              <TouchControls 
                onPointerDown={handlePointerDown} 
                onPointerUp={handlePointerUp}
                onAction={handleActionPress}
                actionVisible={shopPrompt || housePrompt}
              />
          )}
        </div>
        
        {gameState !== GameState.START && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Mobile Grid View */}
            <div className="sm:hidden grid grid-cols-2 gap-2 text-sm">
                {/* Left Column */}
                <div className="col-span-1 flex flex-col gap-2">
                    <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 flex flex-col">
                        <div className="text-center mb-2 border-b border-gray-700 pb-1">
                            <span className="font-bold text-base">レベル {player.level}</span>
                        </div>
                        <div className="space-y-1 flex-grow text-xs">
                            {Object.entries(player.baseStats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between">
                                <span>{baseStatNames[stat as keyof typeof baseStatNames]}</span>
                                <span className="font-bold">{value}</span>
                            </div>
                            ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-700">
                            <label className="flex items-center space-x-2 cursor-pointer text-xs select-none" title={!player.lastStatAllocation ? "一度レベルアップしてステータスを割り振ると有効になります" : "ステータス割り振りを固定する"}>
                            <input type="checkbox" className="form-checkbox h-3 w-3 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed" checked={player.isStatAllocationLocked} onChange={toggleStatAllocationLock} disabled={!player.lastStatAllocation} />
                            <span className={player.lastStatAllocation ? '' : 'text-gray-500'}>ステ振り固定</span>
                            </label>
                        </div>
                    </div>
                    <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                        {Object.entries(calculatedStats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between">
                            <span>{DERIVED_STAT_NAMES[stat as keyof typeof DERIVED_STAT_NAMES]}</span>
                            <span className="font-bold">{Math.floor(value)}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-1 flex flex-col gap-2">
                    {displayedEnemy ? (
                        <EnemyStatusPanel enemy={displayedEnemy} />
                    ) : (
                        <PlayStatsPanel playStats={playStats} player={player} />
                    )}
                    <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600">
                      <EquipmentPanel equipment={player.equipment} />
                    </div>
                </div>

                {/* Log Panel */}
                <div className="col-span-2 p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-20 overflow-y-auto">
                    <div className="space-y-1 text-xs">
                        {log.map((message, index) => (
                            <p key={index} className="text-gray-300">{message}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden sm:flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full flex flex-col">
                  <div className="text-center mb-2 border-b border-gray-700 pb-1">
                    <span className="font-bold text-lg">レベル {player.level}</span>
                  </div>
                  <div className="space-y-1 flex-grow">
                    {Object.entries(player.baseStats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span>{baseStatNames[stat as keyof typeof baseStatNames]}</span>
                        <span className="font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <label className="flex items-center space-x-2 cursor-pointer text-sm select-none" title={!player.lastStatAllocation ? "一度レベルアップしてステータスを割り振ると有効になります" : "ステータス割り振りを固定する"}>
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed" checked={player.isStatAllocationLocked} onChange={toggleStatAllocationLock} disabled={!player.lastStatAllocation} />
                      <span className={player.lastStatAllocation ? '' : 'text-gray-500'}>ステ振り固定</span>
                    </label>
                  </div>
                </div>
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
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
                  <EquipmentPanel equipment={player.equipment} />
                </div>
                {displayedEnemy ? (
                  <EnemyStatusPanel enemy={displayedEnemy} />
                ) : (
                  <PlayStatsPanel playStats={playStats} player={player} />
                )}
              </div>
              <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-24 sm:h-40 overflow-y-auto">
                <div className="space-y-1 text-xs">
                  {log.map((message, index) => (
                    <p key={index} className="text-gray-300">{message}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {gameState === GameState.SHOPPING && shopData && (
        <Shop
          shopData={shopData}
          player={player}
          onBuy={handleBuyItem}
          onClose={onCloseShop}
          onEquip={handleEquipItem}
          onUnequip={handleUnequipItem}
        />
      )}
      {gameState === GameState.LEVEL_UP && (
        <LevelUpModal player={player} onConfirm={handleStatAllocation} />
      )}
      {gameState === GameState.EQUIPMENT_CHANGE && (
        <EquipmentChangeModal
            player={player}
            onEquip={handleEquipItem}
            onUnequip={handleUnequipItem}
            onClose={onCloseEquipmentChange}
        />
      )}
    </div>
  );
};

export default App;