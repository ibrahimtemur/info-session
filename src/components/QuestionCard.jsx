import OptionCard from './OptionCard.jsx'
import SliderQuestion from './SliderQuestion.jsx'
import Icon, { TonalIcon } from './Icon.jsx'

/** Soru tipine göre doğru girdiyi gösterir: slider | cards | multi */
export default function QuestionCard({ question, value, onChange }) {
  const toggle = (v) => {
    const cur = Array.isArray(value) ? value : []
    if (cur.includes(v)) onChange(cur.filter((x) => x !== v))
    else if (cur.length < question.max) onChange([...cur, v])
  }
  const cur = Array.isArray(value) ? value : []

  return (
    <section aria-labelledby="q-title">
      <div className="mb-4 flex items-center justify-between">
        <TonalIcon name={question.icon || 'help'} tone={question.tone || 'blue'} size="lg" />
        {question.hint && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F0FE] px-3 py-1 text-xs font-semibold text-[#174EA6] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
            <Icon
              name={question.type === 'multi' ? 'checklist' : 'info'}
              className="text-[16px]"
            />
            {question.hint}
            {question.type === 'multi' && ` (${cur.length}/${question.max})`}
          </span>
        )}
      </div>
      <h2
        id="q-title"
        className="font-heading text-2xl font-bold leading-snug text-[#202124] dark:text-[#E8EAED]"
      >
        {question.text}
      </h2>
      {question.hint && (
        <p className="mt-1.5 text-sm text-[#5F6368] dark:text-[#9AA0A6]">{question.hint}</p>
      )}
      <div className="mt-6 flex flex-col gap-3">
        {question.type === 'slider' && (
          <SliderQuestion question={question} value={value} onChange={onChange} />
        )}
        {question.type === 'cards' &&
          question.options.map((o) => (
            <OptionCard
              key={o.value}
              {...o}
              selected={value === o.value}
              onClick={() => onChange(question.optional && value === o.value ? undefined : o.value)}
            />
          ))}
        {question.type === 'multi' &&
          question.options.map((o) => (
            <OptionCard
              key={o.value}
              {...o}
              selected={cur.includes(o.value)}
              disabled={!cur.includes(o.value) && cur.length >= question.max}
              onClick={() => toggle(o.value)}
            />
          ))}
      </div>
    </section>
  )
}
