import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'

/** İnternet kopunca üstte uyarı gösterir. */
export default function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          role="alert"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-[440px] items-center gap-3 rounded-2xl border border-[#EA4335]/40 bg-[#FCE8E6] px-4 py-3 text-left text-sm font-medium text-[#C5221F] shadow-md dark:border-[#F28B82]/40 dark:bg-[#8C1D18] dark:text-[#F28B82]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EA4335]/15 text-[#C5221F] dark:bg-black/20 dark:text-[#F28B82]">
            <Icon name="wifi_off" className="text-[20px]" />
          </span>
          <span>İnternetin koptu! Bağlanınca kaldığın yerden devam edebilirsin.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
