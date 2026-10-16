/**
 * Material Symbols Rounded ikon bileşeni, renkli tonal daire sarmalayıcısı,
 * GDG on Campus marka başlığı ve masa rengi (tableNumber mod 4) yardımcıları.
 */

export const TONE_STYLES = {
  blue: 'bg-[#E8F0FE] text-[#174EA6] dark:bg-[#174EA6]/40 dark:text-[#8AB4F8]',
  red: 'bg-[#FCE8E6] text-[#C5221F] dark:bg-[#8C1D18]/40 dark:text-[#F28B82]',
  yellow: 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#7A4B00]/40 dark:text-[#FDD663]',
  green: 'bg-[#E6F4EA] text-[#137333] dark:bg-[#0D652D]/40 dark:text-[#81C995]',
  neutral: 'bg-[#F1F3F4] text-[#5F6368] dark:bg-[#3C4043] dark:text-[#9AA0A6]',
}

/**
 * Her masa (tableNumber mod 4) dört Google renginden biriyle tanımlanır:
 * 0 -> Mavi (Masa 4, 8, 12)
 * 1 -> Kırmızı (Masa 1, 5, 9)
 * 2 -> Sarı (Masa 2, 6, 10)
 * 3 -> Yeşil (Masa 3, 7, 11)
 */
const TABLE_PALETTES = [
  {
    key: 'blue',
    hex: '#4285F4',
    darkHex: '#8AB4F8',
    tonalBg: 'bg-[#E8F0FE] dark:bg-[#174EA6]/35',
    tonalText: 'text-[#174EA6] dark:text-[#8AB4F8]',
    borderAccent: 'border-t-4 border-t-[#4285F4]',
    projectorBorder: 'border-[#4285F4]',
    projectorTopStrip: 'bg-[#4285F4]',
    projectorHeading: 'text-[#8AB4F8]',
    projectorBadge: 'bg-[#4285F4]/20 text-[#8AB4F8] border border-[#4285F4]/40',
    heroBg: 'bg-[#4285F4] text-white dark:bg-[#174EA6] dark:text-[#E8EAED] dark:border dark:border-[#8AB4F8]/40',
    heroChip: 'bg-white/20 text-white dark:bg-[#303134]/70 dark:text-[#8AB4F8]',
    barFill: 'bg-[#4285F4] dark:bg-[#8AB4F8]',
    dot: 'bg-[#4285F4]',
  },
  {
    key: 'red',
    hex: '#EA4335',
    darkHex: '#F28B82',
    tonalBg: 'bg-[#FCE8E6] dark:bg-[#8C1D18]/35',
    tonalText: 'text-[#C5221F] dark:text-[#F28B82]',
    borderAccent: 'border-t-4 border-t-[#EA4335]',
    projectorBorder: 'border-[#EA4335]',
    projectorTopStrip: 'bg-[#EA4335]',
    projectorHeading: 'text-[#F28B82]',
    projectorBadge: 'bg-[#EA4335]/20 text-[#F28B82] border border-[#EA4335]/40',
    heroBg: 'bg-[#EA4335] text-white dark:bg-[#8C1D18] dark:text-[#E8EAED] dark:border dark:border-[#F28B82]/40',
    heroChip: 'bg-white/20 text-white dark:bg-[#303134]/70 dark:text-[#F28B82]',
    barFill: 'bg-[#EA4335] dark:bg-[#F28B82]',
    dot: 'bg-[#EA4335]',
  },
  {
    key: 'yellow',
    hex: '#FBBC04',
    darkHex: '#FDD663',
    tonalBg: 'bg-[#FEF7E0] dark:bg-[#7A4B00]/35',
    tonalText: 'text-[#B06000] dark:text-[#FDD663]',
    borderAccent: 'border-t-4 border-t-[#FBBC04]',
    projectorBorder: 'border-[#FBBC04]',
    projectorTopStrip: 'bg-[#FBBC04]',
    projectorHeading: 'text-[#FDD663]',
    projectorBadge: 'bg-[#FBBC04]/20 text-[#FDD663] border border-[#FBBC04]/40',
    heroBg: 'bg-[#FBBC04] text-[#202124] dark:bg-[#7A4B00] dark:text-[#E8EAED] dark:border dark:border-[#FDD663]/40',
    heroChip: 'bg-[#202124]/12 text-[#202124] dark:bg-[#303134]/70 dark:text-[#FDD663]',
    barFill: 'bg-[#FBBC04] dark:bg-[#FDD663]',
    dot: 'bg-[#FBBC04]',
  },
  {
    key: 'green',
    hex: '#34A853',
    darkHex: '#81C995',
    tonalBg: 'bg-[#E6F4EA] dark:bg-[#0D652D]/35',
    tonalText: 'text-[#137333] dark:text-[#81C995]',
    borderAccent: 'border-t-4 border-t-[#34A853]',
    projectorBorder: 'border-[#34A853]',
    projectorTopStrip: 'bg-[#34A853]',
    projectorHeading: 'text-[#81C995]',
    projectorBadge: 'bg-[#34A853]/20 text-[#81C995] border border-[#34A853]/40',
    heroBg: 'bg-[#34A853] text-white dark:bg-[#0D652D] dark:text-[#E8EAED] dark:border dark:border-[#81C995]/40',
    heroChip: 'bg-white/20 text-white dark:bg-[#303134]/70 dark:text-[#81C995]',
    barFill: 'bg-[#34A853] dark:bg-[#81C995]',
    dot: 'bg-[#34A853]',
  },
]

export function getTablePalette(tableNumber = 0) {
  const idx = Math.abs(Number(tableNumber) || 0) % 4
  return TABLE_PALETTES[idx]
}

export default function Icon({ name, filled = false, className = '', size }) {
  return (
    <span
      aria-hidden="true"
      style={size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : undefined}
      className={`material-symbols-rounded ${filled ? 'icon-filled' : ''} ${className}`}
    >
      {name}
    </span>
  )
}

export function TonalIcon({ name, tone = 'blue', filled = false, size = 'md', className = '' }) {
  const dims =
    size === 'sm'
      ? 'h-9 w-9 text-[20px]'
      : size === 'lg'
        ? 'h-14 w-14 text-[28px]'
        : 'h-11 w-11 text-[22px]'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${dims} ${
        TONE_STYLES[tone] || TONE_STYLES.blue
      } ${className}`}
    >
      <Icon name={name} filled={filled} />
    </span>
  )
}

export function GoogleDots({ className = '' }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-1 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#4285F4]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#EA4335]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#FBBC04]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#34A853]" />
    </span>
  )
}

export function GdgBrandMark({ subtitle }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="flex items-center gap-1.5 rounded-lg bg-[#E8F0FE] px-2 py-1 dark:bg-[#3C4043]">
        <span className="font-mono text-xs font-bold tracking-tighter text-[#4285F4] dark:text-[#8AB4F8]">
          &lt; &gt;
        </span>
        <GoogleDots />
      </div>
      <div className="min-w-0">
        <span className="font-heading block truncate text-sm font-semibold tracking-tight text-[#202124] sm:text-base dark:text-[#E8EAED]">
          GDG on Campus · {subtitle || 'Info Session'}
        </span>
      </div>
    </div>
  )
}

export function DesignerCredit({ className = '' }) {
  return (
    <footer
      className={`mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium tracking-wide text-[#5F6368]/75 dark:text-[#9AA0A6]/70 ${className}`}
    >
      <span>Tasarım</span>
      <span aria-hidden="true" className="text-[#DADCE0] dark:text-[#5F6368]">
        ·
      </span>
      <a
        href="https://github.com/ibrahimtemur"
        target="_blank"
        rel="noreferrer"
        className="font-heading font-semibold text-[#5F6368] transition-colors hover:text-[#4285F4] dark:text-[#9AA0A6] dark:hover:text-[#8AB4F8]"
      >
        İbrahim Temur
      </a>
    </footer>
  )
}
