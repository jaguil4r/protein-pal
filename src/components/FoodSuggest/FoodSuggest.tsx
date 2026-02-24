import { useState, useEffect, useRef, useCallback } from 'react';
import { FoodItem } from '../../types';
import { searchFoods } from '../../utils/foodSearch';
import './FoodSuggest.css';

interface Props {
  query: string;
  onSelect: (food: FoodItem) => void;
  visible: boolean;
  onDismiss: () => void;
}

export function FoodSuggest({ query, onSelect, visible, onDismiss }: Props) {
  const [results, setResults] = useState<FoodItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search
  useEffect(() => {
    if (!visible || query.length < 2) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const found = searchFoods(query, 6);
      setResults(found);
      setActiveIndex(-1);
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, visible]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!visible || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        onSelect(results[activeIndex]);
      } else if (e.key === 'Escape') {
        onDismiss();
      }
    },
    [visible, results, activeIndex, onSelect, onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.food-suggest__item');
      items[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!visible || query.length < 2 || results.length === 0) return null;

  return (
    <div className="food-suggest" data-testid="food-suggest-dropdown" ref={listRef}>
      {results.map((food, i) => (
        <button
          key={food.id}
          type="button"
          className={`food-suggest__item${i === activeIndex ? ' food-suggest__item--active' : ''}`}
          onClick={() => onSelect(food)}
          data-testid="food-suggest-item"
        >
          <span className="food-suggest__name">{food.name}</span>
          <span className="food-suggest__macros">
            <span className="food-suggest__protein">{food.macrosPerServing.protein}g protein</span>
            <span className="food-suggest__cal">{food.macrosPerServing.calories} cal</span>
          </span>
          <span className="food-suggest__serving">{food.defaultServing}</span>
        </button>
      ))}
    </div>
  );
}
