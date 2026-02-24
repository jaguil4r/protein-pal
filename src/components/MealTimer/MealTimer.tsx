import './MealTimer.css';

interface Props {
  minutesUntilNext: number | null;
  isOverdue: boolean;
}

export function MealTimer({ minutesUntilNext, isOverdue }: Props) {
  let text: string;
  let dotClass = 'meal-timer__dot--ok';

  if (minutesUntilNext === null) {
    text = 'No meals logged yet — time to eat!';
  } else if (isOverdue) {
    text = "You're overdue for a meal!";
    dotClass = 'meal-timer__dot--overdue';
  } else {
    const hours = Math.floor(minutesUntilNext / 60);
    const mins = minutesUntilNext % 60;
    if (hours > 0) {
      text = `Next meal in ${hours}h ${mins}m`;
    } else {
      text = `Next meal in ${mins}m`;
    }
  }

  return (
    <div className="meal-timer" data-testid="meal-timer" role="timer" aria-live="polite" aria-label={text}>
      <span className="meal-timer__text" data-testid="meal-timer-text">
        <span className={`meal-timer__dot ${dotClass}`} />
        {text}
      </span>
    </div>
  );
}
