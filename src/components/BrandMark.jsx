/**
 * The house mark: a cut diamond, the same figure that is stamped into the sill
 * plate of every car the marque builds. Drawn rather than set, so it holds its
 * weight at the loader's size and at the header's.
 */
export default function BrandMark({ className = '', size = '1em' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 1.4 22.6 12 12 22.6 1.4 12Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 6.4 17.6 12 12 17.6 6.4 12Z" fill="currentColor" />
    </svg>
  );
}
