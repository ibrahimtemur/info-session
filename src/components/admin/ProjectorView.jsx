import { useEffect, useRef, useState } from 'react'
import { getTables } from '../../api/client.js'
import Icon, { getTablePalette, GoogleDots } from '../Icon.jsx'

const REFRESH_MS = 5000

/**
 * Projektör görünümü (Screen 13 - 1920x1080 koyu tema #202124):
 * Başlık "Masa Listesi", canlı göstergesi "Canlı · 14:32:05",
 * her masanın Google renginde büyük okunaklı kartlar ve altta "Bekleme listesi (X)" şeridi.
 */
export default function ProjectorView({ initial, onExit }) {
  const [data, setData] = useState(initial)
  const [updated, setUpdated] = useState(() => new Date())
  const [failed, setFailed] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const d = await getTables()
        if (!alive) return
        setData(d)
        setUpdated(new Date())
        setFailed(false)
      } catch {
        if (alive) setFailed(true)
      }
    }
    const timer = setInterval(tick, REFRESH_MS)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onExit()
    const onFs = () => !document.fullscreenElement && onExit()
    document.addEventListener('keydown', onKey)
    document.addEventListener('fullscreenchange', onFs)
    root.current?.requestFullscreen?.().catch(() => {})
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('fullscreenchange', onFs)
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [onExit])

  const time = updated.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div
      ref={root}
      id="projector-view"
      role="dialog"
      aria-label="Masa listesi"
      className="fixed inset-0 z-40 flex flex-col justify-between overflow-auto bg-[#202124] p-[2.2vmin] text-[#E8EAED]"
    >
      <div>
        <header className="mb-[2vmin] flex flex-wrap items-center justify-between gap-4 border-b border-[#5F6368]/40 pb-[1.5vmin]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-[#303134] px-3.5 py-2 border border-[#5F6368]/50">
              <span className="font-mono text-base font-bold text-[#8AB4F8]">&lt; &gt;</span>
              <GoogleDots />
              <span className="font-heading text-sm font-semibold text-[#9AA0A6]">
                GDG on Campus · Info Session
              </span>
            </div>
            <h1 className="font-heading text-[clamp(1.75rem,3.6vmin,3.5rem)] font-bold tracking-tight text-white">
              Masa Listesi
            </h1>
          </div>

          <div className="flex items-center gap-3 text-[clamp(0.85rem,1.5vmin,1.25rem)] font-semibold">
            {failed ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#F28B82]/40 bg-[#8C1D18]/60 px-4 py-2 text-[#F28B82]">
                <Icon name="wifi_off" className="text-[20px]" />
                <span>Bağlantı sorunu — son veri</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[#81C995]/40 bg-[#0D652D]/40 px-4 py-2 text-[#81C995]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34A853] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#34A853]" />
                </span>
                <span>Canlı · {time}</span>
              </span>
            )}
            <button
              id="projector-exit"
              type="button"
              onClick={onExit}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#5F6368] bg-[#303134] px-5 font-semibold text-[#E8EAED] transition-colors hover:bg-[#3C4043]"
            >
              <Icon name="close_fullscreen" className="text-[20px]" />
              <span>Kapat (Esc)</span>
            </button>
          </div>
        </header>

        <div className="grid gap-[1.6vmin] [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))]">
          {[...data.tables]
            .sort((a, b) => a.number - b.number)
            .map((t) => {
              const palette = getTablePalette(t.number)
              return (
                <section
                  key={t.number}
                  className="overflow-hidden rounded-2xl border border-[#5F6368]/60 bg-[#303134] shadow-sm"
                  data-testid={`projector-table-${t.number}`}
                >
                  <div className={`h-2 w-full ${palette.projectorTopStrip}`} />
                  <div className="p-[1.8vmin]">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2
                        className={`font-heading text-[clamp(1.5rem,3.2vmin,3rem)] font-bold ${palette.projectorHeading}`}
                      >
                        Masa {t.number}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-0.5 text-[clamp(0.85rem,1.6vmin,1.35rem)] font-bold ${palette.projectorBadge}`}
                      >
                        {t.count}/{t.capacity}
                      </span>
                    </div>
                    <p className="mb-[1.2vmin] mt-0.5 truncate text-[clamp(0.85rem,1.5vmin,1.25rem)] font-medium text-[#9AA0A6]">
                      {t.theme}
                    </p>
                    <ul className="space-y-1 text-[clamp(1.1rem,2.3vmin,2.1rem)] font-semibold leading-snug text-white">
                      {t.members.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center gap-2 truncate rounded-lg bg-[#202124]/60 px-3 py-1"
                        >
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${palette.dot}`}
                            aria-hidden="true"
                          />
                          <span className="truncate">{m.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )
            })}
        </div>

        {data.tables.length === 0 && (
          <div className="mt-[10vmin] flex flex-col items-center gap-3 text-center">
            <Icon name="table_restaurant" className="text-[64px] text-[#9AA0A6]" />
            <p className="font-heading text-[clamp(1.5rem,3.5vmin,3rem)] font-bold text-[#9AA0A6]">
              Henüz masa dağıtımı yapılmadı
            </p>
          </div>
        )}
      </div>

      {data.waitlist.length > 0 && (
        <section className="mt-[2vmin] flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FBBC04]/50 bg-[#303134] px-[2vmin] py-[1.4vmin]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBBC04]/20 text-[#FDD663]">
              <Icon name="schedule" className="text-[24px]" />
            </span>
            <h2 className="font-heading text-[clamp(1.1rem,2.2vmin,2rem)] font-bold text-[#FDD663]">
              Bekleme listesi ({data.waitlist.length})
            </h2>
          </div>
          <p className="flex-1 text-[clamp(1rem,2vmin,1.75rem)] font-semibold text-[#E8EAED]">
            {data.waitlist.map((w) => w.name).join(' · ')}
          </p>
        </section>
      )}
    </div>
  )
}
