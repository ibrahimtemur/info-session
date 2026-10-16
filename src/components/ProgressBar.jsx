import { motion } from 'framer-motion'
import { useI18n } from '../lib/i18n.jsx'

/** Üstteki ilerleme çubuğu: "Soru 3 / 8" ve "%38" */
export default function ProgressBar({ current, total }) {
  const { t } = useI18n()
  const pct = Math.round(((current + 1) / total) * 100)
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span className="font-heading text-[#202124] dark:text-[#E8EAED]">
          {t.questionProgress(current + 1, total)}
        </span>
        <span className="rounded-full bg-[#E8F0FE] px-2.5 py-0.5 text-xs font-bold text-[#174EA6] dark:bg-[#174EA6]/40 dark:text-[#8AB4F8]">
          {t.formatPercent(pct)}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#E8F0FE] dark:bg-[#3C4043]">
        <motion.div
          className="h-full rounded-full bg-[#4285F4] dark:bg-[#8AB4F8]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  )
}
