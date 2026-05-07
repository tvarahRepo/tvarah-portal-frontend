interface TvarahLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark'
}

export default function TvarahLogo({ size = 'md', variant = 'dark' }: TvarahLogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.3, xl: 1.5 }
  const s = scales[size]
  const textColor = variant === 'light' ? '#ffffff' : '#0F172A'
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.6)' : '#6366F1'

  return (
    <svg
      width={Math.round(160 * s)}
      height={Math.round(44 * s)}
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tvarah"
    >
      <defs>
        <linearGradient id="tvarah-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect x="4" y="14" width="28" height="6" rx="3" fill="url(#tvarah-grad)" opacity="0.35" />
      <rect x="4" y="22" width="28" height="6" rx="3" fill="url(#tvarah-grad)" opacity="0.65" />
      <rect x="4" y="30" width="28" height="6" rx="3" fill="url(#tvarah-grad)" />
      <text x="40" y="27" fontFamily="'Inter', system-ui, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-0.5" fill={textColor}>
        Tvarah
      </text>
      <text x="40" y="38" fontFamily="'Inter', system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="2" fill={subColor}>
        TALENT PLATFORM
      </text>
    </svg>
  )
}
