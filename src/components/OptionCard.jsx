import { motion } from 'framer-motion'
import Icon, { TonalIcon } from './Icon.jsx'

/** Büyük dokunma alanlı seçenek kartı (tekli ve çoklu seçim için ortak). */
export default function OptionCard({ icon, tone = 'blue', label, selected, onClick, disabled }) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`card flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
        selected
          ? 'opt-selected'
          : 'hover:border-[#4285F4]/50 hover:bg-[#F8F9FA] dark:hover:bg-[#3C4043]/60'
      }`}
    >
      <TonalIcon
        name={icon || 'radio_button_unchecked'}
        tone={selected ? 'blue' : tone}
        filled={selected}
      />
      <span className="font-heading flex-1 text-base font-semibold text-[#202124] dark:text-[#E8EAED]">
        {label}
      </span>
      {selected ? (
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4285F4] text-white dark:bg-[#8AB4F8] dark:text-[#202124]"
        >
          <Icon name="check" className="text-[18px]" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="h-6 w-6 shrink-0 rounded-full border-2 border-[#DADCE0] dark:border-[#5F6368]"
        />
      )}
    </motion.button>
  )
}
