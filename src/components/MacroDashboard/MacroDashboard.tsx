import { MiniRing } from '../MiniRing/MiniRing';
import { WaterTracker } from '../WaterTracker/WaterTracker';
import './MacroDashboard.css';

interface Props {
  totalCarbs: number;
  totalCalories: number;
  totalFiber: number;
  carbGoal: number;
  calorieGoal: number;
  fiberGoal: number;
  showMacros: boolean;
  showWater: boolean;
  waterOz: number;
  waterGoalOz: number;
  onAddWater: (oz: number) => void;
  onToggleMacros: () => void;
  onToggleWater: () => void;
}

export function MacroDashboard({
  totalCarbs,
  totalCalories,
  totalFiber,
  carbGoal,
  calorieGoal,
  fiberGoal,
  showMacros,
  showWater,
  waterOz,
  waterGoalOz,
  onAddWater,
  onToggleMacros,
  onToggleWater,
}: Props) {
  const hasData = totalCarbs > 0 || totalCalories > 0 || totalFiber > 0;
  const showMacroRings = showMacros && hasData;

  return (
    <div className="macro-dashboard-wrapper" data-testid="macro-dashboard">
      <div className="macro-dashboard__toggles">
        <button
          className={`macro-dashboard__toggle-pill${showMacros ? ' macro-dashboard__toggle-pill--active' : ''}`}
          onClick={onToggleMacros}
          data-testid="macro-toggle-btn"
          aria-label="Toggle macro badges"
        >
          📊 Macros
        </button>
        <button
          className={`macro-dashboard__toggle-pill${showWater ? ' macro-dashboard__toggle-pill--active' : ''}`}
          onClick={onToggleWater}
          data-testid="water-toggle-btn"
          aria-label="Toggle water tracker"
        >
          💧 Water
        </button>
      </div>

      {(showMacroRings || showWater) && (
        <div className="macro-dashboard__rings">
          {showMacroRings && (
            <>
              <MiniRing current={totalCarbs} goal={carbGoal} label="Carbs" unit="g" color="carbs" />
              <MiniRing current={totalCalories} goal={calorieGoal} label="Cals" unit="cal" color="calories" />
              <MiniRing current={totalFiber} goal={fiberGoal} label="Fiber" unit="g" color="fiber" />
            </>
          )}
          {showWater && (
            <WaterTracker currentOz={waterOz} goalOz={waterGoalOz} onAddWater={onAddWater} />
          )}
        </div>
      )}
    </div>
  );
}
