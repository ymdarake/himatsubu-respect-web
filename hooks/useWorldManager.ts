import { useState, useRef, useCallback, useMemo } from 'react';
import { Structure, SceneryObject } from '../types';
import { AREAS } from '../data/areas';

/**
 * ワールド（ステージ、建造物、背景）の状態管理を担当するカスタムフック
 *
 * 責務:
 * - ステージインデックスとステージ内距離の管理
 * - 建造物（structures）と背景オブジェクト（scenery）の管理
 * - 現在のエリア情報の提供
 * - 建造物との相互作用ターゲット管理
 */
export const useWorldManager = () => {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [scenery, setScenery] = useState<SceneryObject[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [distance, setDistance] = useState(0);

  const nextSceneryId = useRef(0);
  const shopTarget = useRef<Structure | null>(null);
  const houseTarget = useRef<Structure | null>(null);
  const teleporterTarget = useRef<Structure | null>(null);

  /**
   * 現在のエリアインデックスを計算
   */
  const currentAreaIndex = useMemo(
    () => Math.floor(stageIndex / 10),
    [stageIndex]
  );

  /**
   * 現在のエリア情報を取得（エリアをループ）
   */
  const currentArea = useMemo(
    () => AREAS[currentAreaIndex % AREAS.length],
    [currentAreaIndex]
  );

  /**
   * ワールドをリセット（ゲーム開始時や終了時）
   */
  const resetWorld = useCallback(() => {
    setStructures([]);
    setScenery([]);
    setStageIndex(0);
    setDistance(0);
    shopTarget.current = null;
    houseTarget.current = null;
    teleporterTarget.current = null;
  }, []);

  /**
   * 背景オブジェクトIDカウンターをリセット（ゲーム全体のリセット時）
   */
  const resetSceneryIdCounter = useCallback(() => {
    nextSceneryId.current = 0;
  }, []);

  return {
    // State
    structures,
    scenery,
    stageIndex,
    distance,

    // Refs
    nextSceneryId,
    shopTarget,
    houseTarget,
    teleporterTarget,

    // Setters
    setStructures,
    setScenery,
    setStageIndex,
    setDistance,

    // Computed values
    currentAreaIndex,
    currentArea,

    // Actions
    resetWorld,
    resetSceneryIdCounter,
  };
};
