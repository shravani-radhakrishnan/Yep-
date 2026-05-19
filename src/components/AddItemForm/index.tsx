import { useRef } from 'react';

interface Props {
  placeholder: string;
  hint: string;
  onAdd: (name: string) => void;
}

export default function AddItemForm({ placeholder, hint, onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const val = inputRef.current?.value.trim() ?? '';
    if (!val) return;
    onAdd(val);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="add-wrap">
      <div className="add-row">
        <input
          ref={inputRef}
          className="add-input"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="add-btn" onClick={handleAdd}>+ Add</button>
      </div>
      <div className="add-hint">{hint}</div>
    </div>
  );
}
