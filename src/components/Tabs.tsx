import { useRef, type KeyboardEvent, type ReactNode } from "react";

/**
 * WAI-ARIA tabs with automatic activation: one tab stop for the whole list,
 * arrows move between tabs (and wrap), Home and End jump to the ends.
 */
export function Tabs<K extends string>({
  label,
  items,
  value,
  onChange,
  idPrefix,
  className = "",
}: {
  label: string;
  items: { key: K; label: ReactNode }[];
  value: K;
  onChange: (key: K) => void;
  idPrefix: string;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, items.findIndex((i) => i.key === value));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    onChange(items[next].key);
    refs.current[next]?.focus();
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  return (
    <div className={`tabs ${className}`} role="tablist" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((item, i) => (
        <button
          key={item.key}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${item.key}`}
          aria-selected={item.key === value}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={item.key === value ? 0 : -1}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
