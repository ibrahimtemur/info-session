import { motion } from 'framer-motion'

/** 1-5 arası, tek elle dokunması kolay 5 eşit dairesel ölçek butonu. */
export default function SliderQuestion({ question, value, onChange }) {
  const values = Array.from({ length: question.max - question.min + 1 }, (_, i) => question.min + i)
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-2">
        {values.map((v) => {
          const selected = value === v
          return (
            <motion.button
              key={v}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onChange(v)}
              aria-label={`${v} / ${question.max}`}
              aria-pressed={selected}
              className={`font-heading flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold transition-all ${
                selected
                  ? 'bg-[#4285F4] text-white shadow-sm ring-4 ring-[#E8F0FE] dark:bg-[#8AB4F8] dark:text-[#202124] dark:ring-[#174EA6]/50'
                  : 'border border-[#DADCE0] bg-[#F8F9FA] text-[#202124] hover:border-[#4285F4] hover:bg-[#E8F0FE]/50 dark:border-[#5F6368] dark:bg-[#202124] dark:text-[#E8EAED] dark:hover:border-[#8AB4F8]'
              }`}
            >
              {v}
            </motion.button>
          )
        })}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-t border-[#DADCE0]/60 pt-3 text-xs font-medium text-[#5F6368] dark:border-[#5F6368]/40 dark:text-[#9AA0A6]">
        <span className="max-w-[45%] leading-snug">{question.minLabel}</span>
        <span className="max-w-[45%] text-right leading-snug">{question.maxLabel}</span>
      </div>
    </div>
  )
}
