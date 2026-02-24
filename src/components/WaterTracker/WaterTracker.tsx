import { MiniRing } from '../MiniRing/MiniRing';
import './WaterTracker.css';

interface Props {
  currentOz: number;
  goalOz: number;
  onAddWater: (oz: number) => void;
}

export function WaterTracker({ currentOz, goalOz, onAddWater }: Props) {
  return (
    <div className="water-tracker" data-testid="water-tracker">
      <MiniRing
        current={currentOz}
        goal={goalOz}
        label="Water"
        unit="oz"
        color="water"
      />
      <button
        className="water-tracker__add-btn"
        onClick={() => onAddWater(8)}
        data-testid="water-add-btn"
        aria-label="Add 8 oz of water"
      >
        +8oz
      </button>
    </div>
  );
}
