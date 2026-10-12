import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ApiError,
  adminLogout,
  exportCsv,
  getTables,
  hasAdminToken,
  moveParticipant,
  deleteParticipant,
  rebalance,
  resetAll,
} from '../api/client.js'
import ThemeToggle from '../components/ThemeToggle.jsx'
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx'
import LoginForm from '../components/admin/LoginForm.jsx'
import MoveDialog from '../components/admin/MoveDialog.jsx'
import ProjectorView from '../components/admin/ProjectorView.jsx'
import TableCard from '../components/admin/TableCard.jsx'
import { btn, messageOf } from '../components/admin/ui.js'

/** /admin — parola kapısı + yönetim paneli. */
export default function Admin() {
  const [authed, setAuthed] = useState(hasAdminToken())

  useEffect(() => {
    const prev = document.title
    document.title = 'Admin · Info Session'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-4 sm:px-6">
      {authed ? (
        <Dashboard onLogout={() => setAuthed(false)} />
      ) : (
        <>
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
          <LoginForm onSuccess={() => setAuthed(true)} />
        </>
      )}
    </div>
  )
}

function Stat({ label, value, children }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide opacity-60">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
      {children}
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [moving, setMoving] = useState(null) // {member, from}
  const [deleting, setDeleting] = useState(null) // member
  const [confirm, setConfirm] = useState(null) // 'rebalance' | 'reset'
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [projector, setProjector] = useState(false)
  const toastTimer = useRef(null)

  const logout = useCallback(() => {
    adminLogout()
    onLogout()
  }, [onLogout])

  const notify = useCallback((text, kind = 'ok') => {
    setToast({ text, kind })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }, [])

  const load = useCallback(async () => {
    try {
      setData(await getTables())
      setLoadError(null)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return logout()
      setLoadError(messageOf(e))
    }
  }, [logout])

  useEffect(() => {
    load()
    const timer = setInterval(load, 15000)
    return () => clearInterval(timer)
  }, [load])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  /** Bir admin işlemini çalıştırır; 401'de oturumu kapatır, hatada toast gösterir. */
  const run = async (fn, okText) => {
    setBusy(true)
    try {
      const r = await fn()
      notify(typeof okText === 'function' ? okText(r) : okText)
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return logout()
      notify(messageOf(e), 'error')
    } finally {
      setBusy(false)
      setMoving(null)
      setDeleting(null)
      setConfirm(null)
      load()
    }
  }

  const downloadCsv = () =>
    run(async () => {
      const csv = await exportCsv()
      // BOM: Excel'in Türkçe karakterleri doğru okuması için
      const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `katilimcilar-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }, 'CSV indirildi 📄')

  const exitProjector = useCallback(() => setProjector(false), [])

  if (!data) {
    return (
      <p className="mt-24 text-center text-xl font-extrabold" role="status">
        {loadError ?? 'Yükleniyor… ☕'}
      </p>
    )
  }

  const { totals } = data
  const pct = Math.round(totals.occupancy * 100)

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black sm:text-3xl">🛠 Admin · Masa Yönetimi</h1>
        <div className="flex items-center gap-2">
          <button id="admin-logout" type="button" className={btn.ghost} onClick={logout}>
            Çıkış
          </button>
          <ThemeToggle />
        </div>
      </header>

      {loadError && (
        <p role="alert" className="mb-3 rounded-2xl bg-pop/15 px-4 py-2 text-sm font-extrabold text-pop">
          {loadError} — son veri gösteriliyor
        </p>
      )}

      <section aria-label="Özet" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Katılımcı" value={totals.participants} />
        <Stat label="Masada" value={`${totals.seated} · ${totals.tableCount} masa`} />
        <Stat label="Bekleme listesi" value={totals.waitlisted} />
        <Stat label="Doluluk" value={`%${pct}`}>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100 dark:bg-white/10"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Toplam doluluk"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs font-bold opacity-60">
            {totals.seated}/{totals.capacity} koltuk
          </p>
        </Stat>
      </section>

      <section aria-label="İşlemler" className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button id="admin-projector" type="button" className={btn.primary} onClick={() => setProjector(true)}>
          📺 Masa Listesi
        </button>
        <button id="admin-export" type="button" className={btn.ghost} onClick={downloadCsv} disabled={busy}>
          📄 CSV indir
        </button>
        <button
          id="admin-rebalance"
          type="button"
          className={btn.ghost}
          onClick={() => setConfirm('rebalance')}
          disabled={busy || totals.participants === 0}
        >
          🔀 Yeniden Dağıt
        </button>
        <button
          id="admin-reset"
          type="button"
          className={`${btn.danger} !bg-none`}
          onClick={() => setConfirm('reset')}
          disabled={busy || totals.participants === 0}
        >
          🗑 Sıfırla
        </button>
        <button id="admin-refresh" type="button" className={btn.ghost} onClick={load} disabled={busy}>
          ↻ Yenile
        </button>
      </section>

      <section aria-label="Masalar" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.tables.map((t) => (
          <TableCard
            key={t.number}
            table={t}
            onMove={(member, from) => setMoving({ member, from })}
            onDelete={(member) => setDeleting(member)}
          />
        ))}
      </section>
      {data.tables.length === 0 && (
        <p className="card mt-5 p-8 text-center text-lg font-extrabold opacity-80">Henüz katılımcı yok. İlk kayıt geldiğinde masalar burada görünür 🙂</p>
      )}

      {data.waitlist.length > 0 && (
        <section aria-label="Bekleme listesi" className="card mt-5 p-4" id="waitlist">
          <h2 className="text-lg font-black">⏳ Bekleme listesi ({data.waitlist.length})</h2>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.waitlist.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-2 rounded-xl px-2 py-0.5 hover:bg-brand-50 dark:hover:bg-white/5">
                <span className="truncate font-bold">
                  {w.position}. {w.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button id={`move-${w.id}`} type="button" className={btn.small} onClick={() => setMoving({ member: w, from: null })}>
                    Masaya al
                  </button>
                  <button
                    id={`delete-${w.id}`}
                    type="button"
                    className={btn.smallDanger}
                    onClick={() => setDeleting(w)}
                    aria-label={`${w.name} kişisini sil`}
                    title="Katılımcıyı sil"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {moving && (
        <MoveDialog
          member={moving.member}
          currentTable={moving.from}
          tables={data.tables}
          busy={busy}
          onClose={() => setMoving(null)}
          onPick={(n) =>
            run(() => moveParticipant(moving.member.id, n), `${moving.member.name} → Masa ${n} ✅`)
          }
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`${deleting.name} silinsin mi?`}
          confirmLabel="Evet, sil"
          danger
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            run(() => deleteParticipant(deleting.id), `${deleting.name} silindi 🗑`)
          }
        >
          <b>{deleting.name}</b> sistemden tamamen silinecek. Boşalan koltuğa başka biri oturabilir veya aynı cihazla yeniden kayıt olabilir. <b>Bu işlem geri alınamaz.</b>
        </ConfirmDialog>
      )}

      {confirm === 'rebalance' && (
        <ConfirmDialog
          title="Yeniden dağıtılsın mı?"
          confirmLabel="Yeniden Dağıt"
          busy={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() => run(rebalance, (r) => `Yeniden dağıtıldı: ${r.totals.seated} kişi, ${r.totals.tableCount} masa 🔀`)}
        >
          Tüm katılımcılar ({totals.participants} kişi) baştan eşleştirme algoritmasıyla dağıtılır. <b>Elle yaptığın taşımalar ve
          şu anki masa numaraları değişir.</b>
        </ConfirmDialog>
      )}

      {confirm === 'reset' && (
        <ConfirmDialog
          title="Tüm veriler silinsin mi?"
          confirmLabel="Evet, sıfırla"
          danger
          busy={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() => run(resetAll, 'Tüm katılımcılar silindi 🗑')}
        >
          {totals.participants} katılımcının tamamı ve masa yerleşimi silinir. <b>Bu işlem geri alınamaz.</b> Gerekirse önce CSV
          indir.
        </ConfirmDialog>
      )}

      {projector && <ProjectorView initial={data} onExit={exitProjector} />}

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-2xl px-4 py-3 text-center text-sm font-extrabold text-white shadow-xl ${
            toast.kind === 'error' ? 'bg-pop' : 'bg-brand-600'
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  )
}
