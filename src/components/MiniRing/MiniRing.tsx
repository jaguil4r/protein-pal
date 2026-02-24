import './MiniRing.css';

interface Props {
  current: number;
  goal: number;
  label: string;
  unit?: string;
  color: 'carbs' | 'calories' | 'fiber' | 'water';
}

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function MiniRing({ current, goal, label, unit = 'g', color }: Props) {
  const percent = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const dashOffset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className={`mini-ring mini-ring--${color}`} data-testid={`mini-ring-${color}`}>
      <svg className="mini-ring__svg" viewBox="0 0 56 56">
        <circle
          className="mini-ring__track"
          cx="28"
          cy="28"
          r={RADIUS}
        />
        <circle
          className={`mini-ring__arc mini-ring__arc--${color}`}
          cx="28"
          cy="28"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="mini-ring__center">
        <span className="mini-ring__value">{current}{unit === 'cal' ? '' : unit}</span>
      </div>
      <span className="mini-ring__label">{label}</span>
    </div>
  );
}
