/** The Thinkstead mark (Thinkstead.svg), inlined so it needs no request and scales crisply. */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="17" fill="#171e2e" />
      <path d="M14 19h36M32 19v29" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="14" cy="46" r="5" fill="#a9f1d2" />
      <circle cx="50" cy="46" r="5" fill="#a8aaff" />
    </svg>
  );
}

export function Brand({ size = 32 }: { size?: number }) {
  return (
    <>
      <BrandMark size={size} />
      <span className="brand-name" translate="no">
        thinkstead<span className="brand-dot">.</span>
      </span>
    </>
  );
}
