import './CheatDayToggle.css';

interface Props {
  isCheatDay: boolean;
  onToggle: () => void;
  remainingCheatDays: number;
  disabled?: boolean;
}

export function CheatDayToggle({ isCheatDay, onToggle, remainingCheatDays, disabled }: Props) {
  const canToggleOn = !isCheatDay && remainingCheatDays > 0;
  const isDisabled = disabled || (!isCheatDay && remainingCheatDays <= 0);

  return (
    <button
      className={`cheat-day-toggle${isCheatDay ? ' cheat-day-toggle--active' : ''}${isDisabled ? ' cheat-day-toggle--disabled' : ''}`}
      onClick={onToggle}
      disabled={isDisabled}
      data-testid="cheat-day-toggle"
      role="switch"
      aria-checked={isCheatDay}
      title={
        isCheatDay
          ? 'Cheat day is ON — streak preserved, no mood penalty'
          : canToggleOn
            ? `Use a cheat day (${remainingCheatDays} left this week)`
            : 'No cheat days remaining this week'
      }
    >
      <span className="cheat-day-toggle__emoji">{isCheatDay ? '🎉' : '😎'}</span>
      <span className="cheat-day-toggle__label">
        {isCheatDay ? 'Cheat Day ON' : 'Cheat Day'}
      </span>
      <span className="cheat-day-toggle__remaining" data-testid="cheat-days-remaining">
        {isCheatDay ? 'Relax!' : `${remainingCheatDays} left`}
      </span>
    </button>
  );
}
