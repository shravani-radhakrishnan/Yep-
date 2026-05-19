import type { Item, Status } from '../../lib/types';

interface Props {
  item: Item;
  loading: boolean;
  onMark: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, loading, onMark, onDelete }: Props) {
  const dotClass = item.status === 'done' ? 'dot-done' : item.status === 'skip' ? 'dot-skip' : 'dot-new';
  const badgeClass = item.status === 'done' ? 'b-done' : item.status === 'skip' ? 'b-skip' : 'b-new';
  const badgeLabel = item.status === 'done' ? 'done ✓' : item.status === 'skip' ? 'skipped' : 'not tried';

  return (
    <div className="item">
      <div className={`dot ${dotClass}`} />
      <div className="ibody">
        <div className="iname">{item.name}</div>
        <div className="imeta">
          {loading ? (
            <span className="idetail-loading">fetching…</span>
          ) : item.rating ? (
            <span className="irating">{item.rating}</span>
          ) : null}
          {!loading && item.detail && <span className="idetail">{item.detail}</span>}
          {item.picks > 0 && <span className="ipicks">picked {item.picks}×</span>}
        </div>
      </div>
      <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
      <div className="acts">
        {item.status !== 'done' && (
          <button className="act act-done" onClick={() => onMark(item.id, 'done')}>✓</button>
        )}
        {item.status !== 'skip' && (
          <button className="act act-skip" onClick={() => onMark(item.id, 'skip')}>✕</button>
        )}
        {item.status !== 'new' && (
          <button className="act act-reset" onClick={() => onMark(item.id, 'new')}>↺</button>
        )}
        <button className="act act-del" onClick={() => onDelete(item.id)}>×</button>
      </div>
    </div>
  );
}
