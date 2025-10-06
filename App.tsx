
import React, { useState, useEffect } from 'react';
import { GameState, AllocatableStat, DerivedStat, DERIVED_STAT_NAMES, Element } from './types';
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
import TeleporterStructure from './components/TeleporterStructure';
import TeleporterModal from './components/TeleporterModal';
import { BaseStatsPanel, DerivedStatsPanel } from './components/PlayerStatsPanels';

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
  } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center h-dvh font-mono text-white p-2 sm:p-4 overflow-hidden bg-gray-900">
      <style>{`
        @keyframes gold-drop {
            0% { transform: translateY(0) scale(0.8); opacity: 1; }
            100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        .animate-gold-drop { animation: gold-drop 1s ease-out forwards; }
      `}</style>
      <div className="w-full max-w-5xl border-4 border-gray-700 bg-gray-800 rounded-lg shadow-2xl p-2 sm:p-4 relative flex flex-col h-full">
        <div ref={gameViewRef} className="relative w-full h-64 sm:h-80 rounded overflow-hidden flex-shrink-0">
          
          {gameState !== GameState.START && (
            <>
              <div className="absolute top-4 left-4 z-10 w-48 sm:w-64">
                <div className="flex justify-between text-xs mb-1 text-white" style={{textShadow: '1px 1px 2px black'}}>
                    <span>HP</span>
                    <span>{player.currentHp} / {calculatedStats.maxHp}</span>
                </div>
                <HealthBar current={player.currentHp} max={calculatedStats.maxHp} />
              </div>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <div className="h-10 sm:h-12 px-3 sm:px-4 bg-black bg-opacity-60 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                    <p className="text-xs sm:text-sm font-bold">{totalDistance}m</p>
                </div>
                {gameState === GameState.PLAYING && (
                    <button
                        onClick={saveAndExit}
                        className="h-10 sm:h-12 w-10 sm:w-12 bg-black bg-opacity-60 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm border-2 border-gray-600 flex items-center justify-center"
                        title="セーブしてタイトルへ戻る"
                        aria-label="セーブしてタイトルへ戻る"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                    </button>
                )}
                <button
                    onClick={toggleMute}
                    className="h-10 sm:h-12 w-10 sm:w-12 bg-black bg-opacity-60 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm border-2 border-gray-600 flex items-center justify-center"
                    title={isMuted ? "ミュート解除" : "ミュート"}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.657a1 1 0 01-1.414-1.414L14.586 12H14a2 2 0 01-2-2V8a2 2 0 012-2h.586l-1.343-1.343a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
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
                  equipment={player.equipment}
                />
            }
            {structures.map(structure => {
                if (structure.type === 'house') {
                    return <House key={`${structure.id}-${structure.type}`} structure={structure} />;
                } else if (structure.type === 'teleporter') {
                    return <TeleporterStructure key={`${structure.id}-${structure.type}`} structure={structure} />;
                } else {
                    return <ShopStructure key={`${structure.id}-${structure.type}`} structure={structure} />;
                }
            })}
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
                <p className="text-white text-sm sm:text-lg font-bold animate-pulse p-2 sm:p-3 bg-gray-800 rounded-lg border-2 border-green-400 shadow-lg">
                    スペースキーまたはアクションボタンで家に入る (回復: {player.level * 7} G)
                </p>
            </div>
          )}
          {teleporterPrompt && gameState === GameState.PLAYING && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <p className="text-white text-sm sm:text-lg font-bold animate-pulse p-2 sm:p-3 bg-gray-800 rounded-lg border-2 border-purple-400 shadow-lg">
                    スペースキーまたはアクションボタンで転送陣を使う
                </p>
            </div>
          )}
            
           {gameState === GameState.START && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-20 p-4 text-center">
               <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">サイドスクロールクエスト</h1>
               <p className="text-yellow-300 mb-2">どこまで進めるかな！</p>
               <p className="text-white mb-8 text-base sm:text-lg"><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">◀</kbd> や <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">▶</kbd> を押して移動</p>
                {hasSaveData ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={continueGame} className="px-6 py-3 sm:px-8 sm:py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-transform transform hover:scale-105 animate-bounce">
                        つづきから
                    </button>
                    <button onClick={startGame} className="px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-transform transform hover:scale-105">
                        はじめから
                    </button>
                  </div>
                ) : (
                  <button onClick={startGame} className="px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-transform transform hover:scale-105 animate-bounce">
                    ゲームスタート
                  </button>
                )}
             </div>
          )}
        </div>
        
        {gameState !== GameState.START && (
          <div className="mt-4 flex flex-col flex-grow overflow-hidden">
            {/* Mobile View */}
            <div className="sm:hidden flex flex-col h-full text-sm">
                <div className="grid grid-cols-5 gap-2 flex-shrink-0">
                    {/* Left Column */}
                    <div className="col-span-2 flex flex-col gap-2">
                        <BaseStatsPanel
                            player={player}
                            toggleStatAllocationLock={toggleStatAllocationLock}
                            variant="mobile"
                        />
                        <DerivedStatsPanel
                            calculatedStats={calculatedStats}
                            totalElementalDamages={totalElementalDamages}
                            variant="mobile"
                        />
                    </div>

                    {/* Right Column */}
                    <div className="col-span-3 flex flex-col gap-2">
                        <div className="flex-grow h-36">
                            {displayedEnemy ? (
                                <EnemyStatusPanel enemy={displayedEnemy} />
                            ) : (
                                <PlayStatsPanel playStats={playStats} player={player} />
                            )}
                        </div>
                        <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600">
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-400">武器</span>
                            <span className="font-bold truncate text-right">
                                {player.equipment.weapon ? player.equipment.weapon.name : '-- 無し --'}
                            </span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-400">防具</span>
                            <span className="font-bold truncate text-right">
                                {player.equipment.armor ? player.equipment.armor.name : '-- 無し --'}
                            </span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-400">アクセ</span>
                            <span className="font-bold truncate text-right">
                                {player.equipment.accessory ? player.equipment.accessory.name : '-- 無し --'}
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Log Panel Container */}
                <div className="relative mt-2 flex-grow">
                    {/* Scrollable log content */}
                    <div className="absolute inset-0 p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 overflow-y-auto">
                        <div className="space-y-1 text-xs">
                            {log.map((message, index) => (
                                <p key={index} className="text-gray-300">{message}</p>
                            ))}
                        </div>
                    </div>
                    {/* Touch controls as an overlay on top of the log */}
                    {gameState === GameState.PLAYING && (
                        <TouchControls 
                          onPointerDown={handlePointerDown} 
                          onPointerUp={handlePointerUp}
                          onAction={handleActionPress}
                          actionVisible={shopPrompt || housePrompt || teleporterPrompt}
                        />
                    )}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex flex-col gap-4 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm flex-shrink-0">
                <BaseStatsPanel
                    player={player}
                    toggleStatAllocationLock={toggleStatAllocationLock}
                    className="h-full"
                    variant="desktop"
                />
                <DerivedStatsPanel
                    calculatedStats={calculatedStats}
                    totalElementalDamages={totalElementalDamages}
                    className="h-full"
                    variant="desktop"
                />
                <div className="p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 h-full">
                  <EquipmentPanel equipment={player.equipment} />
                </div>
                {displayedEnemy ? (
                  <EnemyStatusPanel enemy={displayedEnemy} />
                ) : (
                  <PlayStatsPanel playStats={playStats} player={player} />
                )}
              </div>
              <div className="flex-grow p-3 bg-gray-900 bg-opacity-50 rounded border-2 border-gray-600 overflow-y-auto">
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
      {gameState === GameState.IN_HOUSE && (
        <EquipmentChangeModal
            player={player}
            calculatedStats={calculatedStats}
            onEquip={handleEquipItem}
            onUnequip={handleUnequipItem}
            onClose={onCloseHouse}
            onHeal={handleHeal}
        />
      )}
       {gameState === GameState.TELEPORTING && (
        <TeleporterModal
          player={player}
          playStats={playStats}
          currentStageIndex={stageIndex}
          onTeleport={handleTeleport}
          onClose={onCloseTeleporter}
        />
      )}
    </div>
  );
};

export default App;
