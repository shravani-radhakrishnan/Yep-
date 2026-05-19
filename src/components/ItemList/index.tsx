import type { Item, SortMode } from '../../lib/types';
import ItemCard from '../ItemCard';

interface Props {
  items: Item[];
  sort: SortMode;
  loadingIds: Set<string>;
  categoryEmoji: string;
  onSort: (sort: SortMode) => void;
  onMark: (id: string, status: 'new' | 'done' | 'skip') => void;
  onDelete: (id: string) => void;
}

const SORTS: { key: SortMode; label: string }[] = [
  { key: 'smart', label: 'SMART' },
  { key: 'name', label: 'A→Z' },
  { key: 'new', label: 'NEW FIRST' },
];

export default function ItemList({ items, sort, loadingIds, categoryEmoji, onSort, onMark, onDelete }: Props) {
  const newCount = items.filter(i => i.status === 'new').length;
  const loadingItems = items.filter(i => loadingIds.has(i.id));

  return (
    <>
      <div className="list-top">
        <span className="list-count">
          {items.length > 0
            ? `${items.length} item${items.length !== 1 ? 's' : ''} · ${newCount} not tried yet`
            : ''}
        </span>
        <div className="sort-row">
          {SORTS.map(s => (
            <button
              key={s.key}
              className={`srt${sort === s.key ? ' active' : ''}`}
              onClick={() => onSort(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loadingItems.map(item => (
        <div key={item.id} className="loading-bar">
          <div className="spin" />
          Looking up "{item.name}"…
        </div>
      ))}

      <div className="list">
        {items.length === 0 ? (
          <div className="empty">
            <span className="empty-ico">{categoryEmoji}</span>
            <p>Nothing added yet.<br />Type something above!</p>
          </div>
        ) : (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              loading={loadingIds.has(item.id)}
              onMark={onMark}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </>
  );
}
