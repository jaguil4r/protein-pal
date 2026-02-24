import { useState, useMemo } from 'react';
import './EatingWindow.css';

interface Props {
  windowStart: number | null;
  windowEnd: number | null;
  mealTimestamps: number[];
  nextMealSuggestion: string | null;
  totalProtein: number;
  dailyGoal: number;
  hoursRemaining: number;
  onWindowStartChange?: (minutesSinceMidnight: number) => void;
  onWindowEndChange?: (minutesSinceMidnight: number) => void;
}

interface MealScheduleSlot {
  label: string;
  shortLabel: string;
  time: string;
  position: number; // 0–100%
}

const MEAL_SCHEDULE = [
  { label: 'Breakfast', shortLabel: 'Bkfst' },
  { label: 'Snack', shortLabel: 'Snack' },
  { label: 'Lunch', shortLabel: 'Lunch' },
  { label: 'Snack', shortLabel: 'Snack' },
  { label: 'Dinner', shortLabel: 'Dinner' },
  { label: 'Snack', shortLabel: 'Snack' },
];

function buildMealSchedule(windowStart: number, windowEnd: number): MealScheduleSlot[] {
  const slots = MEAL_SCHEDULE.length;
  const duration = windowEnd - windowStart;

  return MEAL_SCHEDULE.map((meal, i) => {
    const fraction = i / (slots - 1); // 0, 0.2, 0.4, 0.6, 0.8, 1.0
    const timestamp = windowStart + fraction * duration;
    return {
      ...meal,
      time: formatTimeCompact(timestamp),
      position: fraction * 100,
    };
  });
}

function formatTimeCompact(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'p' : 'a';
  const hh = h % 12 || 12;
  return m === 0 ? `${hh}${ampm}` : `${hh}:${m.toString().padStart(2, '0')}${ampm}`;
}

function formatTimeShort(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/** Convert timestamp to "HH:MM" for <input type="time"> */
function timestampToTimeValue(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

/** Convert "HH:MM" string to minutes since midnight */
function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function EatingWindow({
  windowStart,
  windowEnd,
  mealTimestamps,
  nextMealSuggestion,
  totalProtein,
  dailyGoal,
  hoursRemaining,
  onWindowStartChange,
  onWindowEndChange,
}: Props) {
  const [editingStart, setEditingStart] = useState(false);
  const [editingEnd, setEditingEnd] = useState(false);

  const now = Date.now();
  const windowDuration = (windowStart && windowEnd) ? windowEnd - windowStart : 1;

  // useMemo must be called before any early return (Rules of Hooks)
  const mealDots = useMemo(
    () => {
      if (!windowStart || !windowDuration) return [];
      return mealTimestamps.map((ts) => ({
        position: Math.min(100, Math.max(0, ((ts - windowStart) / windowDuration) * 100)),
        time: formatTimeShort(ts),
      }));
    },
    [mealTimestamps, windowStart, windowDuration]
  );

  const mealSchedule = useMemo(
    () => {
      if (!windowStart || !windowEnd) return [];
      return buildMealSchedule(windowStart, windowEnd);
    },
    [windowStart, windowEnd]
  );

  if (!windowStart || !windowEnd) return null;

  const proteinRemaining = Math.max(0, dailyGoal - totalProtein);

  // Calculate positions as percentages
  const currentPos = Math.min(100, Math.max(0, ((now - windowStart) / windowDuration) * 100));

  const handleStartChange = (timeStr: string) => {
    if (!timeStr || !onWindowStartChange) return;
    onWindowStartChange(timeStringToMinutes(timeStr));
    setEditingStart(false);
  };

  const handleEndChange = (timeStr: string) => {
    if (!timeStr || !onWindowEndChange) return;
    onWindowEndChange(timeStringToMinutes(timeStr));
    setEditingEnd(false);
  };

  return (
    <div className="eating-window" data-testid="eating-window">
      <div className="eating-window__header">
        <span className="eating-window__label">Eating Window</span>
        <span className="eating-window__times">
          {editingStart ? (
            <input
              type="time"
              className="eating-window__time-edit"
              data-testid="eating-window-start-edit"
              defaultValue={timestampToTimeValue(windowStart)}
              onChange={(e) => handleStartChange(e.target.value)}
              onBlur={() => setEditingStart(false)}
              autoFocus
            />
          ) : (
            <button
              type="button"
              className="eating-window__time-btn"
              onClick={() => onWindowStartChange && setEditingStart(true)}
              title="Click to edit start time"
              data-testid="eating-window-start-btn"
            >
              {formatTimeShort(windowStart)}
            </button>
          )}
          <span className="eating-window__time-sep"> – </span>
          {editingEnd ? (
            <input
              type="time"
              className="eating-window__time-edit"
              data-testid="eating-window-end-edit"
              defaultValue={timestampToTimeValue(windowEnd)}
              onChange={(e) => handleEndChange(e.target.value)}
              onBlur={() => setEditingEnd(false)}
              autoFocus
            />
          ) : (
            <button
              type="button"
              className="eating-window__time-btn"
              onClick={() => onWindowEndChange && setEditingEnd(true)}
              title="Click to edit end time"
              data-testid="eating-window-end-btn"
            >
              {formatTimeShort(windowEnd)}
            </button>
          )}
        </span>
      </div>

      <div className="eating-window__bar" data-testid="eating-window-bar">
        <div className="eating-window__track">
          <div
            className="eating-window__fill"
            style={{ width: `${currentPos}%` }}
          />
          {mealDots.map((dot, i) => (
            <div
              key={i}
              className="eating-window__dot"
              style={{ left: `${dot.position}%` }}
              title={dot.time}
            />
          ))}
          <div
            className="eating-window__now"
            style={{ left: `${currentPos}%` }}
          />
        </div>

        {mealSchedule.length > 0 && (
          <div className="eating-window__schedule" data-testid="eating-window-schedule">
            {mealSchedule.map((slot, i) => (
              <div
                key={`${slot.label}-${i}`}
                className="eating-window__marker"
                style={{ left: `${slot.position}%` }}
              >
                <div className="eating-window__marker-tick" />
                <span className="eating-window__marker-label">{slot.shortLabel}</span>
                <span className="eating-window__marker-time">{slot.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="eating-window__info">
        {proteinRemaining > 0 && hoursRemaining > 0 ? (
          <span className="eating-window__remaining">
            {proteinRemaining}g left in {Math.round(hoursRemaining)}h
          </span>
        ) : proteinRemaining <= 0 ? (
          <span className="eating-window__complete">Goal complete!</span>
        ) : null}
        {nextMealSuggestion && (
          <span className="eating-window__suggestion">{nextMealSuggestion}</span>
        )}
      </div>
    </div>
  );
}
