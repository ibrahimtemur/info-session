import Icon, { TonalIcon } from '../Icon.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import Modal from './Modal.jsx'
import { btn } from './ui.js'

/** Onay penceresi (Screen 12: Yeniden Dağıt / Sıfırla / Sil). */
export default function ConfirmDialog({
  title,
  children,
  confirmLabel,
  danger,
  busy,
  onConfirm,
  onCancel,
}) {
  const { t } = useI18n()
  return (
    <Modal title={title} onClose={onCancel} id="confirm-dialog">
      <div className="flex items-start gap-3.5">
        <TonalIcon
          name={danger ? 'warning' : 'auto_awesome'}
          tone={danger ? 'red' : 'blue'}
          size="md"
        />
        <div className="flex-1 text-sm leading-relaxed text-[#5F6368] dark:text-[#9AA0A6]">
          {children}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <button
          id="confirm-cancel"
          type="button"
          className={btn.ghost}
          onClick={onCancel}
          disabled={busy}
        >
          {t.cancel}
        </button>
        <button
          id="confirm-ok"
          type="button"
          className={danger ? btn.danger : btn.primary}
          onClick={onConfirm}
          disabled={busy}
        >
          {danger && !busy && <Icon name="delete_forever" className="text-[18px]" />}
          <span>{busy ? t.working : confirmLabel}</span>
        </button>
      </div>
    </Modal>
  )
}
