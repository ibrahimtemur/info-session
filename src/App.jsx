import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { dev, getResult } from './api/client.js'
import OfflineBanner from './components/OfflineBanner.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Icon, { DesignerCredit, GdgBrandMark, TonalIcon } from './components/Icon.jsx'
import { LanguageToggle, useI18n } from './lib/i18n.jsx'
import Welcome from './pages/Welcome.jsx'
import Name from './pages/Name.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'

// Geliştirici araçları sadece ?dev=1 ile ve mock modunda görünür
const SHOW_DEV = dev && new URLSearchParams(location.search).get('dev') === '1'

const Admin = lazy(() => import('./pages/Admin.jsx'))
const isAdminRoute = () => location.pathname.replace(/\/+$/, '') === '/admin'

/** Basit yol ayrımı: /admin -> yönetim paneli, diğer her şey katılımcı akışı. */
export default function App() {
  const { t } = useI18n()
  if (isAdminRoute()) {
    return (
      <Suspense
        fallback={
          <div className="mt-24 flex flex-col items-center gap-3 text-center">
            <TonalIcon name="hourglass_top" tone="blue" size="lg" />
            <p className="font-heading text-lg font-semibold text-[#5F6368] dark:text-[#9AA0A6]">
              {t.loading}
            </p>
          </div>
        }
      >
        <Admin />
      </Suspense>
    )
  }
  return <Participant />
}

function Participant() {
  const [step, setStep] = useState('loading')
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const { t } = useI18n()

  // Açılışta bu cihaz daha önce katıldı mı? Evetse doğrudan sonuç.
  useEffect(() => {
    getResult()
      .then((r) => {
        if (r) {
          setResult({ ...r, alreadyJoined: true })
          setStep('result')
        } else setStep('welcome')
      })
      .catch(() => setStep('welcome'))
  }, [])

  const refresh = async () => {
    const r = await dev.seed(30)
    if (r) setResult({ ...r, alreadyJoined: true })
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-5 pt-4">
      <OfflineBanner />
      <header className="mb-4 flex items-center justify-between gap-2">
        <GdgBrandMark />
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={step}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {step === 'loading' && (
            <div className="m-auto flex flex-col items-center gap-3">
              <TonalIcon name="local_cafe" tone="blue" size="lg" />
              <p className="font-heading text-base font-semibold text-[#5F6368] dark:text-[#9AA0A6]">
                {t.loading}
              </p>
            </div>
          )}
          {step === 'welcome' && <Welcome onStart={() => setStep('name')} />}
          {step === 'name' && (
            <Name
              initial={name}
              onBack={() => setStep('welcome')}
              onNext={(n) => {
                setName(n)
                setStep('quiz')
              }}
            />
          )}
          {step === 'quiz' && (
            <Quiz
              name={name}
              onBack={() => setStep('name')}
              onDone={(r) => {
                setResult(r)
                setStep('result')
              }}
            />
          )}
          {step === 'result' && result && <Result result={result} onResultUpdate={setResult} />}
        </motion.main>
      </AnimatePresence>

      {SHOW_DEV && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-[#DADCE0] bg-white p-3 text-xs font-semibold dark:border-[#5F6368] dark:bg-[#303134]">
          <span className="inline-flex flex-1 items-center gap-1.5 text-[#5F6368] dark:text-[#9AA0A6]">
            <Icon name="build" className="text-[18px]" />
            DEV
          </span>
          <button
            id="dev-seed"
            type="button"
            className="rounded-full bg-[#E8F0FE] px-3.5 py-2 font-semibold text-[#174EA6] transition-colors hover:bg-[#D2E3FC] dark:bg-[#174EA6]/40 dark:text-[#8AB4F8]"
            onClick={refresh}
          >
            {t.devAddFake}
          </button>
          <button
            id="dev-reset"
            type="button"
            className="rounded-full bg-[#FCE8E6] px-3.5 py-2 font-semibold text-[#C5221F] transition-colors hover:bg-[#FAD2CF] dark:bg-[#8C1D18]/40 dark:text-[#F28B82]"
            onClick={() => {
              dev.reset()
              location.reload()
            }}
          >
            {t.devReset}
          </button>
        </div>
      )}

      {(step === 'welcome' || step === 'result') && <DesignerCredit />}
    </div>
  )
}
