import { ServingSize } from '../../types';
import './ServingPicker.css';

interface Props {
  servingSizes: ServingSize[];
  selectedServing: string;
  onSelect: (serving: ServingSize) => void;
}

export function ServingPicker({ servingSizes, selectedServing, onSelect }: Props) {
  if (servingSizes.length === 0) return null;

  return (
    <div className="serving-picker" data-testid="serving-picker">
      <span className="serving-picker__label">Serving:</span>
      <div className="serving-picker__options">
        {servingSizes.map((size) => (
          <button
            key={size.label}
            type="button"
            className={`serving-picker__option${selectedServing === size.label ? ' serving-picker__option--active' : ''}`}
            onClick={() => onSelect(size)}
            data-testid="serving-option"
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
