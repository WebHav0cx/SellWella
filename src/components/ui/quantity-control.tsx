import { Minus, Plus } from "lucide-react";
export function QuantityControl({
  value,
  label,
  onDecrease,
  onIncrease,
  min = 0,
  max = Infinity,
}: {
  value: number;
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="quantity-control">
      <button
        type="button"
        aria-label={`Remove one ${label}`}
        disabled={value <= min}
        onClick={onDecrease}
      >
        <Minus size={14} aria-hidden="true" />
      </button>
      <b aria-live="polite">{value}</b>
      <button
        type="button"
        aria-label={`Add one ${label}`}
        disabled={value >= max}
        onClick={onIncrease}
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
