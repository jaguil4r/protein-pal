import { useState } from 'react';
import { useHistory, TimeRange } from '../../hooks/useHistory';
import './HistoryView.css';

const ranges: { value: TimeRange; label: string }[] = [
  { value: '2w', label: '2 Weeks' },
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
];

export function HistoryView() {
  const [range, setRange] = useState<TimeRange>('2w');
  const { days, avgProtein, goalHitRate, bestStreak } = useHistory(range);

  const maxProtein = Math.max(...days.map((d) => d.protein), ...days.map((d) => d.goal));

  return (
    <div className="history" data-testid="history-view">
      <div className="history__ranges">
        {ranges.map((r) => (
          <button
            key={r.value}
            className={`history__range-btn ${range === r.value ? 'history__range-btn--active' : ''}`}
            onClick={() => setRange(r.value)}
            data-testid={`history-range-${r.value}`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="history__chart" data-testid="history-chart">
        {days.map((day) => {
          const heightPercent = maxProtein > 0 ? (day.protein / maxProtein) * 100 : 0;
          const goalLine = maxProtein > 0 ? (day.goal / maxProtein) * 100 : 0;
          let barClass = 'history__bar';
          if (day.hitGoal) barClass += ' history__bar--hit';
          else if (day.protein > 0) barClass += ' history__bar--partial';
          if (day.isCheatDay) barClass += ' history__bar--cheat';

          return (
            <div key={day.date} className="history__bar-col" title={`${day.date}: ${day.protein}g / ${day.goal}g`}>
              <div className="history__bar-track">
                <div
                  className="history__goal-line"
                  style={{ bottom: `${goalLine}%` }}
                />
                <div
                  className={barClass}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="history__stats">
        <div className="history__stat">
          <span className="history__stat-value" data-testid="history-avg">{avgProtein}g</span>
          <span className="history__stat-label">Avg Protein</span>
        </div>
        <div className="history__stat">
          <span className="history__stat-value" data-testid="history-hit-rate">{goalHitRate}%</span>
          <span className="history__stat-label">Goal Hit Rate</span>
        </div>
        <div className="history__stat">
          <span className="history__stat-value" data-testid="history-best-streak">{bestStreak}d</span>
          <span className="history__stat-label">Best Streak</span>
        </div>
      </div>
    </div>
  );
}
