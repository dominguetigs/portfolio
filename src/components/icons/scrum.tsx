export function ScrumIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="8" y1="2" x2="8" y2="22" />
      <line x1="16" y1="2" x2="16" y2="22" />

      <rect x="3.5" y="5" width="3" height="2" rx="0.5" />
      <rect x="3.5" y="9" width="3" height="2" rx="0.5" />
      <rect x="3.5" y="13" width="3" height="2" rx="0.5" />
      <rect x="3.5" y="17" width="3" height="2" rx="0.5" />

      <rect x="10" y="5" width="4" height="2" rx="0.5" />
      <rect x="10" y="9" width="4" height="2" rx="0.5" />
      <rect x="10" y="13" width="4" height="2" rx="0.5" />

      <rect x="17.5" y="5" width="3" height="2" rx="0.5" />
      <rect x="17.5" y="9" width="3" height="2" rx="0.5" />
    </svg>
  );
}
