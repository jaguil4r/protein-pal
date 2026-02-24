import './ProgressBar.css';

interface Props {
  current: number;
  goal: number;
  percent: number;
}

function getFillClass(percent: number): string {
  if (percent >= 100) return 'progress-bar__fill--complete';
  if (percent >= 70) return 'progress-bar__fill--high';
  if (percent >= 30) return 'progress-bar__fill--mid';
  return 'progress-bar__fill--low';
}

export function ProgressBar({ current, goal, percent }: Props) {
  return (
    <div className="progress-bar" data-testid="progress-bar">
      <div className="progress-bar__track">
        <div
          className={`progress-bar__fill ${getFillClass(percent)}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
          data-testid="progress-fill"
        />
      </div>
      <span className="progress-bar__text" data-testid="progress-text">
        {current}g / {goal}g ({percent}%)
      </span>
    </div>
  );
}
