import { getXpThresholds } from '../../utils/storage';
import './XpBadge.css';

interface Props {
  level: number;
  totalXp: number;
  isLevelUp: boolean;
}

const levelLabels: Record<number, string> = {
  1: 'Starter',
  2: 'Bow Tie',
  3: 'Crowned',
  4: 'Equipped',
  5: 'Legend',
};

export function XpBadge({ level, totalXp, isLevelUp }: Props) {
  const thresholds = getXpThresholds();
  const isMaxLevel = level >= thresholds.length;
  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = isMaxLevel ? currentThreshold : thresholds[level] || currentThreshold;
  const progress = isMaxLevel
    ? 100
    : nextThreshold > currentThreshold
      ? Math.min(100, ((totalXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
      : 100;

  return (
    <div
      className={`xp-badge xp-badge--level-${level}${isLevelUp ? ' xp-badge--level-up' : ''}`}
      data-testid="xp-badge"
      data-level={level}
      role="status"
      aria-label={`Level ${level}, ${totalXp} XP${isMaxLevel ? ', max level' : ''}`}
      title={isMaxLevel ? 'Max level reached!' : `${nextThreshold - totalXp} XP to Level ${level + 1}`}
    >
      <span className="xp-badge__star">&#11088;</span>
      <span className="xp-badge__level" data-testid="xp-level">Lv.{level}</span>
      <span className="xp-badge__separator">&bull;</span>
      <span className="xp-badge__xp" data-testid="xp-total">{totalXp} XP</span>
      {level >= 2 && (
        <span className="xp-badge__label">{levelLabels[level]}</span>
      )}
      <div className="xp-badge__progress-track">
        <div
          className="xp-badge__progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isMaxLevel && (
        <span className="xp-badge__max">MAX</span>
      )}
    </div>
  );
}
