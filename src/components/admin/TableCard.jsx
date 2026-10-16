import Icon, { getTablePalette } from '../Icon.jsx'
import { btn } from './ui.js'

/** Tek masa kartı (Screen 11): Google rengi + doluluk çubuğu (dolunca kırmızı) + oturanlar + "Taşı"/"Sil" butonları. */
export default function TableCard({ table, onMove, onDelete }) {
  const pct = Math.round((table.count / table.capacity) * 100)
  const full = table.count >= table.capacity
  const palette = getTablePalette(table.number)

  return (
    <article
      className={`card flex flex-col p-5 ${palette.borderAccent}`}
      aria-label={`Masa ${table.number}`}
      data-testid={`table-${table.number}`}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className={`h-3 w-3 rounded-full ${palette.dot}`} aria-hidden="true" />
          <h3 className="font-heading text-xl font-bold text-[#202124] dark:text-[#E8EAED]">
            Masa {table.number}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            full
              ? 'bg-[#FCE8E6] text-[#C5221F] dark:bg-[#8C1D18]/50 dark:text-[#F28B82]'
              : `${palette.tonalBg} ${palette.tonalText}`
          }`}
        >
          {table.count}/{table.capacity}
        </span>
      </header>

      <p className="mt-1 min-h-5 truncate text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
        {table.theme}
      </p>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1F3F4] dark:bg-[#3C4043]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Masa ${table.number} doluluk`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            full ? 'bg-[#EA4335] dark:bg-[#F28B82]' : palette.barFill
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {table.members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between gap-2 rounded-xl border border-transparent bg-[#F8F9FA] px-3 py-1.5 transition-colors hover:border-[#DADCE0] dark:bg-[#202124]/60 dark:hover:border-[#5F6368]"
          >
            <span className="truncate text-sm font-medium text-[#202124] dark:text-[#E8EAED]">
              {m.name}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                id={`move-${m.id}`}
                type="button"
                className={btn.small}
                onClick={() => onMove(m, table.number)}
                aria-label={`${m.name} kişisini taşı`}
              >
                <Icon name="swap_horiz" className="text-[15px]" />
                <span>Taşı</span>
              </button>
              {onDelete && (
                <button
                  id={`delete-${m.id}`}
                  type="button"
                  className={btn.smallDanger}
                  onClick={() => onDelete(m)}
                  aria-label={`${m.name} kişisini sil`}
                  title="Katılımcıyı sil"
                >
                  <Icon name="delete" className="text-[15px]" />
                  <span>Sil</span>
                </button>
              )}
            </div>
          </li>
        ))}
        {table.members.length === 0 && (
          <li className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#DADCE0] py-6 text-sm font-medium text-[#5F6368] dark:border-[#5F6368] dark:text-[#9AA0A6]">
            <Icon name="event_seat" className="text-[18px]" />
            <span>Boş masa</span>
          </li>
        )}
      </ul>
    </article>
  )
}
