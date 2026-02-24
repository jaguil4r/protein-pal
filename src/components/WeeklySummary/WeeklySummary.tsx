import { UserSettings } from '../../types';
import { useWeeklySummary } from '../../hooks/useWeeklySummary';
import './WeeklySummary.css';

interface Props {
  settings: UserSettings;
  totalProtein?: number;
  isCheatDay?: boolean;
  show: boolean;
  onToggle: () => void;
}

export function WeeklySummary({ settings, totalProtein, isCheatDay, show, onToggle }: Props) {
  const data = useWeeklySummary(settings, totalProtein, isCheatDay);

  // Find the max protein value for bar scaling
  const maxProtein = Math.max(
    ...data.dailyBreakdown.map((d) => Math.max(d.protein, d.goal)),
    1
  );

  return (
    <div className="weekly-summary" data-testid="weekly-summary">
      <button
        className="weekly-summary__header weekly-summary__header--toggle"
        onClick={onToggle}
        data-testid="weekly-summary-toggle"
        aria-label={show ? 'Collapse weekly summary' : 'Expand weekly summary'}
      >
        <span className="weekly-summary__title">
          Weekly Summary
          <span className={`weekly-summary__chevron${show ? ' weekly-summary__chevron--open' : ''}`}>▾</span>
        </span>
        <span className="weekly-summary__range" data-testid="weekly-range">
          {data.weekStartLabel} – {data.weekEndLabel}
        </span>
      </button>

      {show && (
        <>
          {/* Bar chart */}
          <div className="weekly-summary__chart" data-testid="weekly-chart">
            {data.dailyBreakdown.map((day) => {
              const barHeight = day.isFuture ? 0 : Math.max(4, (day.protein / maxProtein) * 100);
              const goalLine = (day.goal / maxProtein) * 100;
              return (
                <div
                  key={day.dateKey}
                  className={`weekly-summary__day${day.isToday ? ' weekly-summary__day--today' : ''}${day.isFuture ? ' weekly-summary__day--future' : ''}`}
                >
                  <div className="weekly-summary__bar-container">
                    <div
                      className="weekly-summary__goal-line"
                      style={{ bottom: `${goalLine}%` }}
                    />
                    <div
                      className={`weekly-summary__bar${day.hitGoal && !day.isFuture ? ' weekly-summary__bar--hit' : ''}${day.isCheatDay ? ' weekly-summary__bar--cheat' : ''}`}
                      style={{ height: `${barHeight}%` }}
                      data-testid={`weekly-bar-${day.dayLabel.toLowerCase()}`}
                    />
                  </div>
                  <span className="weekly-summary__day-label">{day.dayLabel}</span>
                  <span className="weekly-summary__day-icon">
                    {day.isFuture ? '' : day.isCheatDay ? '😎' : day.isWorkoutDay ? (day.hitGoal ? '💪' : '🏋️') : (day.hitGoal ? '✓' : day.hasEntries ? '✗' : '–')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats grid */}
          <div className="weekly-summary__stats" data-testid="weekly-stats">
            <div className="weekly-summary__stat">
              <span className="weekly-summary__stat-label">Protein Goals</span>
              <span className="weekly-summary__stat-value" data-testid="weekly-protein-days">
                {data.proteinDaysHit}/{data.totalDaysElapsed} days
              </span>
            </div>
            {data.scheduledWorkoutDays > 0 && (
              <div className="weekly-summary__stat">
                <span className="weekly-summary__stat-label">Workout Days</span>
                <span className="weekly-summary__stat-value" data-testid="weekly-workout-days">
                  {data.workoutDaysCompleted}/{data.scheduledWorkoutDays} completed
                </span>
              </div>
            )}
            <div className="weekly-summary__stat">
              <span className="weekly-summary__stat-label">Avg Protein</span>
              <span className="weekly-summary__stat-value" data-testid="weekly-avg-protein">
                {data.avgProteinPerDay}g / day
              </span>
            </div>
            {data.bestDay && (
              <div className="weekly-summary__stat">
                <span className="weekly-summary__stat-label">Best Day</span>
                <span className="weekly-summary__stat-value" data-testid="weekly-best-day">
                  {data.bestDay.label} — {data.bestDay.protein}g
                </span>
              </div>
            )}
            {data.worstDay && data.totalDaysElapsed > 1 && (
              <div className="weekly-summary__stat">
                <span className="weekly-summary__stat-label">Worst Day</span>
                <span className="weekly-summary__stat-value" data-testid="weekly-worst-day">
                  {data.worstDay.label} — {data.worstDay.protein}g
                </span>
              </div>
            )}
            <div className="weekly-summary__stat">
              <span className="weekly-summary__stat-label">Cheat Days</span>
              <span className="weekly-summary__stat-value" data-testid="weekly-cheat-days">
                {data.cheatDaysUsed}/{settings.cheatDaysPerWeek} used
              </span>
            </div>
          </div>

          {/* Focus tip */}
          <div className="weekly-summary__tip" data-testid="weekly-tip">
            <span className="weekly-summary__tip-icon">💡</span>
            <span className="weekly-summary__tip-text">{data.focusTip}</span>
          </div>
        </>
      )}
    </div>
  );
}
