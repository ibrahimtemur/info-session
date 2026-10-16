import { getTablePalette } from '../Icon.jsx'
import Modal from './Modal.jsx'
import { btn } from './ui.js'

/** Katılımcıyı taşı modalı (Screen 12): Dolu ve mevcut masa seçilemez. */
export default function MoveDialog({ member, currentTable, tables, busy, onPick, onClose }) {
  return (
    <Modal title={`Katılımcıyı taşı · ${member.name}`} onClose={onClose} id="move-dialog">
      <p className="mb-4 text-sm text-[#5F6368] dark:text-[#9AA0A6]">
        {currentTable ? `Şu an: Masa ${currentTable}` : 'Şu an: Bekleme listesinde'} · Hedef masayı
        seçin
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {[...tables]
          .sort((a, b) => a.number - b.number)
          .map((t) => {
            const full = t.count >= t.capacity
            const here = t.number === currentTable
            const palette = getTablePalette(t.number)
            return (
              <button
                key={t.number}
                id={`move-to-${t.number}`}
                type="button"
                disabled={busy || full || here}
                onClick={() => onPick(t.number)}
                className="flex flex-col items-start gap-1 rounded-2xl border border-[#DADCE0] bg-[#F8F9FA] p-3.5 text-left transition-colors hover:border-[#4285F4] hover:bg-[#E8F0FE]/60 disabled:cursor-not-allowed disabled:opacity-45 dark:border-[#5F6368] dark:bg-[#202124] dark:hover:border-[#8AB4F8] dark:hover:bg-[#174EA6]/30"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-heading flex items-center gap-2 text-sm font-bold text-[#202124] dark:text-[#E8EAED]">
                    <span className={`h-2.5 w-2.5 rounded-full ${palette.dot}`} />
                    Masa {t.number}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    full
                      ? 'text-[#EA4335] dark:text-[#F28B82]'
                      : 'text-[#5F6368] dark:text-[#9AA0A6]'
                  }`}
                >
                  {here ? 'Mevcut masa' : full ? 'Dolu' : `${t.count}/${t.capacity} dolu`}
                </span>
              </button>
            )
          })}
      </div>
      <div className="mt-6 flex justify-end">
        <button id="move-cancel" type="button" className={btn.ghost} onClick={onClose}>
          Vazgeç
        </button>
      </div>
    </Modal>
  )
}
