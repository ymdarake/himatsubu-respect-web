import React from 'react';

interface EnemySpriteProps {
  enemyName: string;
  isBoss?: boolean;
}

const EnemySprite: React.FC<EnemySpriteProps> = ({ enemyName, isBoss }) => {
     const svgProps = {
        viewBox: "0 0 20 20",
        xmlns: "http://www.w3.org/2000/svg",
        className: "w-full h-full",
        shapeRendering: "crispEdges" as const
     }

     // 動的生成されたボス名の場合、ベース名を取得
     let displayName = enemyName;
     if (isBoss && !['ゴブリンキング', 'フォレストタイラント', 'ストーンコロッサス', 'ボルケーノロード', 'ナイトメアキング', 'カオスエンペラー'].includes(enemyName)) {
         const baseBossNames = ['ゴブリンキング', 'フォレストタイラント', 'ストーンコロッサス', 'ボルケーノロード', 'ナイトメアキング', 'カオスエンペラー'];
         for (const baseName of baseBossNames) {
             if (enemyName.startsWith(baseName)) {
                 displayName = baseName;
                 break;
             }
         }
     }

     switch (displayName) {
        case 'スライム':
            return (
                <svg {...svgProps}>
                  <rect x="6" y="16" width="8" height="1" fill="#16a34a" /> {/* Shadow */}
                  <rect x="5" y="15" width="10" height="1" fill="#22c55e" />
                  <rect x="4" y="12" width="12" height="3" fill="#22c55e" />
                  <rect x="5" y="9" width="10" height="3" fill="#22c55e" />
                  <rect x="6" y="7" width="8" height="2" fill="#22c55e" />
                  <rect x="7" y="6" width="6" height="1" fill="#22c55e" />
                  <rect x="5" y="10" width="1" height="1" fill="#4ade80" /> {/* Highlight */}
                  <rect x="6" y="8" width="2" height="1" fill="#4ade80" /> {/* Highlight */}
                  <rect x="7" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="12" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                </svg>
            );
        case 'ゴブリン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="1" fill="#15803d" /> {/* Head top */}
                    <rect x="7" y="6" width="6" height="3" fill="#15803d" /> {/* Head main */}
                    <rect x="6" y="7" width="1" height="1" fill="#15803d" /> {/* Left ear */}
                    <rect x="13" y="7" width="1" height="1" fill="#15803d" /> {/* Right ear */}
                    <rect x="8" y="7" width="1" height="1" fill="#facc15" /> {/* Left eye */}
                    <rect x="11" y="7" width="1" height="1" fill="#facc15" /> {/* Right eye */}
                    <rect x="7" y="9" width="6" height="5" fill="#a16207" /> {/* Body/Tunic */}
                    <rect x="6" y="9" width="1" height="3" fill="#15803d" /> {/* Left arm */}
                    <rect x="13" y="9" width="1" height="3" fill="#15803d" /> {/* Right arm */}
                    <rect x="7" y="14" width="2" height="3" fill="#15803d" /> {/* Left leg */}
                    <rect x="11" y="14" width="2" height="3" fill="#15803d" /> {/* Right leg */}
                    <rect x="7" y="17" width="2" height="1" fill="#422006" /> {/* Left foot */}
                    <rect x="11" y="17" width="2" height="1" fill="#422006" /> {/* Right foot */}
                </svg>
            );
        case 'ウルフ':
            return (
                <svg {...svgProps}>
                    <rect x="13" y="16" width="2" height="2" fill="#4b5563" /> {/* Back leg */}
                    <rect x="6" y="16" width="2" height="2" fill="#4b5563" /> {/* Front leg */}
                    <rect x="5" y="10" width="10" height="6" fill="#6b7280" /> {/* Body */}
                    <rect x="4" y="9" width="3" height="3" fill="#6b7280" /> {/* Head */}
                    <rect x="3" y="11" width="2" height="1" fill="#6b7280" /> {/* Snout */}
                    <rect x="4" y="10" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="3" y="12" width="1" height="1" fill="#fff" /> {/* Fang */}
                    <rect x="15" y="9" width="2" height="3" fill="#6b7280" /> {/* Tail */}
                    <rect x="14" y="8" width="1" height="1" fill="#6b7280" />
                    <rect x="5" y="8" width="1" height="1" fill="#6b7280" /> {/* Left ear */}
                    <rect x="7" y="8" width="1" height="1" fill="#6b7280" /> {/* Right ear */}
                </svg>
            );
        case 'バット':
            return (
                <svg {...svgProps}>
                    <rect x="9" y="8" width="2" height="4" fill="#4b5563" /> {/* Body */}
                    <rect x="8" y="7" width="1" height="1" fill="#4b5563" /> {/* Ear */}
                    <rect x="11" y="7" width="1" height="1" fill="#4b5563" /> {/* Ear */}
                    <rect x="9" y="9" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="4" y="7" width="5" height="2" fill="#374151" /> {/* Left wing top */}
                    <rect x="11" y="7" width="5" height="2" fill="#374151" /> {/* Right wing top */}
                    <rect x="2" y="9" width="7" height="2" fill="#374151" /> {/* Left wing mid */}
                    <rect x="11" y="9" width="7" height="2" fill="#374151" /> {/* Right wing mid */}
                    <rect x="3" y="11" width="6" height="1" fill="#374151" /> {/* Left wing bot */}
                    <rect x="11" y="11" width="6" height="1" fill="#374151" /> {/* Right wing bot */}
                </svg>
            );
        case 'スケルトン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="4" width="4" height="3" fill="#e2e8f0" /> {/* Skull */}
                    <rect x="9" y="5" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="11" y="5" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="7" y="7" width="6" height="1" fill="#e2e8f0" /> {/* Jaw */}
                    <rect x="9" y="8" width="2" height="1" fill="#e2e8f0" /> {/* Neck */}
                    <rect x="7" y="9" width="6" height="4" fill="#e2e8f0" /> {/* Ribs */}
                    <rect x="8" y="9" width="1" height="4" fill="#cbd5e1" />
                    <rect x="11" y="9" width="1" height="4" fill="#cbd5e1" />
                    <rect x="5" y="9" width="2" height="4" fill="#e2e8f0" /> {/* Left Arm */}
                    <rect x="13" y="9" width="2" height="4" fill="#e2e8f0" /> {/* Right Arm */}
                    <rect x="7" y="13" width="2" height="4" fill="#e2e8f0" /> {/* Left Leg */}
                    <rect x="11" y="13" width="2" height="4" fill="#e2e8f0" /> {/* Right Leg */}
                    <rect x="15" y="7" width="1" height="8" fill="#94a3b8" /> {/* Sword */}
                    <rect x="14" y="10" width="3" height="1" fill="#64748b" /> {/* Hilt */}
                </svg>
            );
        case 'トレント':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="10" width="6" height="8" fill="#78350f" />
                    <rect x="6" y="12" width="1" height="5" fill="#78350f" />
                    <rect x="13" y="12" width="1" height="5" fill="#78350f" />
                    <rect x="8" y="12" width="1" height="1" fill="#ef4444" />
                    <rect x="11" y="12" width="1" height="1" fill="#ef4444" />
                    <rect x="4" y="4" width="12" height="6" fill="#166534" />
                    <rect x="6" y="2" width="8" height="2" fill="#166534" />
                    <rect x="2" y="6" width="2" height="3" fill="#16a34a" />
                    <rect x="16" y="6" width="2" height="3" fill="#16a34a" />
                </svg>
            );
        case 'オーク':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="4" width="8" height="5" fill="#556b2f" />
                    <rect x="7" y="9" width="1" height="1" fill="#ffffff" /> {/* Left tusk */}
                    <rect x="12" y="9" width="1" height="1" fill="#ffffff" /> {/* Right tusk */}
                    <rect x="7" y="6" width="2" height="1" fill="#fca5a5" /> {/* Left eye */}
                    <rect x="11" y="6" width="2" height="1" fill="#fca5a5" /> {/* Right eye */}
                    <rect x="5" y="9" width="10" height="6" fill="#556b2f" />
                    <rect x="4" y="9" width="1" height="4" fill="#556b2f" /> {/* Left arm */}
                    <rect x="15" y="9" width="1" height="4" fill="#556b2f" /> {/* Right arm */}
                    <rect x="6" y="15" width="3" height="3" fill="#556b2f" />
                    <rect x="11" y="15" width="3" height="3" fill="#556b2f" />
                </svg>
            );
        case 'リザードマン':
             return (
                 <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="4" fill="#0d9488" /> {/* Head */}
                    <rect x="7" y="7" width="1" height="1" fill="#0d9488" /> {/* Snout */}
                    <rect x="9" y="6" width="1" height="1" fill="#fef08a" /> {/* Eye */}
                    <rect x="7" y="9" width="6" height="6" fill="#0f766e" /> {/* Body */}
                    <rect x="5" y="9" width="2" height="4" fill="#0d9488" /> {/* Left arm */}
                    <rect x="13" y="9" width="2" height="4" fill="#0d9488" /> {/* Right arm */}
                    <rect x="7" y="15" width="2" height="3" fill="#0d9488" /> {/* Left leg */}
                    <rect x="11" y="15" width="2" height="3" fill="#0d9488" /> {/* Right leg */}
                    <rect x="15" y="3" width="1" height="13" fill="#a16207" /> {/* Spear Shaft */}
                    <rect x="14" y="2" width="3" height="1" fill="#94a3b8" /> {/* Spear Head */}
                 </svg>
             );
        case 'ロック・スパイダー':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="7" width="6" height="6" fill="#44403c" />
                    <rect x="9" y="6" width="2" height="1" fill="#44403c" /> {/* Head */}
                    <rect x="8" y="7" width="1" height="1" fill="#dc2626" />
                    <rect x="11" y="7" width="1" height="1" fill="#dc2626" />
                    <rect x="9" y="8" width="1" height="1" fill="#dc2626" />
                    <rect x="10" y="8" width="1" height="1" fill="#dc2626" />
                    <rect x="4" y="6" width="3" height="1" fill="#57534e" />
                    <rect x="13" y="6" width="3" height="1" fill="#57534e" />
                    <rect x="3" y="8" width="4" height="1" fill="#57534e" />
                    <rect x="13" y="8" width="4" height="1" fill="#57534e" />
                    <rect x="3" y="11" width="4" height="1" fill="#57534e" />
                    <rect x="13" y="11" width="4" height="1" fill="#57534e" />
                    <rect x="4" y="13" width="3" height="1" fill="#57534e" />
                    <rect x="13" y="13" width="3" height="1" fill="#57534e" />
                </svg>
            );
        case 'ゴーレム':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="3" width="8" height="4" fill="#a8a29e" />
                    <rect x="8" y="5" width="1" height="1" fill="#f59e0b" /> {/* Eye */}
                    <rect x="11" y="5" width="1" height="1" fill="#f59e0b" /> {/* Eye */}
                    <rect x="4" y="7" width="12" height="7" fill="#78716c" />
                    <rect x="2" y="8" width="2" height="5" fill="#78716c" />
                    <rect x="16" y="8" width="2" height="5" fill="#78716c" />
                    <rect x="5" y="14" width="4" height="4" fill="#a8a29e" />
                    <rect x="11" y="14" width="4" height="4" fill="#a8a29e" />
                </svg>
            );
        case 'ガーゴイル':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="6" width="4" height="3" fill="#52525b" /> {/* Head */}
                    <rect x="7" y="5" width="1" height="1" fill="#52525b" /> {/* Horn */}
                    <rect x="12" y="5" width="1" height="1" fill="#52525b" /> {/* Horn */}
                    <rect x="9" y="7" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="7" y="9" width="6" height="5" fill="#71717a" /> {/* Body */}
                    <rect x="5" y="14" width="3" height="3" fill="#71717a" /> {/* Left Leg */}
                    <rect x="12" y="14" width="3" height="3" fill="#71717a" /> {/* Right Leg */}
                    <rect x="3" y="7" width="4" height="2" fill="#52525b" /> {/* Left Wing */}
                    <rect x="13" y="7" width="4" height="2" fill="#52525b" /> {/* Right Wing */}
                    <rect x="2" y="9" width="5" height="1" fill="#52525b" />
                    <rect x="13" y="9" width="5" height="1" fill="#52525b" />
                </svg>
            );
        case 'ファイア・エレメンタル':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="15" width="6" height="2" fill="#ea580c" />
                    <rect x="6" y="12" width="8" height="3" fill="#f97316" />
                    <rect x="5" y="10" width="10" height="2" fill="#f97316" />
                    <rect x="7" y="8" width="6" height="2" fill="#f97316" />
                    <rect x="8" y="6" width="4" height="2" fill="#f97316" />
                    <rect x="9" y="4" width="2" height="2" fill="#f97316" />
                    <rect x="8" y="13" width="4" height="2" fill="#fef08a" />
                    <rect x="7" y="11" width="6" height="2" fill="#fcd34d" />
                    <rect x="9" y="9" width="2" height="2" fill="#fef08a" />
                    <rect x="8" y="10" width="1" height="1" fill="#fff" />
                    <rect x="11" y="10" width="1" height="1" fill="#fff" />
                </svg>
            );
        case 'ハーピー':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="5" width="4" height="3" fill="#f0c8a0" /> {/* Head */}
                    <rect x="7" y="8" width="6" height="4" fill="#f0c8a0" /> {/* Body */}
                    <rect x="9" y="6" width="1" height="1" fill="#000" /> {/* Eye */}
                    <rect x="2" y="6" width="5" height="2" fill="#a16207" /> {/* Left Wing */}
                    <rect x="13" y="6" width="5" height="2" fill="#a16207" /> {/* Right Wing */}
                    <rect x="1" y="8" width="6" height="2" fill="#a16207" />
                    <rect x="13" y="8" width="6" height="2" fill="#a16207" />
                    <rect x="7" y="12" width="2" height="3" fill="#ca8a04" /> {/* Left Leg */}
                    <rect x="11" y="12" width="2" height="3" fill="#ca8a04" /> {/* Right Leg */}
                </svg>
            );
        case 'ウィザード':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="2" width="6" height="2" fill="#581c87" /> {/* Hat Top */}
                    <rect x="5" y="4" width="10" height="2" fill="#581c87" /> {/* Hat Brim */}
                    <rect x="7" y="6" width="6" height="3" fill="#f0c8a0" /> {/* Face */}
                    <rect x="8" y="7" width="1" height="1" fill="#fff" /> {/* Eye */}
                    <rect x="11" y="7" width="1" height="1" fill="#fff" /> {/* Eye */}
                    <rect x="6" y="9" width="8" height="8" fill="#6b21a8" /> {/* Robe */}
                    <rect x="3" y="8" width="2" height="4" fill="#581c87" /> {/* Left Arm */}
                    <rect x="15" y="8" width="2" height="4" fill="#581c87" /> {/* Right Arm */}
                    <rect x="1" y="6" width="2" height="8" fill="#a16207" /> {/* Staff */}
                    <rect x="0" y="5" width="4" height="1" fill="#fde047" /> {/* Staff Orb */}
                </svg>
            );
        case 'ミノタウロス':
            return (
                <svg {...svgProps}>
                    <rect x="7" y="2" width="6" height="4" fill="#b45309" /> {/* Head */}
                    <rect x="5" y="3" width="2" height="1" fill="#fef08a" /> {/* Left Horn */}
                    <rect x="13" y="3" width="2" height="1" fill="#fef08a" /> {/* Right Horn */}
                    <rect x="8" y="4" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="11" y="4" width="1" height="1" fill="#ef4444" /> {/* Eye */}
                    <rect x="4" y="6" width="12" height="8" fill="#ca8a04" /> {/* Body */}
                    <rect x="2" y="7" width="2" height="5" fill="#b45309" /> {/* Left Arm */}
                    <rect x="16" y="7" width="2" height="5" fill="#b45309" /> {/* Right Arm */}
                    <rect x="1" y="2" width="1" height="10" fill="#71717a" /> {/* Axe Handle */}
                    <rect x="0" y="1" width="3" height="3" fill="#9ca3af" /> {/* Axe Head */}
                </svg>
            );
        case 'ドラゴン':
            return (
                <svg {...svgProps}>
                    <rect x="8" y="10" width="8" height="6" fill="#450a0a" />
                    <rect x="10" y="8" width="4" height="2" fill="#450a0a" />
                    <rect x="9" y="16" width="2" height="2" fill="#7f1d1d" /> {/* Leg */}
                    <rect x="13" y="16" width="2" height="2" fill="#7f1d1d" /> {/* Leg */}
                    <rect x="6" y="6" width="4" height="4" fill="#450a0a" />
                    <rect x="4" y="8" width="2" height="1" fill="#450a0a" /> {/* Snout */}
                    <rect x="7" y="7" width="1" height="1" fill="#facc15" /> {/* Eye */}
                    <rect x="11" y="5" width="2" height="5" fill="#7f1d1d" />
                    <rect x="13" y="6" width="3" height="3" fill="#7f1d1d" />
                    <rect x="16" y="12" width="3" height="2" fill="#450a0a" />
                    <rect x="18" y="11" width="1" height="1" fill="#450a0a" />
                </svg>
            );
        case 'キマイラ':
            return (
                <svg {...svgProps}>
                    <rect x="6" y="10" width="10" height="6" fill="#b45309" /> {/* Body */}
                    <rect x="16" y="9" width="3" height="1" fill="#15803d" /> {/* Snake Tail */}
                    <rect x="18" y="8" width="1" height="1" fill="#15803d" />
                    <rect x="4" y="6" width="4" height="4" fill="#dc2626" /> {/* Red Head */}
                    <rect x="5" y="7" width="1" height="1" fill="#fff" />
                    <rect x="12" y="6" width="4" height="4" fill="#059669" /> {/* Green Head */}
                    <rect x="13" y="7" width="1" height="1" fill="#fff" />
                    <rect x="2" y="8" width="4" height="4" fill="#7f1d1d" /> {/* Wing */}
                    <rect x="7" y="16" width="3" height="2" fill="#a16207" />
                    <rect x="12" y="16" width="3" height="2" fill="#a16207" />
                </svg>
            );
        case 'ジェムスライム':
            return (
                <svg {...svgProps}>
                  <rect x="6" y="16" width="8" height="1" fill="#e879f9" /> {/* Shadow */}
                  <rect x="5" y="15" width="10" height="1" fill="#f472b6" />
                  <rect x="4" y="12" width="12" height="3" fill="#f472b6" />
                  <rect x="5" y="9" width="10" height="3" fill="#f472b6" />
                  <rect x="6" y="7" width="8" height="2" fill="#f472b6" />
                  <rect x="7" y="6" width="6" height="1" fill="#f472b6" />
                  <rect x="5" y="10" width="1" height="1" fill="#fda4af" /> {/* Highlight */}
                  <rect x="6" y="8" width="2" height="1" fill="#fda4af" /> {/* Highlight */}
                  <rect x="7" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="12" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  {/* Heart */}
                  <rect x="9" y="10" width="2" height="2" fill="#fff" />
                  <rect x="8" y="11" width="1" height="1" fill="#fff" />
                  <rect x="11" y="11" width="1" height="1" fill="#fff" />
                </svg>
            );
        case 'ゴールドスライム':
            return (
                <svg {...svgProps}>
                    {/* Crown */}
                    <rect x="7" y="3" width="6" height="3" fill="#facc15" />
                    <rect x="7" y="2" width="1" height="1" fill="#fde047" />
                    <rect x="9" y="2" width="2" height="1" fill="#fde047" />
                    <rect x="12" y="2" width="1" height="1" fill="#fde047" />
                    
                    {/* Body */}
                    <rect x="6" y="16" width="8" height="1" fill="#ca8a04" /> {/* Shadow */}
                    <rect x="5" y="15" width="10" height="1" fill="#f59e0b" />
                    <rect x="4" y="12" width="12" height="3" fill="#f59e0b" />
                    <rect x="5" y="9" width="10" height="3" fill="#f59e0b" />
                    <rect x="6" y="7" width="8" height="2" fill="#f59e0b" />
                    <rect x="7" y="6" width="6" height="1" fill="#f59e0b" />
                    
                    {/* Highlight */}
                    <rect x="5" y="10" width="1" height="1" fill="#fcd34d" /> 
                    <rect x="6" y="8" width="2" height="1" fill="#fcd34d" />
                    
                    {/* Eyes */}
                    <rect x="7" y="13" width="1" height="1" fill="#fff" /> 
                    <rect x="12" y="13" width="1" height="1" fill="#fff" />
                </svg>
            );
        case 'ヒーリングスライム':
            return (
                <svg {...svgProps}>
                  <rect x="6" y="16" width="8" height="1" fill="#a21caf" /> {/* Shadow */}
                  <rect x="5" y="15" width="10" height="1" fill="#d946ef" />
                  <rect x="4" y="12" width="12" height="3" fill="#d946ef" />
                  <rect x="5" y="9" width="10" height="3" fill="#d946ef" />
                  <rect x="6" y="7" width="8" height="2" fill="#d946ef" />
                  <rect x="7" y="6" width="6" height="1" fill="#d946ef" />
                  <rect x="5" y="10" width="1" height="1" fill="#f0abfc" /> {/* Highlight */}
                  <rect x="6" y="8" width="2" height="1" fill="#f0abfc" /> {/* Highlight */}
                  <rect x="7" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="12" y="13" width="1" height="1" fill="#fff" /> {/* Eye */}
                  <rect x="9" y="8" width="2" height="1" fill="#3b82f6" />
                  <rect x="8" y="9" width="4" height="1" fill="#60a5fa" />
                  <rect x="9" y="10" width="2" height="1" fill="#3b82f6" />
                </svg>
            );
        case 'ホーネット': return (<svg {...svgProps}> <rect x="8" y="8" width="4" height="5" fill="#facc15" /> <rect x="7" y="9" width="6" height="1" fill="#000" /> <rect x="7" y="11" width="6" height="1" fill="#000" /> <rect x="12" y="8" width="1" height="2" fill="#000" /> <rect x="9" y="9" width="1" height="1" fill="#ef4444" /> <rect x="4" y="6" width="4" height="3" fill="#e5e7eb" /> <rect x="12" y="6" width="4" height="3" fill="#e5e7eb" /> </svg>);
        case 'マッドパピー': return (<svg {...svgProps}> <rect x="6" y="10" width="8" height="5" fill="#a16207" /> <rect x="5" y="8" width="4" height="3" fill="#a16207" /> <rect x="4" y="9" width="1" height="1" fill="#a16207" /> <rect x="6" y="9" width="1" height="1" fill="#ef4444" /> <rect x="5" y="7" width="1" height="1" fill="#a16207" /> <rect x="7" y="7" width="1" height="1" fill="#a16207" /> <rect x="14" y="11" width="2" height="1" fill="#a16207" /> <rect x="7" y="15" width="2" height="2" fill="#a16207" /> <rect x="11" y="15" width="2" height="2" fill="#a16207" /> </svg>);
        case 'ジャイアントワーム': return (<svg {...svgProps}> <rect x="7" y="15" width="6" height="2" fill="#c2410c" /> <rect x="6" y="12" width="8" height="3" fill="#ea580c" /> <rect x="5" y="9" width="10" height="3" fill="#f97316" /> <rect x="6" y="6" width="8" height="3" fill="#fb923c" /> <rect x="8" y="7" width="1" height="1" fill="#000" /> <rect x="11" y="7" width="1" height="1" fill="#000" /> </svg>);
        case 'ワイルドボア': return (<svg {...svgProps}> <rect x="5" y="9" width="10" height="6" fill="#44403c" /> <rect x="4" y="8" width="4" height="3" fill="#44403c" /> <rect x="3" y="10" width="1" height="1" fill="#44403c" /> <rect x="5" y="9" width="1" height="1" fill="#ef4444" /> <rect x="4" y="7" width="1" height="1" fill="#44403c" /> <rect x="6" y="7" width="1" height="1" fill="#44403c" /> <rect x="3" y="11" width="1" height="2" fill="#fff" /> <rect x="6" y="15" width="2" height="2" fill="#44403c" /> <rect x="12" y="15" width="2" height="2" fill="#44403c" /> </svg>);
        case 'マンドラゴラ': return (<svg {...svgProps}> <rect x="7" y="10" width="6" height="6" fill="#b45309" /> <rect x="6" y="12" width="1" height="4" fill="#ca8a04" /> <rect x="13" y="12" width="1" height="4" fill="#ca8a04" /> <rect x="8" y="12" width="1" height="1" fill="#000" /> <rect x="11" y="12" width="1" height="1" fill="#000" /> <rect x="5" y="6" width="10" height="4" fill="#22c55e" /> <rect x="7" y="4" width="6" height="2" fill="#16a34a" /> </svg>);
        case 'キラービー': return (<svg {...svgProps}> <rect x="8" y="8" width="4" height="5" fill="#f59e0b" /> <rect x="7" y="9" width="6" height="1" fill="#000" /> <rect x="7" y="11" width="6" height="1" fill="#000" /> <rect x="12" y="8" width="2" height="2" fill="#ef4444" /> <rect x="9" y="9" width="1" height="1" fill="#ef4444" /> <rect x="3" y="6" width="5" height="3" fill="#f3f4f6" /> <rect x="12" y="6" width="5" height="3" fill="#f3f4f6" /> </svg>);
        case 'ファンガス': return (<svg {...svgProps}> <rect x="7" y="12" width="6" height="5" fill="#f3f4f6" /> <rect x="8" y="13" width="1" height="1" fill="#000" /> <rect x="11" y="13" width="1" height="1" fill="#000" /> <rect x="5" y="8" width="10" height="4" fill="#a855f7" /> <rect x="4" y="9" width="1" height="2" fill="#a855f7" /> <rect x="15" y="9" width="1" height="2" fill="#a855f7" /> <rect x="7" y="7" width="2" height="1" fill="#d8b4fe" /> <rect x="11" y="7" width="2" height="1" fill="#d8b4fe" /> </svg>);
        case 'ピクシー': return (<svg {...svgProps}> <rect x="8" y="7" width="4" height="8" fill="#fbcfe8" /> <rect x="9" y="8" width="1" height="1" fill="#000" /> <rect x="11" y="8" width="1" height="1" fill="#000" /> <rect x="7" y="7" width="1" height="3" fill="#fbcfe8" /> <rect x="12" y="7" width="1" height="3" fill="#fbcfe8" /> <rect x="4" y="5" width="4" height="5" fill="#93c5fd" /> <rect x="12" y="5" width="4" height="5" fill="#93c5fd" /> </svg>);
        case 'ゴースト': return (<svg {...svgProps}> <rect x="6" y="6" width="8" height="8" fill="#f9fafb" /> <rect x="5" y="8" width="1" height="4" fill="#f9fafb" /> <rect x="14" y="8" width="1" height="4" fill="#f9fafb" /> <rect x="7" y="14" width="2" height="2" fill="#f3f4f6" /> <rect x="11" y="14" width="2" height="2" fill="#f3f4f6" /> <rect x="8" y="9" width="1" height="1" fill="#000" /> <rect x="11" y="9" width="1" height="1" fill="#000" /> </svg>);
        case 'ダークエルフ': return (<svg {...svgProps}> <rect x="8" y="4" width="4" height="3" fill="#e0e7ff" /> <rect x="7" y="5" width="1" height="1" fill="#e0e7ff" /> <rect x="12" y="5" width="1" height="1" fill="#e0e7ff" /> <rect x="8" y="7" width="4" height="10" fill="#312e81" /> <rect x="6" y="8" width="2" height="4" fill="#a78bfa" /> <rect x="12" y="8" width="2" height="4" fill="#a78bfa" /> <rect x="9" y="5" width="1" height="1" fill="#ef4444" /> <rect x="11" y="5" width="1" height="1" fill="#ef4444" /> <rect x="2" y="6" width="3" height="8" fill="#78350f" /> </svg>);
        case 'ウィスプ': return (<svg {...svgProps}> <rect x="8" y="8" width="4" height="4" fill="#fff" /> <rect x="7" y="9" width="6" height="2" fill="#fff" /> <rect x="9" y="7" width="2" height="6" fill="#fff" /> <rect x="8" y="8" width="4" height="4" fill="#67e8f9" /> <rect x="7" y="9" width="6" height="2" fill="#a5f3fc" /> <rect x="9" y="7" width="2" height="6" fill="#a5f3fc" /> </svg>);
        case 'グール': return (<svg {...svgProps}> <rect x="7" y="6" width="6" height="10" fill="#57534e" /> <rect x="6" y="7" width="1" height="6" fill="#78716c" /> <rect x="13" y="7" width="1" height="6" fill="#78716c" /> <rect x="8" y="8" width="1" height="1" fill="#facc15" /> <rect x="11" y="8" width="1" height="1" fill="#facc15" /> <rect x="9" y="11" width="2" height="1" fill="#e2e8f0" /> <rect x="6" y="16" width="3" height="1" fill="#57534e" /> <rect x="11" y="16" width="3" height="1" fill="#57534e" /> </svg>);
        case 'ジャイアントスパイダー': return (<svg {...svgProps}> <rect x="7" y="7" width="6" height="6" fill="#1f2937" /> <rect x="9" y="5" width="2" height="2" fill="#111827" /> <rect x="8" y="7" width="1" height="1" fill="#ef4444" /> <rect x="11" y="7" width="1" height="1" fill="#ef4444" /> <rect x="9" y="8" width="2" height="2" fill="#ef4444" /> <rect x="2" y="5" width="5" height="2" fill="#374151" /> <rect x="13" y="5" width="5" height="2" fill="#374151" /> <rect x="1" y="8" width="6" height="2" fill="#374151" /> <rect x="13" y="8" width="6" height="2" fill="#374151" /> <rect x="1" y="11" width="6" height="2" fill="#374151" /> <rect x="13" y="11" width="6" height="2" fill="#374151" /> <rect x="2" y="14" width="5" height="2" fill="#374151" /> <rect x="13" y="14" width="5" height="2" fill="#374151" /> </svg>);
        case 'ウッドゴーレム': return (<svg {...svgProps}> <rect x="6" y="3" width="8" height="4" fill="#78350f" /> <rect x="8" y="5" width="1" height="1" fill="#16a34a" /> <rect x="11" y="5" width="1" height="1" fill="#16a34a" /> <rect x="4" y="7" width="12" height="7" fill="#a16207" /> <rect x="2" y="8" width="2" height="5" fill="#a16207" /> <rect x="16" y="8" width="2" height="5" fill="#a16207" /> <rect x="5" y="14" width="4" height="4" fill="#78350f" /> <rect x="11" y="14" width="4" height="4" fill="#78350f" /> </svg>);
        case 'コボルト': return (<svg {...svgProps}> <rect x="8" y="5" width="4" height="3" fill="#f87171" /> <rect x="7" y="7" width="6" height="6" fill="#991b1b" /> <rect x="6" y="8" width="1" height="3" fill="#f87171" /> <rect x="13" y="8" width="1" height="3" fill="#f87171" /> <rect x="7" y="13" width="2" height="4" fill="#f87171" /> <rect x="11" y="13" width="2" height="4" fill="#f87171" /> <rect x="9" y="6" width="1" height="1" fill="#fef08a" /> <rect x="11" y="6" width="1" height="1" fill="#fef08a" /> <rect x="2" y="8" width="2" height="6" fill="#a8a29e" /> <rect x="1" y="7" width="4" height="2" fill="#78716c" /> </svg>);
        case 'トロル': return (<svg {...svgProps}> <rect x="5" y="4" width="10" height="14" fill="#166534" /> <rect x="7" y="6" width="2" height="2" fill="#fef08a" /> <rect x="11" y="6" width="2" height="2" fill="#fef08a" /> <rect x="9" y="9" width="2" height="1" fill="#4ade80" /> <rect x="3" y="8" width="2" height="6" fill="#15803d" /> <rect x="15" y="8" width="2" height="6" fill="#15803d" /> <rect x="15" y="4" width="4" height="4" fill="#78350f" /> </svg>);
        case 'サンドワーム': return (<svg {...svgProps}> <rect x="7" y="15" width="6" height="2" fill="#f59e0b" /> <rect x="6" y="12" width="8" height="3" fill="#d97706" /> <rect x="5" y="9" width="10" height="3" fill="#b45309" /> <rect x="6" y="6" width="8" height="3" fill="#92400e" /> <rect x="8" y="7" width="1" height="1" fill="#000" /> <rect x="11" y="7" width="1" height="1" fill="#000" /> </svg>);
        case 'ジャイアントアント': return (<svg {...svgProps}> <rect x="10" y="8" width="6" height="6" fill="#1f2937" /> <rect x="6" y="9" width="4" height="4" fill="#374151" /> <rect x="4" y="10" width="2" height="2" fill="#111827" /> <rect x="5" y="9" width="1" height="1" fill="#fff" /> <rect x="2" y="7" width="4" height="1" fill="#374151" /> <rect x="16" y="7" width="2" height="1" fill="#374151" /> <rect x="2" y="10" width="4" height="1" fill="#374151" /> <rect x="16" y="10" width="2" height="1" fill="#374151" /> <rect x="2" y="13" width="4" height="1" fill="#374151" /> <rect x="16" y="13" width="2" height="1" fill="#374151" /> </svg>);
        case 'マインフレイヤー': return (<svg {...svgProps}> <rect x="6" y="4" width="8" height="5" fill="#5b21b6" /> <rect x="7" y="9" width="6" height="8" fill="#4c1d95" /> <rect x="5" y="10" width="1" height="4" fill="#5b21b6" /> <rect x="14" y="10" width="1" height="4" fill="#5b21b6" /> <rect x="7" y="6" width="1" height="1" fill="#fef08a" /> <rect x="12" y="6" width="1" height="1" fill="#fef08a" /> <rect x="7" y="9" width="1" height="2" fill="#a78bfa" /> <rect x="9" y="9" width="1" height="3" fill="#a78bfa" /> <rect x="11" y="9" width="1" height="2" fill="#a78bfa" /> </svg>);
        case 'アースエレメンタル': return (<svg {...svgProps}> <rect x="6" y="14" width="8" height="3" fill="#92400e" /> <rect x="5" y="10" width="10" height="4" fill="#a16207" /> <rect x="4" y="7" width="12" height="3" fill="#b45309" /> <rect x="6" y="4" width="8" height="3" fill="#ca8a04" /> <rect x="7" y="8" width="2" height="2" fill="#fef08a" /> <rect x="11" y="8" width="2" height="2" fill="#fef08a" /> </svg>);
        case 'サラマンダー': return (<svg {...svgProps}> <rect x="5" y="10" width="12" height="5" fill="#f97316" /> <rect x="4" y="8" width="4" height="3" fill="#ea580c" /> <rect x="5" y="9" width="1" height="1" fill="#fef08a" /> <rect x="3" y="12" width="2" height="3" fill="#f97316" /> <rect x="15" y="12" width="2" height="3" fill="#f97316" /> <rect x="17" y="9" width="2" height="3" fill="#f97316" /> <rect x="6" y="9" width="10" height="1" fill="#fdba74" /> </svg>);
        case 'イフリート': return (<svg {...svgProps}> <rect x="6" y="3" width="8" height="15" fill="#dc2626" /> <rect x="8" y="5" width="4" height="4" fill="#b91c1c" /> <rect x="9" y="6" width="1" height="1" fill="#fef08a" /> <rect x="11" y="6" width="1" height="1" fill="#fef08a" /> <rect x="4" y="7" width="2" height="6" fill="#ef4444" /> <rect x="14" y="7" width="2" height="6" fill="#ef4444" /> <rect x="7" y="18" width="6" height="2" fill="#f97316" /> </svg>);
        case 'ヘルハウンド': return (<svg {...svgProps}> <rect x="12" y="15" width="2" height="2" fill="#1f2937" /> <rect x="5" y="15" width="2" height="2" fill="#1f2937" /> <rect x="4" y="9" width="10" height="6" fill="#374151" /> <rect x="3" y="8" width="3" height="3" fill="#374151" /> <rect x="2" y="10" width="2" height="1" fill="#1f2937" /> <rect x="3" y="9" width="1" height="1" fill="#ef4444" /> <rect x="14" y="8" width="2" height="3" fill="#dc2626" /> <rect x="4" y="7" width="1" height="1" fill="#1f2937" /> <rect x="6" y="7" width="1" height="1" fill="#1f2937" /> </svg>);
        case 'ボム': return (<svg {...svgProps}> <rect x="6" y="6" width="8" height="8" fill="#1f2937" /> <rect x="5" y="7" width="10" height="6" fill="#1f2937" /> <rect x="7" y="5" width="6" height="10" fill="#1f2937" /> <rect x="9" y="9" width="2" height="2" fill="#fef08a" /> <rect x="11" y="3" width="1" height="2" fill="#f97316" /> <rect x="10" y="2" width="1" height="1" fill="#fef08a" /> <rect x="8" y="8" width="1" height="1" fill="#fff" /> <rect x="12" y="8" width="1" height="1" fill="#fff" /> </svg>);
        case 'フレイムドラゴン': return (<svg {...svgProps}> <rect x="8" y="10" width="8" height="6" fill="#b91c1c" /> <rect x="10" y="8" width="4" height="2" fill="#b91c1c" /> <rect x="9" y="16" width="2" height="2" fill="#dc2626" /> <rect x="13" y="16" width="2" height="2" fill="#dc2626" /> <rect x="6" y="6" width="4" height="4" fill="#b91c1c" /> <rect x="4" y="8" width="2" height="1" fill="#b91c1c" /> <rect x="7" y="7" width="1" height="1" fill="#facc15" /> <rect x="11" y="5" width="2" height="5" fill="#f97316" /> <rect x="13" y="6" width="3" height="3" fill="#f97316" /> <rect x="16" y="12" width="3" height="2" fill="#b91c1c" /> <rect x="18" y="11" width="1" height="1" fill="#b91c1c" /> </svg>);
        case 'マグマスライム': return (<svg {...svgProps}> <rect x="6" y="16" width="8" height="1" fill="#991b1b" /> <rect x="5" y="15" width="10" height="1" fill="#dc2626" /> <rect x="4" y="12" width="12" height="3" fill="#dc2626" /> <rect x="5" y="9" width="10" height="3" fill="#dc2626" /> <rect x="6" y="7" width="8" height="2" fill="#dc2626" /> <rect x="7" y="6" width="6" height="1" fill="#dc2626" /> <rect x="5" y="10" width="1" height="1" fill="#f87171" /> <rect x="6" y="8" width="2" height="1" fill="#f87171" /> <rect x="7" y="13" width="1" height="1" fill="#fef08a" /> <rect x="12" y="13" width="1" height="1" fill="#fef08a" /> </svg>);
        case 'パイロデーモン': return (<svg {...svgProps}> <rect x="7" y="5" width="6" height="10" fill="#881337" /> <rect x="8" y="7" width="1" height="1" fill="#fef08a" /> <rect x="11" y="7" width="1" height="1" fill="#fef08a" /> <rect x="5" y="4" width="2" height="2" fill="#881337" /> <rect x="13" y="4" width="2" height="2" fill="#881337" /> <rect x="2" y="5" width="5" height="4" fill="#450a0a" /> <rect x="13" y="5" width="5" height="4" fill="#450a0a" /> <rect x="6" y="15" width="3" height="3" fill="#881337" /> <rect x="11" y="15" width="3" height="3" fill="#881337" /> </svg>);
        case 'デュラハン': return (<svg {...svgProps}> <rect x="6" y="8" width="8" height="10" fill="#1e293b" /> <rect x="5" y="7" width="10" height="2" fill="#334155" /> <rect x="7" y="6" width="6" height="2" fill="#475569" /> <rect x="8" y="18" width="2" height="2" fill="#1e293b" /> <rect x="12" y="18" width="2" height="2" fill="#1e293b" /> <rect x="2" y="9" width="3" height="3" fill="#1e293b" /> <rect x="3" y="10" width="1" height="1" fill="#ef4444" /> <rect x="15" y="6" width="1" height="12" fill="#94a3b8" /> </svg>);
        case 'アイアンゴーレム': return (<svg {...svgProps}> <rect x="6" y="3" width="8" height="4" fill="#64748b" /> <rect x="8" y="5" width="1" height="1" fill="#ef4444" /> <rect x="11" y="5" width="1" height="1" fill="#ef4444" /> <rect x="4" y="7" width="12" height="7" fill="#475569" /> <rect x="2" y="8" width="2" height="5" fill="#475569" /> <rect x="16" y="8" width="2" height="5" fill="#475569" /> <rect x="5" y="14" width="4" height="4" fill="#64748b" /> <rect x="11" y="14" width="4" height="4" fill="#64748b" /> </svg>);
        case 'オーガ': return (<svg {...svgProps}> <rect x="5" y="4" width="10" height="6" fill="#064e3b" /> <rect x="6" y="10" width="8" height="8" fill="#047857" /> <rect x="7" y="6" width="1" height="1" fill="#facc15" /> <rect x="12" y="6" width="1" height="1" fill="#facc15" /> <rect x="6" y="10" width="1" height="2" fill="#fff" /> <rect x="13" y="10" width="1" height="2" fill="#fff" /> <rect x="4" y="10" width="2" height="5" fill="#065f46" /> <rect x="14" y="10" width="2" height="5" fill="#065f46" /> </svg>);
        case 'ダークナイト': return (<svg {...svgProps}> <rect x="7" y="4" width="6" height="4" fill="#111827" /> <rect x="6" y="8" width="8" height="8" fill="#1f2937" /> <rect x="9" y="5" width="2" height="1" fill="#ef4444" /> <rect x="5" y="8" width="1" height="6" fill="#111827" /> <rect x="14" y="8" width="1" height="6" fill="#111827" /> <rect x="7" y="16" width="2" height="3" fill="#111827" /> <rect x="11" y="16" width="2" height="3" fill="#111827" /> <rect x="15" y="5" width="2" height="12" fill="#581c87" /> </svg>);
        case 'ワイバーン': return (<svg {...svgProps}> <rect x="8" y="9" width="7" height="6" fill="#065f46" /> <rect x="6" y="7" width="4" height="4" fill="#047857" /> <rect x="7" y="8" width="1" height="1" fill="#facc15" /> <rect x="4" y="9" width="2" height="1" fill="#065f46" /> <rect x="2" y="4" width="6" height="5" fill="#10b981" /> <rect x="15" y="11" width="4" height="2" fill="#065f46" /> <rect x="9" y="15" width="2" height="3" fill="#065f46" /> <rect x="12" y="15" width="2" height="3" fill="#065f46" /> </svg>);
        case 'アークデーモン': return (<svg {...svgProps}> <rect x="6" y="4" width="8" height="12" fill="#7f1d1d" /> <rect x="4" y="3" width="2" height="2" fill="#450a0a" /> <rect x="14" y="3" width="2" height="2" fill="#450a0a" /> <rect x="7" y="6" width="2" height="2" fill="#facc15" /> <rect x="11" y="6" width="2" height="2" fill="#facc15" /> <rect x="2" y="6" width="4" height="6" fill="#450a0a" /> <rect x="14" y="6" width="4" height="6" fill="#450a0a" /> <rect x="7" y="16" width="2" height="3" fill="#7f1d1d" /> <rect x="11" y="16" width="2" height="3" fill="#7f1d1d" /> </svg>);
        case 'セラフィム': return (<svg {...svgProps}> <rect x="8" y="5" width="4" height="10" fill="#fef9c3" /> <rect x="9" y="6" width="1" height="1" fill="#000" /> <rect x="11" y="6" width="1" height="1" fill="#000" /> <rect x="2" y="3" width="6" height="4" fill="#fff" /> <rect x="12" y="3" width="6" height="4" fill="#fff" /> <rect x="1" y="8" width="7" height="4" fill="#fff" /> <rect x="12" y="8" width="7" height="4" fill="#fff" /> <rect x="2" y="13" width="6" height="4" fill="#fff" /> <rect x="12" y="13" width="6" height="4" fill="#fff" /> </svg>);
        case 'マスターウィザード': return (<svg {...svgProps}> <rect x="7" y="2" width="6" height="2" fill="#1e3a8a" /> <rect x="5" y="4" width="10" height="2" fill="#1e3a8a" /> <rect x="7" y="6" width="6" height="3" fill="#f0c8a0" /> <rect x="8" y="7" width="1" height="1" fill="#fef08a" /> <rect x="11" y="7" width="1" height="1" fill="#fef08a" /> <rect x="6" y="9" width="8" height="8" fill="#1e40af" /> <rect x="1" y="6" width="2" height="8" fill="#7c3aed" /> <rect x="0" y="5" width="4" height="1" fill="#a78bfa" /> </svg>);
        case 'キングゴースト': return (<svg {...svgProps}> <rect x="6" y="8" width="8" height="8" fill="#e2e8f0" /> <rect x="5" y="10" width="1" height="4" fill="#e2e8f0" /> <rect x="14" y="10" width="1" height="4" fill="#e2e8f0" /> <rect x="8" y="11" width="1" height="1" fill="#000" /> <rect x="11" y="11" width="1" height="1" fill="#000" /> <rect x="6" y="5" width="8" height="3" fill="#facc15" /> <rect x="6" y="4" width="1" height="1" fill="#facc15" /> <rect x="13" y="4" width="1" height="1" fill="#facc15" /> <rect x="9" y="4" width="2" height="1" fill="#facc15" /> </svg>);
        case 'エンシェントドラゴン': return (<svg {...svgProps}> <rect x="7" y="9" width="10" height="8" fill="#1e1b4b" /> <rect x="9" y="7" width="5" height="2" fill="#312e81" /> <rect x="8" y="17" width="3" height="2" fill="#312e81" /> <rect x="13" y="17" width="3" height="2" fill="#312e81" /> <rect x="4" y="5" width="5" height="5" fill="#1e1b4b" /> <rect x="2" y="7" width="2" height="2" fill="#1e1b4b" /> <rect x="5" y="6" width="1" height="1" fill="#fde047" /> <rect x="11" y="3" width="3" height="6" fill="#4338ca" /> <rect x="14" y="4" width="4" height="4" fill="#4338ca" /> <rect x="17" y="12" width="3" height="3" fill="#1e1b4b" /> </svg>);

        // ボス
        case 'ゴブリンキング':
            return (
                <svg {...svgProps}>
                    {/* 王冠 */}
                    <rect x="6" y="2" width="8" height="1" fill="#facc15" />
                    <rect x="7" y="1" width="1" height="1" fill="#facc15" />
                    <rect x="9" y="1" width="2" height="1" fill="#facc15" />
                    <rect x="12" y="1" width="1" height="1" fill="#facc15" />
                    {/* 頭部 - より大きく */}
                    <rect x="7" y="3" width="6" height="5" fill="#15803d" />
                    <rect x="6" y="4" width="1" height="2" fill="#15803d" />
                    <rect x="13" y="4" width="1" height="2" fill="#15803d" />
                    {/* 目 */}
                    <rect x="8" y="5" width="1" height="1" fill="#dc2626" />
                    <rect x="11" y="5" width="1" height="1" fill="#dc2626" />
                    {/* 体 */}
                    <rect x="6" y="8" width="8" height="7" fill="#a16207" />
                    {/* 腕 */}
                    <rect x="5" y="9" width="1" height="4" fill="#15803d" />
                    <rect x="14" y="9" width="1" height="4" fill="#15803d" />
                    <rect x="4" y="11" width="1" height="2" fill="#15803d" />
                    <rect x="15" y="11" width="1" height="2" fill="#15803d" />
                    {/* 脚 */}
                    <rect x="7" y="15" width="2" height="4" fill="#15803d" />
                    <rect x="11" y="15" width="2" height="4" fill="#15803d" />
                    <rect x="7" y="19" width="2" height="1" fill="#422006" />
                    <rect x="11" y="19" width="2" height="1" fill="#422006" />
                </svg>
            );
        case 'フォレストタイラント':
            return (
                <svg {...svgProps}>
                    {/* 幹 */}
                    <rect x="7" y="10" width="6" height="10" fill="#422006" />
                    {/* 葉 - 大きく広がる */}
                    <rect x="4" y="5" width="12" height="6" fill="#166534" />
                    <rect x="3" y="6" width="14" height="4" fill="#15803d" />
                    <rect x="2" y="7" width="16" height="2" fill="#16a34a" />
                    {/* 目 */}
                    <rect x="8" y="13" width="1" height="1" fill="#dc2626" />
                    <rect x="11" y="13" width="1" height="1" fill="#dc2626" />
                    {/* 枝（腕） */}
                    <rect x="4" y="9" width="3" height="1" fill="#422006" />
                    <rect x="13" y="9" width="3" height="1" fill="#422006" />
                    <rect x="3" y="8" width="1" height="1" fill="#166534" />
                    <rect x="16" y="8" width="1" height="1" fill="#166534" />
                </svg>
            );
        case 'ストーンコロッサス':
            return (
                <svg {...svgProps}>
                    {/* 頭部 */}
                    <rect x="7" y="3" width="6" height="4" fill="#78716c" />
                    <rect x="8" y="5" width="1" height="1" fill="#ef4444" />
                    <rect x="11" y="5" width="1" height="1" fill="#ef4444" />
                    {/* 体 - 巨大 */}
                    <rect x="5" y="7" width="10" height="8" fill="#57534e" />
                    <rect x="6" y="8" width="8" height="6" fill="#44403c" />
                    {/* 肩 */}
                    <rect x="3" y="8" width="2" height="3" fill="#78716c" />
                    <rect x="15" y="8" width="2" height="3" fill="#78716c" />
                    {/* 腕 */}
                    <rect x="2" y="9" width="1" height="6" fill="#57534e" />
                    <rect x="17" y="9" width="1" height="6" fill="#57534e" />
                    {/* 脚 */}
                    <rect x="6" y="15" width="3" height="5" fill="#57534e" />
                    <rect x="11" y="15" width="3" height="5" fill="#57534e" />
                </svg>
            );
        case 'ボルケーノロード':
            return (
                <svg {...svgProps}>
                    {/* 角 */}
                    <rect x="5" y="2" width="2" height="3" fill="#450a0a" />
                    <rect x="13" y="2" width="2" height="3" fill="#450a0a" />
                    {/* 頭 */}
                    <rect x="7" y="4" width="6" height="4" fill="#7f1d1d" />
                    <rect x="8" y="6" width="1" height="1" fill="#fde047" />
                    <rect x="11" y="6" width="1" height="1" fill="#fde047" />
                    {/* 体 */}
                    <rect x="6" y="8" width="8" height="8" fill="#991b1b" />
                    {/* 炎のエフェクト */}
                    <rect x="5" y="9" width="1" height="1" fill="#fb923c" />
                    <rect x="14" y="9" width="1" height="1" fill="#fb923c" />
                    <rect x="4" y="11" width="1" height="1" fill="#fb923c" />
                    <rect x="15" y="11" width="1" height="1" fill="#fb923c" />
                    {/* 翼 */}
                    <rect x="2" y="8" width="4" height="5" fill="#450a0a" />
                    <rect x="14" y="8" width="4" height="5" fill="#450a0a" />
                    {/* 脚 */}
                    <rect x="7" y="16" width="2" height="4" fill="#7f1d1d" />
                    <rect x="11" y="16" width="2" height="4" fill="#7f1d1d" />
                </svg>
            );
        case 'ナイトメアキング':
            return (
                <svg {...svgProps}>
                    {/* 兜 */}
                    <rect x="7" y="3" width="6" height="4" fill="#0f172a" />
                    <rect x="6" y="4" width="8" height="2" fill="#1e293b" />
                    {/* 目の光 */}
                    <rect x="8" y="5" width="1" height="1" fill="#dc2626" />
                    <rect x="11" y="5" width="1" height="1" fill="#dc2626" />
                    {/* 鎧 */}
                    <rect x="6" y="7" width="8" height="9" fill="#1e293b" />
                    <rect x="7" y="8" width="6" height="7" fill="#334155" />
                    {/* 肩当て */}
                    <rect x="4" y="7" width="2" height="3" fill="#0f172a" />
                    <rect x="14" y="7" width="2" height="3" fill="#0f172a" />
                    {/* 剣 */}
                    <rect x="15" y="5" width="1" height="10" fill="#64748b" />
                    <rect x="14" y="4" width="3" height="1" fill="#94a3b8" />
                    {/* 脚 */}
                    <rect x="7" y="16" width="2" height="4" fill="#0f172a" />
                    <rect x="11" y="16" width="2" height="4" fill="#0f172a" />
                </svg>
            );
        case 'カオスエンペラー':
            return (
                <svg {...svgProps}>
                    {/* 王冠 */}
                    <rect x="6" y="1" width="8" height="2" fill="#7c3aed" />
                    <rect x="7" y="0" width="1" height="1" fill="#a78bfa" />
                    <rect x="9" y="0" width="2" height="1" fill="#a78bfa" />
                    <rect x="12" y="0" width="1" height="1" fill="#a78bfa" />
                    {/* 頭 */}
                    <rect x="7" y="3" width="6" height="4" fill="#581c87" />
                    <rect x="8" y="5" width="1" height="1" fill="#a855f7" />
                    <rect x="11" y="5" width="1" height="1" fill="#a855f7" />
                    {/* マント */}
                    <rect x="4" y="7" width="12" height="10" fill="#4c1d95" />
                    <rect x="3" y="8" width="14" height="8" fill="#5b21b6" />
                    {/* 体 */}
                    <rect x="7" y="7" width="6" height="9" fill="#6b21a8" />
                    {/* オーラ */}
                    <rect x="2" y="6" width="1" height="1" fill="#c084fc" />
                    <rect x="17" y="6" width="1" height="1" fill="#c084fc" />
                    <rect x="1" y="10" width="1" height="1" fill="#c084fc" />
                    <rect x="18" y="10" width="1" height="1" fill="#c084fc" />
                    {/* 脚 */}
                    <rect x="7" y="16" width="2" height="4" fill="#581c87" />
                    <rect x="11" y="16" width="2" height="4" fill="#581c87" />
                </svg>
            );

        default:
            return <div className="w-full h-full bg-pink-500 rounded-lg" />;
     }
}

export default EnemySprite;