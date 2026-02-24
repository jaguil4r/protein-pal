import { useEffect, useRef } from 'react';
import { AnimalType } from '../../types';
import { getSettings, saveSettings, getAllData, setLastBackupDate } from '../../utils/storage';
import { exportAsJSON, exportAsCSV, downloadFile, importFromJSON } from '../../utils/export';
import { SlothSvg } from '../AnimalAvatar/SlothSvg';
import { PandaSvg } from '../AnimalAvatar/PandaSvg';
import { BunnySvg } from '../AnimalAvatar/BunnySvg';
import './Settings.css';

interface Props {
  selectedAnimal: AnimalType;
  onAnimalChange: (animal: AnimalType) => void;
  goal: number;
  onGoalChange: (goal: number) => void;
  onClose: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  notificationPermission: NotificationPermission;
  onRequestNotifications: () => void;
  mealInterval: number;
  onMealIntervalChange: (hours: number) => void;
  macroGoals?: { carbs: number; calories: number; fiber: number };
  onMacroGoalsChange?: (goals: { carbs: number; calories: number; fiber: number }) => void;
  workoutDays: number[];
  onWorkoutDaysChange: (days: number[]) => void;
  cheatDaysPerWeek: number;
  onCheatDaysPerWeekChange: (count: number) => void;
  showMacros: boolean;
  onShowMacrosChange: (show: boolean) => void;
  showWater: boolean;
  onShowWaterChange: (show: boolean) => void;
  waterGoalOz: number;
  onWaterGoalChange: (goalOz: number) => void;
  showWeeklySummary: boolean;
  onShowWeeklySummaryChange: (show: boolean) => void;
  onImportComplete?: (message: string, success: boolean) => void;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const animalOptions: { type: AnimalType; label: string; Component: React.FC<{ mood: 'happy' }> }[] = [
  { type: 'sloth', label: 'Sloth', Component: SlothSvg as any },
  { type: 'panda', label: 'Panda', Component: PandaSvg as any },
  { type: 'bunny', label: 'Bunny', Component: BunnySvg as any },
];

export function Settings({
  selectedAnimal,
  onAnimalChange,
  goal,
  onGoalChange,
  onClose,
  darkMode,
  onToggleDark,
  notificationPermission,
  onRequestNotifications,
  mealInterval,
  onMealIntervalChange,
  macroGoals,
  onMacroGoalsChange,
  workoutDays,
  onWorkoutDaysChange,
  cheatDaysPerWeek,
  onCheatDaysPerWeekChange,
  showMacros,
  onShowMacrosChange,
  showWater,
  onShowWaterChange,
  waterGoalOz,
  onWaterGoalChange,
  showWeeklySummary,
  onShowWeeklySummaryChange,
  onImportComplete,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  const carbGoal = macroGoals?.carbs ?? 250;
  const calorieGoal = macroGoals?.calories ?? 2000;
  const fiberGoal = macroGoals?.fiber ?? 25;

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    panel.addEventListener('keydown', handleTrap);
    return () => panel.removeEventListener('keydown', handleTrap);
  }, []);

  const handleExportJSON = () => {
    const data = getAllData();
    const content = exportAsJSON(data);
    downloadFile(content, `proteinpal-export-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    setLastBackupDate();
  };

  const handleExportCSV = () => {
    const data = getAllData();
    const content = exportAsCSV(data);
    downloadFile(content, `proteinpal-export-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
    setLastBackupDate();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = importFromJSON(content);
      if (result.success) {
        onImportComplete?.(`Imported ${result.daysImported} day(s) of data!`, true);
        window.location.reload();
      } else {
        onImportComplete?.(result.error || 'Import failed.', false);
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-selected
    event.target.value = '';
  };

  const handleAnimalChange = (animal: AnimalType) => {
    onAnimalChange(animal);
    const settings = getSettings();
    saveSettings({ ...settings, selectedAnimal: animal });
  };

  const handleIntervalChange = (val: number) => {
    onMealIntervalChange(val);
    const settings = getSettings();
    saveSettings({ ...settings, mealInterval: val });
  };

  const handleMacroGoalChange = (macro: 'carbs' | 'calories' | 'fiber', delta: number) => {
    if (!onMacroGoalsChange) return;
    const newGoals = {
      carbs: carbGoal,
      calories: calorieGoal,
      fiber: fiberGoal,
    };
    if (macro === 'carbs') newGoals.carbs = Math.max(0, newGoals.carbs + delta);
    else if (macro === 'calories') newGoals.calories = Math.max(0, newGoals.calories + delta);
    else newGoals.fiber = Math.max(0, newGoals.fiber + delta);
    onMacroGoalsChange(newGoals);
  };

  const handleToggleWorkoutDay = (dayNum: number) => {
    const updated = workoutDays.includes(dayNum)
      ? workoutDays.filter((d) => d !== dayNum)
      : [...workoutDays, dayNum].sort((a, b) => a - b);
    onWorkoutDaysChange(updated);
    const settings = getSettings();
    saveSettings({ ...settings, workoutDays: updated });
  };

  const handleCheatDaysChange = (delta: number) => {
    const newVal = Math.max(0, Math.min(3, cheatDaysPerWeek + delta));
    onCheatDaysPerWeekChange(newVal);
    const settings = getSettings();
    saveSettings({ ...settings, cheatDaysPerWeek: newVal });
  };

  return (
    <div className="settings-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="settings-panel" data-testid="settings-panel" ref={panelRef}>
        <div className="settings-panel__header">
          <h2 className="settings-panel__title">Settings</h2>
          <button className="settings-panel__close" onClick={onClose} aria-label="Close settings">
            &times;
          </button>
        </div>

        {/* Daily Protein Goal */}
        <div className="settings-section">
          <span className="settings-section__label">Daily Protein Goal</span>
          <div className="settings-goal">
            <button
              className="settings-goal__btn"
              onClick={() => onGoalChange(Math.max(10, goal - 10))}
              data-testid="goal-decrease"
            >
              -
            </button>
            <span className="settings-goal__value" data-testid="goal-value">{goal}g</span>
            <button
              className="settings-goal__btn"
              onClick={() => onGoalChange(Math.min(500, goal + 10))}
              data-testid="goal-increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Macro Goals */}
        {onMacroGoalsChange && (
          <div className="settings-section">
            <span className="settings-section__label">Macro Goals</span>
            <div className="settings-macro-goals">
              <div className="settings-macro-goal">
                <span className="settings-macro-goal__label">Carbs</span>
                <div className="settings-goal settings-goal--small">
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('carbs', -10)} data-testid="carb-goal-decrease">-</button>
                  <span className="settings-goal__value" data-testid="carb-goal-value">{carbGoal}g</span>
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('carbs', 10)} data-testid="carb-goal-increase">+</button>
                </div>
              </div>
              <div className="settings-macro-goal">
                <span className="settings-macro-goal__label">Calories</span>
                <div className="settings-goal settings-goal--small">
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('calories', -100)} data-testid="cal-goal-decrease">-</button>
                  <span className="settings-goal__value" data-testid="cal-goal-value">{calorieGoal}</span>
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('calories', 100)} data-testid="cal-goal-increase">+</button>
                </div>
              </div>
              <div className="settings-macro-goal">
                <span className="settings-macro-goal__label">Fiber</span>
                <div className="settings-goal settings-goal--small">
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('fiber', -5)} data-testid="fiber-goal-decrease">-</button>
                  <span className="settings-goal__value" data-testid="fiber-goal-value">{fiberGoal}g</span>
                  <button className="settings-goal__btn settings-goal__btn--sm" onClick={() => handleMacroGoalChange('fiber', 5)} data-testid="fiber-goal-increase">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Macro Badges Toggle */}
        <div className="settings-section">
          <div className="settings-toggle-row">
            <span className="settings-toggle-row__label">Show Macro Badges</span>
            <button
              className={`settings-toggle ${showMacros ? 'settings-toggle--active' : ''}`}
              onClick={() => onShowMacrosChange(!showMacros)}
              data-testid="settings-show-macros-toggle"
              aria-label="Toggle macro badges"
            >
              <div className="settings-toggle__knob" />
            </button>
          </div>
        </div>

        {/* Show Water Tracker Toggle */}
        <div className="settings-section">
          <div className="settings-toggle-row">
            <span className="settings-toggle-row__label">Show Water Tracker</span>
            <button
              className={`settings-toggle ${showWater ? 'settings-toggle--active' : ''}`}
              onClick={() => onShowWaterChange(!showWater)}
              data-testid="settings-show-water-toggle"
              aria-label="Toggle water tracker"
            >
              <div className="settings-toggle__knob" />
            </button>
          </div>
        </div>

        {/* Daily Water Goal */}
        {showWater && (
          <div className="settings-section">
            <span className="settings-section__label">Daily Water Goal</span>
            <div className="settings-goal">
              <button
                className="settings-goal__btn"
                onClick={() => onWaterGoalChange(Math.max(8, waterGoalOz - 8))}
                data-testid="water-goal-decrease"
              >
                -
              </button>
              <span className="settings-goal__value" data-testid="water-goal-value">{waterGoalOz}oz</span>
              <button
                className="settings-goal__btn"
                onClick={() => onWaterGoalChange(Math.min(200, waterGoalOz + 8))}
                data-testid="water-goal-increase"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Show Weekly Summary Toggle */}
        <div className="settings-section">
          <div className="settings-toggle-row">
            <span className="settings-toggle-row__label">Show Weekly Summary</span>
            <button
              className={`settings-toggle ${showWeeklySummary ? 'settings-toggle--active' : ''}`}
              onClick={() => onShowWeeklySummaryChange(!showWeeklySummary)}
              data-testid="settings-show-weekly-toggle"
              aria-label="Toggle weekly summary"
            >
              <div className="settings-toggle__knob" />
            </button>
          </div>
        </div>

        {/* Choose Animal */}
        <div className="settings-section">
          <span className="settings-section__label">Choose Your Pal</span>
          <div className="settings-animals">
            {animalOptions.map(({ type, label, Component }) => (
              <button
                key={type}
                className={`settings-animal-option ${selectedAnimal === type ? 'settings-animal-option--active' : ''}`}
                onClick={() => handleAnimalChange(type)}
                data-testid={`animal-option-${type}`}
              >
                <Component mood="happy" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meal Interval */}
        <div className="settings-section">
          <span className="settings-section__label">Meal Interval</span>
          <div className="settings-slider">
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={mealInterval}
              onChange={(e) => handleIntervalChange(parseFloat(e.target.value))}
              data-testid="meal-interval-slider"
            />
            <span className="settings-slider__value">{mealInterval}h</span>
          </div>
        </div>

        {/* Workout Days */}
        <div className="settings-section">
          <span className="settings-section__label">Workout Days</span>
          <div className="settings-workout-days" data-testid="workout-days-picker">
            {DAY_LABELS.map((label, idx) => (
              <button
                key={idx}
                className={`settings-workout-day${workoutDays.includes(idx) ? ' settings-workout-day--active' : ''}`}
                onClick={() => handleToggleWorkoutDay(idx)}
                data-testid={`workout-day-${idx}`}
                aria-label={`${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][idx]}${workoutDays.includes(idx) ? ' (workout)' : ' (rest)'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Cheat Days Per Week */}
        <div className="settings-section">
          <span className="settings-section__label">Cheat Days Per Week</span>
          <div className="settings-goal settings-goal--small">
            <button
              className="settings-goal__btn settings-goal__btn--sm"
              onClick={() => handleCheatDaysChange(-1)}
              data-testid="cheat-days-decrease"
            >
              -
            </button>
            <span className="settings-goal__value" data-testid="cheat-days-value">{cheatDaysPerWeek}</span>
            <button
              className="settings-goal__btn settings-goal__btn--sm"
              onClick={() => handleCheatDaysChange(1)}
              data-testid="cheat-days-increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <span className="settings-section__label">Notifications</span>
          {notificationPermission === 'granted' ? (
            <span className="settings-notification-status">Notifications enabled</span>
          ) : notificationPermission === 'denied' ? (
            <span className="settings-notification-status">Notifications blocked by browser</span>
          ) : (
            <button className="settings-notification-btn" onClick={onRequestNotifications} data-testid="enable-notifications">
              Enable Notifications
            </button>
          )}
        </div>

        {/* Dark Mode */}
        <div className="settings-section">
          <div className="settings-toggle-row">
            <span className="settings-toggle-row__label">Brotein Mode</span>
            <button
              className={`settings-toggle ${darkMode ? 'settings-toggle--active' : ''}`}
              onClick={onToggleDark}
              data-testid="settings-dark-toggle"
              aria-label="Toggle brotein mode"
            >
              <div className="settings-toggle__knob" />
            </button>
          </div>
        </div>

        {/* Export */}
        <div className="settings-section">
          <span className="settings-section__label">Export Data</span>
          <div className="settings-export">
            <button className="settings-export__btn" onClick={handleExportJSON} data-testid="export-json-button">
              Export JSON
            </button>
            <button className="settings-export__btn" onClick={handleExportCSV} data-testid="export-csv-button">
              Export CSV
            </button>
            <label className="settings-export__btn settings-export__btn--import" data-testid="import-json-button">
              Import JSON
              <input type="file" accept=".json" onChange={handleImportJSON} hidden />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
