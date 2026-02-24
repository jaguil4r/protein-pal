import { StreakTier } from '../../types';
import './StreakBadge.css';

interface Props {
  currentStreak: number;
  tier: StreakTier;
  isNewTier: boolean;
}

const tierLabels: Record<StreakTier, string> = {
  none: '',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  queen: 'Protein Queen',
};

const tierNextMilestone: Record<StreakTier, string> = {
  none: '3 days for Bronze',
  bronze: '7 days for Silver',
  silver: '14 days for Gold',
  gold: '30 days for Protein Queen',
  queen: 'Max tier!',
};

export function StreakBadge({ currentStreak, tier, isNewTier }: Props) {
  if (currentStreak === 0) return null;

  const emoji = tier === 'queen' ? '👑' : '🔥';

  return (
    <div
      className={`streak-badge streak-badge--${tier}${isNewTier ? ' streak-badge--new' : ''}`}
      data-testid="streak-badge"
      title={tier !== 'none' ? `${tierLabels[tier]} tier — Next: ${tierNextMilestone[tier]}` : tierNextMilestone.none}
      aria-label={`${currentStreak} day streak${tier !== 'none' ? `, ${tierLabels[tier]} tier` : ''}`}
    >
      <span className="streak-badge__emoji">{emoji}</span>
      <span className="streak-badge__count" data-testid="streak-count">{currentStreak}</span>
      <span className="streak-badge__label">day streak</span>
      {tier !== 'none' && (
        <span className="streak-badge__tier">{tierLabels[tier]}</span>
      )}
    </div>
  );
}
