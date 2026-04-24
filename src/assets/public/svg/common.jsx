export const PlusIcon = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="purpleGradient" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E6B6FF" />
        <stop offset="100%" stopColor="#9B4DCC" />
      </radialGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.25" />
      </filter>
    </defs>

    <circle
      cx="100"
      cy="100"
      r="90"
      fill="url(#purpleGradient)"
      filter="url(#shadow)"
    />

    <rect x="90" y="45" width="20" height="110" rx="10" fill="#FFFFFF" />

    <rect x="45" y="90" width="110" height="20" rx="10" fill="#FFFFFF" />
  </svg>
);

export const HamburgerIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="36" height="36" rx="4" className="icon-bg" />

    <line x1="8" y1="12" x2="32" y2="12" className="line top" />
    <line x1="8" y1="20" x2="24" y2="20" className="line middle" />
    <line x1="8" y1="28" x2="32" y2="28" className="line bottom" />
  </svg>
);
