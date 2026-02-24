import { useState, useMemo } from 'react';
import { getDefaultSuggestionsForMeal } from '../../utils/foodSearch';
import './RealityCheck.css';

interface Props {
  totalProtein: number;
  dailyGoal: number;
}

export function RealityCheck({ totalProtein, dailyGoal }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const check = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    // Only show between 11am and 4pm
    if (hour < 11 || hour > 16) return null;

    // Calculate expected pace (assume 16 waking hours, 7am–11pm)
    const wakingHoursElapsed = Math.max(0, hour - 7);
    const expectedProtein = Math.round((wakingHoursElapsed / 16) * dailyGoal);

    // Only show if significantly behind (less than 80% of expected)
    if (totalProtein >= expectedProtein * 0.8) return null;

    return {
      expected: expectedProtein,
      actual: totalProtein,
      deficit: expectedProtein - totalProtein,
    };
  }, [totalProtein, dailyGoal]);

  const snackSuggestions = useMemo(() => {
    if (!check) return [];
    return getDefaultSuggestionsForMeal('snack').slice(0, 3);
  }, [check]);

  if (!check || dismissed) return null;

  return (
    <div className="reality-check" data-testid="reality-check">
      <div className="reality-check__content">
        <div className="reality-check__icon">⚡</div>
        <div className="reality-check__text">
          <div className="reality-check__message">
            You should be around <strong>{check.expected}g</strong> by now — you're at <strong>{check.actual}g</strong>
          </div>
          {snackSuggestions.length > 0 && (
            <div className="reality-check__suggestions">
              Try: {snackSuggestions.map((f, i) => (
                <span key={f.id}>
                  {i > 0 && ', '}
                  {f.name} ({f.macrosPerServing.protein}g)
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className="reality-check__dismiss"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          data-testid="reality-check-dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
