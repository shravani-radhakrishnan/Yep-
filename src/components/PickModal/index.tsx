import type { Item, Status } from '../../lib/types';

interface Props {
  item: Item | null;
  categoryLabel: string;
  onFeedback: (status: Status) => void;
  onClose: () => void;
  onReroll: () => void;
}

export default function PickModal({ item, categoryLabel, onFeedback, onClose, onReroll }: Props) {
  return (
    <div
      className={`overlay${item ? ' show' : ''}`}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="handle" />
        <div className="m-content" key={item?.id}>
          <div className="m-eye">{categoryLabel.toUpperCase()}</div>
          <div className="m-name">{item?.name ?? ''}</div>
          <div className="m-detail">{item?.detail ?? ''}</div>
          <div className="m-rating">{item?.rating ?? ''}</div>
          <div className="m-picks">
            {item && (item.picks > 1 ? `Suggested ${item.picks}× so far` : 'First time picking this ✨')}
          </div>
        </div>
        <div className="m-q">Did you actually do it?</div>
        <div className="m-fbs">
          <button className="fb fb-y" onClick={() => onFeedback('done')}>✓ Yes, we did!</button>
          <button className="fb fb-n" onClick={() => onFeedback('skip')}>✕ Nope, skipped</button>
        </div>
        <button className="fb-later" onClick={onClose}>Remind me later</button>
        <button className="fb-reroll" onClick={onReroll}>↻ PICK SOMETHING ELSE</button>
      </div>
    </div>
  );
}
