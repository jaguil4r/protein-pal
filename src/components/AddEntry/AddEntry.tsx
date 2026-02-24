import { useState, useRef, useEffect } from 'react';
import { MealCategory, FoodItem, ServingSize } from '../../types';
import { FoodSuggest } from '../FoodSuggest/FoodSuggest';
import { ServingPicker } from '../ServingPicker/ServingPicker';
import './AddEntry.css';

interface Props {
  onAdd: (
    name: string,
    protein: number,
    category: MealCategory,
    macros?: { carbs: number; calories: number; fiber: number }
  ) => void;
  selectedCategory: MealCategory;
  onCategoryChange: (category: MealCategory) => void;
}

const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function AddEntry({ onAdd, selectedCategory, onCategoryChange }: Props) {
  const [name, setName] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [calories, setCalories] = useState('');
  const [fiber, setFiber] = useState('');

  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedServing, setSelectedServing] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss food suggest
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.length >= 2) {
      setShowSuggest(true);
    } else {
      setShowSuggest(false);
    }
    // If editing name after selecting a food, clear the selection
    if (selectedFood && value !== selectedFood.name) {
      setSelectedFood(null);
      setSelectedServing('');
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setName(food.name);
    setShowSuggest(false);
    setSelectedServing(food.defaultServing);

    // Auto-fill macros at default serving
    const m = food.macrosPerServing;
    setProtein(String(Math.round(m.protein)));
    setCarbs(String(Math.round(m.carbs)));
    setCalories(String(Math.round(m.calories)));
    setFiber(String(Math.round(m.fiber)));
  };

  const handleServingSelect = (serving: ServingSize) => {
    if (!selectedFood) return;
    setSelectedServing(serving.label);

    const m = selectedFood.macrosPerServing;
    setProtein(String(Math.round(m.protein * serving.multiplier)));
    setCarbs(String(Math.round(m.carbs * serving.multiplier)));
    setCalories(String(Math.round(m.calories * serving.multiplier)));
    setFiber(String(Math.round(m.fiber * serving.multiplier)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proteinNum = parseInt(protein, 10);
    if (!name.trim() || isNaN(proteinNum) || proteinNum < 1) return;

    const carbsNum = parseInt(carbs, 10);
    const calsNum = parseInt(calories, 10);
    const fiberNum = parseInt(fiber, 10);

    const macros =
      !isNaN(carbsNum) || !isNaN(calsNum) || !isNaN(fiberNum)
        ? {
            carbs: isNaN(carbsNum) ? 0 : carbsNum,
            calories: isNaN(calsNum) ? 0 : calsNum,
            fiber: isNaN(fiberNum) ? 0 : fiberNum,
          }
        : undefined;

    onAdd(name.trim(), proteinNum, selectedCategory, macros);

    setName('');
    setProtein('');
    setCarbs('');
    setCalories('');
    setFiber('');
    setSelectedFood(null);
    setSelectedServing('');
    setShowSuggest(false);
  };

  return (
    <form className="add-entry" onSubmit={handleSubmit}>
      <div className="add-entry__name-wrapper" ref={wrapperRef}>
        <input
          type="text"
          className="add-entry__input add-entry__input--name"
          placeholder="What did you eat?"
          value={name}
          maxLength={100}
          onChange={(e) => handleNameChange(e.target.value)}
          onFocus={() => name.length >= 2 && setShowSuggest(true)}
          data-testid="entry-name-input"
          autoComplete="off"
        />
        <FoodSuggest
          query={name}
          onSelect={handleFoodSelect}
          visible={showSuggest}
          onDismiss={() => setShowSuggest(false)}
        />
      </div>

      {selectedFood && (
        <ServingPicker
          servingSizes={selectedFood.servingSizes}
          selectedServing={selectedServing}
          onSelect={handleServingSelect}
        />
      )}

      <div className="add-entry__macros">
        <div className="add-entry__macro-field">
          <label className="add-entry__macro-label">Protein</label>
          <div className="add-entry__macro-input-wrap">
            <input
              type="number"
              className="add-entry__macro-input add-entry__macro-input--protein"
              placeholder="0"
              min={0}
              max={999}
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              data-testid="entry-protein-input"
            />
            <span className="add-entry__macro-unit">g</span>
          </div>
        </div>
        <div className="add-entry__macro-field">
          <label className="add-entry__macro-label">Carbs</label>
          <div className="add-entry__macro-input-wrap">
            <input
              type="number"
              className="add-entry__macro-input"
              placeholder="0"
              min={0}
              max={9999}
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              data-testid="entry-carbs-input"
            />
            <span className="add-entry__macro-unit">g</span>
          </div>
        </div>
        <div className="add-entry__macro-field">
          <label className="add-entry__macro-label">Cals</label>
          <div className="add-entry__macro-input-wrap">
            <input
              type="number"
              className="add-entry__macro-input"
              placeholder="0"
              min={0}
              max={9999}
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              data-testid="entry-calories-input"
            />
            <span className="add-entry__macro-unit">cal</span>
          </div>
        </div>
        <div className="add-entry__macro-field">
          <label className="add-entry__macro-label">Fiber</label>
          <div className="add-entry__macro-input-wrap">
            <input
              type="number"
              className="add-entry__macro-input"
              placeholder="0"
              min={0}
              max={999}
              value={fiber}
              onChange={(e) => setFiber(e.target.value)}
              data-testid="entry-fiber-input"
            />
            <span className="add-entry__macro-unit">g</span>
          </div>
        </div>
      </div>

      <div className="add-entry__categories">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            className={`add-entry__category ${selectedCategory === cat ? 'add-entry__category--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
            data-testid={`category-${cat}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="add-entry__submit"
        data-testid="add-entry-button"
        disabled={!name.trim() || !protein}
      >
        + Add Entry
      </button>
    </form>
  );
}
