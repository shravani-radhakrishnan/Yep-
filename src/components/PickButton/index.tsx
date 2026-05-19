interface Props {
  onClick: () => void;
}

export default function PickButton({ onClick }: Props) {
  return (
    <div className="pick-wrap">
      <div className="pick-inner">
        <button className="pick-btn" onClick={onClick}>
          <span>🎲</span> Pick one for us
        </button>
      </div>
    </div>
  );
}
