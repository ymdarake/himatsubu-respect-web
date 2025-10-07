interface BossEncounterProps {
  bossName: string;
  onAnimationEnd: () => void;
}

export default function BossEncounter({ bossName, onAnimationEnd }: BossEncounterProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      onAnimationEnd={onAnimationEnd}
    >
      <div className="text-center space-y-4 animate-boss-name">
        <div className="text-6xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] tracking-wider">
          {bossName}
        </div>
      </div>
    </div>
  );
}
