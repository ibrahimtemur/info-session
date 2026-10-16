import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QUESTIONS, isAnswered, localizeQuestion } from '../lib/questions.js'
import { join, NetworkError } from '../api/client.js'
import { useI18n } from '../lib/i18n.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import QuestionCard from '../components/QuestionCard.jsx'
import Icon from '../components/Icon.jsx'

/** Tek soru/ekran (Screen 3, 4, 5, 9), animasyonlu geçiş, cevapsız ilerleme engeli. */
export default function Quiz({ name, onDone, onBack }) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [errorKind, setErrorKind] = useState(null)
  const { lang, t } = useI18n()

  const q = localizeQuestion(QUESTIONS[index], lang)
  const value = answers[q.id]
  const last = index === QUESTIONS.length - 1
  const canGo = isAnswered(q, value)
  const skippable = q.optional && (value === undefined || value === null)

  const go = (d) => {
    setDir(d)
    setIndex((i) => i + d)
  }

  const submit = async () => {
    setSubmitting(true)
    setErrorKind(null)
    try {
      onDone(await join(name, answers))
    } catch (e) {
      setErrorKind(e instanceof NetworkError ? 'network' : 'generic')
      setSubmitting(false)
    }
  }

  const next = () => (last ? submit() : go(1))
  const back = () => (index === 0 ? onBack() : go(-1))
  const errorText =
    errorKind === 'network'
      ? t.quizNetworkError
      : errorKind === 'generic'
        ? t.quizGenericError
        : null

  return (
    <div className="flex flex-1 flex-col pt-1">
      <ProgressBar current={index} total={QUESTIONS.length} />

      <div className="relative mt-6 flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={q.id}
            custom={dir}
            variants={{
              enter: (d) => ({ x: d * 48, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d) => ({ x: d * -48, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <QuestionCard
              question={q}
              value={value}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {errorText && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-[#EA4335]/40 bg-[#FCE8E6] px-4 py-3 text-sm font-medium text-[#C5221F] dark:border-[#F28B82]/40 dark:bg-[#8C1D18] dark:text-[#F28B82]"
        >
          <Icon name="error" className="mt-0.5 text-[20px] shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {!canGo && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-[#5F6368] dark:text-[#9AA0A6]">
          <Icon name="touch_app" className="text-[16px]" />
          <span>{t.quizSelectPrompt}</span>
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 mt-4 flex items-center gap-3 border-t border-[#DADCE0]/70 bg-[#F8F9FA] px-5 pb-2 pt-3 dark:border-[#5F6368]/40 dark:bg-[#202124]">
        <button
          type="button"
          className="btn-ghost flex h-14 w-14 shrink-0 items-center justify-center"
          onClick={back}
          disabled={submitting}
          aria-label={t.back}
        >
          <Icon name="arrow_back" className="text-[22px]" />
        </button>
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={next}
          disabled={!canGo || submitting}
        >
          {submitting ? (
            <>
              <Icon name="hourglass_top" className="text-[20px]" />
              <span>{t.quizSearching}</span>
            </>
          ) : last ? (
            <>
              <span>{t.quizFinish}</span>
              <Icon name="table_restaurant" className="text-[20px]" />
            </>
          ) : skippable ? (
            <>
              <span>{t.quizSkip}</span>
              <Icon name="skip_next" className="text-[20px]" />
            </>
          ) : (
            <>
              <span>{t.quizNext}</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
