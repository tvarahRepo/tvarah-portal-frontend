interface ManaSangamLogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'light' | 'dark'
}

export default function ManaSangamLogo({ size = 'md', variant = 'dark' }: ManaSangamLogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.3 }
  const s = scales[size]
  const textColor = variant === 'light' ? '#ffffff' : '#0f2d5e'
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.7)' : '#0e7490'

  return (
    <svg
      width={Math.round(164 * s)}
      height={Math.round(44 * s)}
      viewBox="0 0 164 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mana Sangam"
    >
      {/* ── Icon mark: two rivers confluencing into one ── */}
      {/* Left stream */}
      <path
        d="M6 8 C6 8 8 16 14 20 C20 24 22 32 22 36"
        stroke="url(#grad-left)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right stream */}
      <path
        d="M26 8 C26 8 24 16 18 20 C12 24 10 32 10 36"
        stroke="url(#grad-right)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Confluence drop at bottom */}
      <circle cx="16" cy="38" r="3.5" fill="#F2C94C" />
      {/* Rupee accent dot at top */}
      <circle cx="16" cy="6" r="2.5" fill="#0e7490" opacity="0.6" />

      {/* Gradient defs */}
      <defs>
        <linearGradient id="grad-left" x1="6" y1="8" x2="22" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1565c0" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="grad-right" x1="26" y1="8" x2="10" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>
      </defs>

      {/* ── Wordmark ── */}
      <text
        x="38"
        y="24"
        fontFamily="'Inter', system-ui, -apple-system, sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.4"
        fill={textColor}
      >
        Mana Sangam
      </text>
      <text
        x="38"
        y="37"
        fontFamily="'Inter', system-ui, -apple-system, sans-serif"
        fontSize="9"
        fontWeight="500"
        letterSpacing="1.8"
        fill={subColor}
      >
        FINANCIAL SERVICES
      </text>
    </svg>
  )
}
