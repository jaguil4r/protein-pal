import { useState, useEffect } from 'react';
import { MealCategory } from '../../types';
import { getTopFavorites, getCategoryFavorites, FavoriteEntry } from '../../utils/storage';
import { getHighProteinSuggestions } from '../../utils/foodSearch';
import './QuickAdd.css';

interface Props {
  onQuickAdd: (name: string, protein: number, category: MealCategory, macros?: { carbs: number; calories: number; fiber: number }) => void;
  selectedCategory: MealCategory;
  refreshKey?: number;
}

export function QuickAdd({ onQuickAdd, selectedCategory, refreshKey = 0 }: Props) {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  const refreshFavorites = () => {
    // Try category-specific favorites first
    const catFavs = getCategoryFavorites(selectedCategory, 3);
    if (catFavs.length > 0) {
      setFavorites(catFavs);
      return;
    }

    // Fall back to high-protein foods from the database
    const defaults = getHighProteinSuggestions(3);
    if (defaults.length > 0) {
      const defaultFavs: FavoriteEntry[] = defaults.map((food) => ({
        name: food.name,
        protein: food.macrosPerServing.protein,
        carbs: food.macrosPerServing.carbs,
        calories: food.macrosPerServing.calories,
        fiber: food.macrosPerServing.fiber,
        category: selectedCategory,
        count: 0,
      }));
      setFavorites(defaultFavs);
      return;
    }

    // Last resort: top overall favorites
    setFavorites(getTopFavorites(3));
  };

  useEffect(() => {
    refreshFavorites();
  }, [selectedCategory, refreshKey]);

  if (favorites.length === 0) return null;

  const label = 'Quick Add:';

  return (
    <div className="quick-add" data-testid="quick-add">
      <span className="quick-add__label">{label}</span>
      <div className="quick-add__pills">
        {favorites.map((fav, i) => (
          <button
            key={`${fav.name}-${i}`}
            className="quick-add__pill"
            onClick={() =>
              onQuickAdd(fav.name, fav.protein, fav.category, {
                carbs: fav.carbs,
                calories: fav.calories,
                fiber: fav.fiber,
              })
            }
            data-testid="quick-add-pill"
            aria-label={`Quick add ${fav.name}, ${fav.protein} grams protein`}
          >
            {fav.name} <span className="quick-add__pill-grams">{fav.protein}g</span>
          </button>
        ))}
      </div>
    </div>
  );
}
