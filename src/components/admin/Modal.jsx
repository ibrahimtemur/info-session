import { useEffect, useRef } from 'react'
import Icon from '../Icon.jsx'

/** Basit Material 3 modal (Screen 12): Esc ve dışarı tıklama ile kapanır, açılınca odak panele gider. */
export default function Modal({ title, onClose, children, id }) {
  const panel = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    panel.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        id={id}
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#DADCE0] bg-white p-6 text-[#202124] shadow-xl outline-none dark:border-[#5F6368] dark:bg-[#303134] dark:text-[#E8EAED]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-[#202124] dark:text-[#E8EAED]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124] dark:text-[#9AA0A6] dark:hover:bg-[#3C4043] dark:hover:text-[#E8EAED]"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
