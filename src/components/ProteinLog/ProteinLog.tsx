import { useState, useCallback } from 'react';
import { ProteinEntry as ProteinEntryType, MealCategory } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import './ProteinLog.css';

interface Props {
  entries: ProteinEntryType[];
  onDelete: (id: string) => void;
  onUpdateTimestamp?: (id: string, timestamp: number) => void;
  show: boolean;
  onToggle: () => void;
}

const categoryOrder: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function ProteinLog({ entries, onDelete, onUpdateTimestamp, show, onToggle }: Props) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingTimeId, setEditingTimeId] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      onDelete(id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, [onDelete]);

  const handleTimeClick = (id: string) => {
    if (onUpdateTimestamp) {
      setEditingTimeId(id);
    }
  };

  const handleTimeChange = (id: string, timeStr: string) => {
    if (!onUpdateTimestamp || !timeStr) return;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    onUpdateTimestamp(id, now.getTime());
    setEditingTimeId(null);
  };

  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: entries.filter((e) => e.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="protein-log" data-testid="entry-list">
      <button
        className="protein-log__header protein-log__header--toggle"
        onClick={onToggle}
        aria-label={show ? 'Collapse today\'s log' : 'Expand today\'s log'}
      >
        <span className="protein-log__title">
          Today's Log
          {entries.length > 0 && <span className="protein-log__count">{entries.length}</span>}
          <span className={`protein-log__chevron${show ? ' protein-log__chevron--open' : ''}`}>▾</span>
        </span>
      </button>
      {show && (
        <div className="protein-log__content">
          {entries.length === 0 ? (
            <div className="protein-log__empty">
              <div className="protein-log__empty-icon" aria-hidden="true">🍳</div>
              <div className="protein-log__empty-title">No entries yet</div>
              <div className="protein-log__empty-hint">Add your first protein to get started!</div>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} className="protein-log__category">
                <div className="protein-log__category-header">
                  {group.category.charAt(0).toUpperCase() + group.category.slice(1)}
                </div>
                {group.items.map((entry) => (
                  <div
                    key={entry.id}
                    className={`protein-entry${deletingIds.has(entry.id) ? ' protein-entry--deleting' : ''}`}
                    data-testid="protein-entry"
                  >
                    <div className="protein-entry__main">
                      <span className="protein-entry__name">{entry.name}</span>
                      <span className="protein-entry__protein">{entry.protein}g</span>
                      {editingTimeId === entry.id ? (
                        <input
                          type="time"
                          className="protein-entry__time-edit"
                          data-testid="entry-time-edit"
                          defaultValue={new Date(entry.timestamp).toTimeString().slice(0, 5)}
                          onChange={(e) => handleTimeChange(entry.id, e.target.value)}
                          onBlur={() => setEditingTimeId(null)}
                          autoFocus
                        />
                      ) : (
                        <button
                          type="button"
                          className="protein-entry__time"
                          onClick={() => handleTimeClick(entry.id)}
                          title="Click to edit time"
                        >
                          {formatTime(entry.timestamp)}
                        </button>
                      )}
                      <button
                        className="protein-entry__delete"
                        onClick={() => handleDelete(entry.id)}
                        data-testid={`delete-entry-${entry.id}`}
                        aria-label={`Delete ${entry.name}`}
                      >
                        &times;
                      </button>
                    </div>
                    {(entry.carbs || entry.calories || entry.fiber) ? (
                      <div className="protein-entry__macros">
                        {entry.carbs ? <span className="protein-entry__macro protein-entry__macro--carbs">{entry.carbs}g carbs</span> : null}
                        {entry.calories ? <span className="protein-entry__macro protein-entry__macro--cals">{entry.calories} cal</span> : null}
                        {entry.fiber ? <span className="protein-entry__macro protein-entry__macro--fiber">{entry.fiber}g fiber</span> : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
