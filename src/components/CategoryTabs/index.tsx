import { useState, useRef } from 'react';
import type { Category, DataStore } from '../../lib/types';

interface Props {
  categories: Category[];
  active: string;
  data: DataStore;
  onSelect: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoryTabs({ categories, active, data, onSelect, onAddCategory, onDeleteCategory }: Props) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function startAdding() {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  function commit() {
    const val = input.trim();
    if (val) onAddCategory(val);
    setInput('');
    setAdding(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setInput(''); setAdding(false); }
  }

  return (
    <div className="tabs">
      {categories.map(c => (
        <button
          key={c.id}
          className={`tab${c.id === active ? ' active' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          {c.label}
          <span className="tab-n">{(data[c.id] ?? []).length}</span>
          {c.isCustom && (
            <span
              className="tab-del"
              onClick={e => { e.stopPropagation(); onDeleteCategory(c.id); }}
            >
              ×
            </span>
          )}
        </button>
      ))}

      {adding ? (
        <div className="tab-add-wrap">
          <input
            ref={inputRef}
            className="tab-add-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commit}
            placeholder="Category name…"
            maxLength={24}
          />
        </div>
      ) : (
        <button className="tab tab-plus" onClick={startAdding}>＋</button>
      )}
    </div>
  );
}
