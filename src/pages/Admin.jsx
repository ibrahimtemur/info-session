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
  seedParticipants,
} from '../api/client.js'
import ThemeToggle from '../components/ThemeToggle.jsx'
import Icon, { DesignerCredit, GdgBrandMark, TonalIcon } from '../components/Icon.jsx'
import { LanguageToggle, useI18n } from '../lib/i18n.jsx'
import ConfirmDialog from '../components/admin/ConfirmDialog.jsx'
import LoginForm from '../components/admin/LoginForm.jsx'
import MoveDialog from '../components/admin/MoveDialog.jsx'
import ProjectorView from '../components/admin/ProjectorView.jsx'
import TableCard from '../components/admin/TableCard.jsx'
import { btn, messageOf } from '../components/admin/ui.js'

/** /admin — parola kapısı + yönetim paneli (Screen 10 & 11). */
export default function Admin() {
  const [authed, setAuthed] = useState(hasAdminToken())
  const { t } = useI18n()

  useEffect(() => {
    const prev = document.title
    document.title = t.adminDocTitle
    return () => {
      document.title = prev
    }
  }, [t.adminDocTitle])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1440px] flex-col justify-between px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div>
        {authed ? (
          <Dashboard onLogout={() => setAuthed(false)} />
        ) : (
          <>
            <header className="flex items-center justify-between">
              <GdgBrandMark />
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </header>
            <LoginForm onSuccess={() => setAuthed(true)} />
          </>
        )}
      </div>
      <DesignerCredit className="pt-8" />
    </div>
  )
}

function Stat({ label, value, icon, tone = 'blue' }) {
  return (
    <div className="card flex items-center justify-between gap-3 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] dark:text-[#9AA0A6]">
          {label}
        </p>
        <p className="font-heading mt-1 text-2xl font-bold text-[#202124] sm:text-3xl dark:text-[#E8EAED]">
          {value}
        </p>
      </div>
      <TonalIcon name={icon} tone={tone} size="md" />
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [moving, setMoving] = useState(null) // {member, from}
  const [deleting, setDeleting] = useState(null) // member
  const [confirm, setConfirm] = useState(null) // 'rebalance' | 'reset' | 'seed'
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [projector, setProjector] = useState(false)
  const toastTimer = useRef(null)
  const { lang, t } = useI18n()

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
      setLoadError(messageOf(e, lang))
    }
  }, [logout, lang])

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
      notify(messageOf(e, lang), 'error')
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
      a.download = `${t.csvFilenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }, t.toastCsvDownloaded)

  const exitProjector = useCallback(() => setProjector(false), [])

  if (!data) {
    return (
      <div className="mt-24 flex flex-col items-center gap-3 text-center" role="status">
        <TonalIcon name="hourglass_top" tone="blue" size="lg" />
        <p className="font-heading text-lg font-semibold text-[#5F6368] dark:text-[#9AA0A6]">
          {loadError ?? t.loading}
        </p>
      </div>
    )
  }

  const { totals } = data

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#DADCE0] pb-4 dark:border-[#5F6368]/50">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <GdgBrandMark />
          <span className="hidden text-[#DADCE0] sm:inline dark:text-[#5F6368]">|</span>
          <h1 className="font-heading text-xl font-bold text-[#202124] sm:text-2xl dark:text-[#E8EAED]">
            {t.adminTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button id="admin-logout" type="button" className={btn.ghost} onClick={logout}>
            <Icon name="logout" className="text-[18px]" />
            <span>{t.adminLogout}</span>
          </button>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {loadError && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2.5 rounded-2xl border border-[#EA4335]/40 bg-[#FCE8E6] px-4 py-3 text-sm font-medium text-[#C5221F] dark:border-[#F28B82]/40 dark:bg-[#8C1D18] dark:text-[#F28B82]"
        >
          <Icon name="error" className="text-[20px] shrink-0" />
          <span>
            {loadError} — {t.adminStaleData}
          </span>
        </div>
      )}

      {/* 4 Özet İstatistik Kartı */}
      <section aria-label={t.adminSummaryAria} className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Stat label={t.statParticipants} value={totals.participants} icon="groups" tone="blue" />
        <Stat
          label={t.statSeated}
          value={t.statSeatedVal(totals.seated, totals.tableCount)}
          icon="table_restaurant"
          tone="green"
        />
        <Stat
          label={t.statWaiting}
          value={totals.waiting ?? 0}
          icon="hourglass_top"
          tone="yellow"
        />
        <Stat
          label={t.statWaitlist}
          value={totals.waitlisted}
          icon="schedule"
          tone="red"
        />
      </section>

      {/* Dağıtım Bekleyenler Mavi Tonal Banner */}
      {(totals.waiting ?? 0) > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#4285F4]/35 bg-[#E8F0FE] p-5 text-[#174EA6] dark:border-[#8AB4F8]/35 dark:bg-[#174EA6]/30 dark:text-[#E8EAED]">
          <div className="flex items-center gap-3.5">
            <TonalIcon
              name="pending_actions"
              tone="blue"
              size="md"
              className="bg-white dark:bg-[#303134]"
            />
            <div>
              <p className="font-heading text-base font-bold sm:text-lg">
                {t.bannerWaitingTitle(totals.waiting)}
              </p>
              <p className="text-xs font-medium text-[#174EA6]/80 dark:text-[#9AA0A6]">
                {t.bannerWaitingSub}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={btn.primary}
            onClick={() => setConfirm('rebalance')}
            disabled={busy}
          >
            <Icon name="auto_awesome" className="text-[18px]" />
            <span>
              {data.tables.length === 0 ? t.btnDistributeTables : t.btnUpdateDistribution} (
              {t.personCount(totals.waiting)})
            </span>
          </button>
        </div>
      )}

      {/* Aksiyon Araç Çubuğu */}
      <section
        aria-label={t.actionsAria}
        className="mt-5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap"
      >
        <button
          id="admin-projector"
          type="button"
          className={btn.primary}
          onClick={() => setProjector(true)}
        >
          <Icon name="tv" className="text-[18px]" />
          <span>{t.btnProjector}</span>
        </button>
        <button
          id="admin-export"
          type="button"
          className={btn.ghost}
          onClick={downloadCsv}
          disabled={busy}
        >
          <Icon name="download" className="text-[18px]" />
          <span>{t.btnExportCsv}</span>
        </button>
        <button
          id="admin-rebalance"
          type="button"
          className={
            data.tables.length === 0 || (totals.waiting ?? 0) > 0 ? btn.primary : btn.ghost
          }
          onClick={() => setConfirm('rebalance')}
          disabled={busy || totals.participants === 0}
        >
          <Icon name="shuffle" className="text-[18px]" />
          <span>
            {data.tables.length === 0
              ? t.btnDistributeTables
              : (totals.waiting ?? 0) > 0
                ? t.btnRedistributeNew(totals.waiting)
                : t.btnRedistribute}
          </span>
        </button>
        <button
          id="admin-seed"
          type="button"
          className={btn.ghost}
          onClick={() => setConfirm('seed')}
          disabled={busy}
          title={t.btnSimulateTitle}
        >
          <Icon name="science" className="text-[18px]" />
          <span>{t.btnSimulate}</span>
        </button>
        <button
          id="admin-reset"
          type="button"
          className={btn.danger}
          onClick={() => setConfirm('reset')}
          disabled={busy || totals.participants === 0}
        >
          <Icon name="delete_forever" className="text-[18px]" />
          <span>{t.btnReset}</span>
        </button>
        <button
          id="admin-refresh"
          type="button"
          className={btn.ghost}
          onClick={load}
          disabled={busy}
        >
          <Icon name="refresh" className="text-[18px]" />
          <span>{t.btnRefresh}</span>
        </button>
      </section>

      {/* Masa Kartları Izgarası */}
      <section
        aria-label={t.tablesAria}
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {[...data.tables]
          .sort((a, b) => a.number - b.number)
          .map((tbl) => (
            <TableCard
              key={tbl.number}
              table={tbl}
              onMove={(member, from) => setMoving({ member, from })}
              onDelete={(member) => setDeleting(member)}
            />
          ))}
      </section>

      {data.tables.length === 0 && (
        <div className="card mt-6 p-8 text-center">
          {(totals.waiting ?? 0) > 0 ? (
            <div className="flex flex-col items-center">
              <TonalIcon name="groups" tone="blue" size="lg" />
              <p className="font-heading mt-4 text-xl font-bold text-[#202124] dark:text-[#E8EAED]">
                {t.emptyPoolReadyTitle(totals.waiting)}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#5F6368] dark:text-[#9AA0A6]">
                {t.emptyPoolReadySub}
              </p>
              <button
                type="button"
                className={`${btn.primary} mt-5 px-6`}
                onClick={() => setConfirm('rebalance')}
                disabled={busy}
              >
                <Icon name="auto_awesome" className="text-[18px]" />
                <span>
                  {t.btnDistributeTables} ({t.personCount(totals.waiting)})
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <TonalIcon name="event_seat" tone="neutral" size="lg" />
              <p className="font-heading mt-2 text-base font-semibold text-[#5F6368] dark:text-[#9AA0A6]">
                {t.emptyNoParticipants}
              </p>
            </div>
          )}
        </div>
      )}

      {data.waiting && data.waiting.length > 0 && (
        <section aria-label={t.waitingPoolAria} className="card mt-6 p-5" id="waiting-pool">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <TonalIcon name="hourglass_top" tone="yellow" size="sm" />
              <h2 className="font-heading text-lg font-bold text-[#202124] dark:text-[#E8EAED]">
                {t.waitingPoolHeading(data.waiting.length)}
              </h2>
            </div>
            <span className="rounded-full bg-[#FEF7E0] px-3 py-1 text-xs font-semibold text-[#B06000] dark:bg-[#7A4B00]/40 dark:text-[#FDD663]">
              {t.waitingPoolBadge}
            </span>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.waiting.map((w, idx) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#DADCE0]/70 bg-[#F8F9FA] px-3 py-2 dark:border-[#5F6368]/50 dark:bg-[#202124]/60"
              >
                <span className="truncate text-sm font-medium text-[#202124] dark:text-[#E8EAED]">
                  {idx + 1}. {w.name}
                </span>
                <button
                  id={`delete-${w.id}`}
                  type="button"
                  className={btn.smallDanger}
                  onClick={() => setDeleting(w)}
                  aria-label={t.ariaDeletePerson(w.name)}
                  title={t.titleDeletePerson}
                >
                  <Icon name="delete" className="text-[15px]" />
                  <span>{t.btnDelete}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.waitlist.length > 0 && (
        <section aria-label={t.waitlistAria} className="card mt-6 p-5" id="waitlist">
          <div className="flex items-center gap-2.5">
            <TonalIcon name="schedule" tone="red" size="sm" />
            <h2 className="font-heading text-lg font-bold text-[#202124] dark:text-[#E8EAED]">
              {t.waitlistHeading(data.waitlist.length)}
            </h2>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.waitlist.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#DADCE0]/70 bg-[#F8F9FA] px-3 py-2 dark:border-[#5F6368]/50 dark:bg-[#202124]/60"
              >
                <span className="truncate text-sm font-medium text-[#202124] dark:text-[#E8EAED]">
                  {w.position}. {w.name}
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    id={`move-${w.id}`}
                    type="button"
                    className={btn.small}
                    onClick={() => setMoving({ member: w, from: null })}
                  >
                    <Icon name="swap_horiz" className="text-[15px]" />
                    <span>{t.btnSeatFromWaitlist}</span>
                  </button>
                  <button
                    id={`delete-${w.id}`}
                    type="button"
                    className={btn.smallDanger}
                    onClick={() => setDeleting(w)}
                    aria-label={t.ariaDeletePerson(w.name)}
                    title={t.titleDeletePerson}
                  >
                    <Icon name="delete" className="text-[15px]" />
                    <span>{t.btnDelete}</span>
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
            run(() => moveParticipant(moving.member.id, n), t.toastMoved(moving.member.name, n))
          }
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t.deleteDialogTitle(deleting.name)}
          confirmLabel={t.deleteConfirmBtn}
          danger
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={() =>
            run(() => deleteParticipant(deleting.id), t.toastDeleted(deleting.name))
          }
        >
          <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
            {deleting.name}
          </strong>{' '}
          {t.deleteDialogBody1}{' '}
          <strong className="font-semibold text-[#C5221F] dark:text-[#F28B82]">
            {t.irreversibleWarning}
          </strong>
        </ConfirmDialog>
      )}

      {confirm === 'rebalance' && (
        <ConfirmDialog
          title={
            data.tables.length === 0 ? t.rebalanceDialogTitleInitial : t.rebalanceDialogTitleAgain
          }
          confirmLabel={data.tables.length === 0 ? t.btnDistributeTables : t.btnRedistribute}
          busy={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() =>
            run(rebalance, (r) =>
              data.tables.length === 0
                ? t.toastDistributed(r.totals.seated, r.totals.tableCount)
                : t.toastRedistributed(r.totals.seated, r.totals.tableCount),
            )
          }
        >
          {data.tables.length === 0 ? (
            <>
              {t.rebalanceBodyInitialPrefix}
              <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
                {t.rebalanceBodyInitialCount(totals.participants)}
              </strong>
              {t.rebalanceBodyInitialSuffix}
            </>
          ) : (
            <>
              {t.rebalanceBodyAgainPrefix(totals.participants)}
              <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
                {t.rebalanceBodyAgainStrong}
              </strong>
            </>
          )}
        </ConfirmDialog>
      )}

      {confirm === 'seed' && (
        <ConfirmDialog
          title={t.seedDialogTitle}
          confirmLabel={t.seedConfirmBtn}
          busy={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() => run(() => seedParticipants(30), t.toastSimulated)}
        >
          {t.seedBodyIntroPrefix}
          <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
            {t.seedBodyIntroStrong}
          </strong>
          {t.seedBodyIntroSuffix}
          {data.tables.length === 0 ? (
            <>
              <br />
              <br />
              {t.seedBodyPool1}
              <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
                {t.seedBodyPoolStrong1}
              </strong>
              {t.seedBodyPool2}
              <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
                {t.seedBodyPoolStrong2}
              </strong>
              {t.seedBodyPool3}
            </>
          ) : (
            <>
              <br />
              <br />
              {t.seedBodyDirect}
            </>
          )}
          <br />
          <br />
          {t.seedBodyFooter1}
          <strong className="font-semibold">{t.seedBodyFooterStrong}</strong>
          {t.seedBodyFooter2}
        </ConfirmDialog>
      )}

      {confirm === 'reset' && (
        <ConfirmDialog
          title={t.resetDialogTitle}
          confirmLabel={t.resetConfirmBtn}
          danger
          busy={busy}
          onCancel={() => setConfirm(null)}
          onConfirm={() => run(resetAll, t.toastReset)}
        >
          {t.resetBodyPrefix(totals.participants)}
          <strong className="font-semibold text-[#C5221F] dark:text-[#F28B82]">
            {t.irreversibleWarning}
          </strong>
          {t.resetBodySuffix}
        </ConfirmDialog>
      )}

      {projector && <ProjectorView initial={data} onExit={exitProjector} />}

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-sm font-semibold text-white shadow-lg ${
            toast.kind === 'error'
              ? 'bg-[#EA4335]'
              : 'bg-[#202124] dark:bg-[#E8EAED] dark:text-[#202124]'
          }`}
        >
          <Icon
            name={toast.kind === 'error' ? 'error' : 'check_circle'}
            className="text-[18px]"
          />
          <span>{toast.text}</span>
        </div>
      )}
    </>
  )
}
