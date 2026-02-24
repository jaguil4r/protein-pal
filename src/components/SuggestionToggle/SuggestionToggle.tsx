import { MealCategory, ProteinEntry, SuggestionMode } from '../../types';
import { SnackSuggestion } from '../SnackSuggestion/SnackSuggestion';
import { CoachMode } from '../CoachMode/CoachMode';
import './SuggestionToggle.css';

interface Props {
  totalProtein: number;
  dailyGoal: number;
  entries: ProteinEntry[];
  hoursRemaining: number;
  mealInterval: number;
  onAddEntry: (
    name: string,
    protein: number,
    category: MealCategory,
    macros?: { carbs: number; calories: number; fiber: number }
  ) => void;
  suggestionMode: SuggestionMode;
  onModeChange: (mode: SuggestionMode) => void;
}

export function SuggestionToggle({
  totalProtein,
  dailyGoal,
  entries,
  hoursRemaining,
  mealInterval,
  onAddEntry,
  suggestionMode,
  onModeChange,
}: Props) {
  const proteinRemaining = Math.max(0, dailyGoal - totalProtein);

  // Hide entirely when goal is met (matches existing SnackSuggestion behavior)
  if (proteinRemaining <= 0 && dailyGoal > 0) return null;
  if (dailyGoal <= 0) return null;

  const handlePillClick = (pill: 'snack' | 'coach') => {
    if (suggestionMode === pill) {
      // Clicking active pill → collapse
      onModeChange('none');
    } else {
      // Clicking inactive pill → activate it
      onModeChange(pill);
    }
  };

  const showContent = suggestionMode !== 'none';

  return (
    <div className="suggestion-toggle" data-testid="suggestion-toggle">
      <div className="suggestion-toggle__pills">
        <button
          type="button"
          className={`suggestion-toggle__pill${suggestionMode === 'snack' ? ' suggestion-toggle__pill--active' : ''}`}
          onClick={() => handlePillClick('snack')}
          data-testid="suggestion-tab-snack"
        >
          🍎 Snack Ideas
        </button>
        <button
          type="button"
          className={`suggestion-toggle__pill${suggestionMode === 'coach' ? ' suggestion-toggle__pill--active' : ''}`}
          onClick={() => handlePillClick('coach')}
          data-testid="suggestion-tab-coach"
        >
          🗓 Plan My Day
        </button>
      </div>

      {showContent && (
        <div className="suggestion-toggle__content">
          {suggestionMode === 'snack' ? (
            <SnackSuggestion
              totalProtein={totalProtein}
              dailyGoal={dailyGoal}
              entries={entries}
              hoursRemaining={hoursRemaining}
              mealInterval={mealInterval}
            />
          ) : (
            <CoachMode
              totalProtein={totalProtein}
              dailyGoal={dailyGoal}
              hoursRemaining={hoursRemaining}
              mealInterval={mealInterval}
              onAddEntry={onAddEntry}
            />
          )}
        </div>
      )}
    </div>
  );
}
