import { useState } from 'react'
import Icon, { TonalIcon } from '../components/Icon.jsx'
import { useI18n } from '../lib/i18n.jsx'

/** İsim ekranı (Screen 2): boş isim engellenir, gizlilik notu gösterilir. */
export default function Name({ initial = '', onNext, onBack }) {
  const [name, setName] = useState(initial)
  const [touched, setTouched] = useState(false)
  const { t } = useI18n()
  const trimmed = name.trim()
  const invalid = trimmed.length < 2

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (!invalid) onNext(trimmed)
  }

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col pt-2">
      <TonalIcon name="badge" tone="blue" size="lg" />
      <h2 className="font-heading mt-4 text-2xl font-bold leading-tight text-[#202124] sm:text-3xl dark:text-[#E8EAED]">
        {t.nameTitle}
      </h2>
      <p className="mt-1.5 text-base text-[#5F6368] dark:text-[#9AA0A6]">{t.nameHelper}</p>

      <div className="mt-6">
        <label htmlFor="name-input" className="sr-only">
          {t.namePlaceholder}
        </label>
        <input
          id="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          autoComplete="given-name"
          placeholder={t.namePlaceholder}
          aria-invalid={touched && invalid}
          className={`input-m3 h-14 px-4 text-lg font-medium ${
            touched && invalid ? 'input-m3-error' : ''
          }`}
        />
        {touched && invalid && (
          <p
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#EA4335] dark:text-[#F28B82]"
          >
            <Icon name="error" className="text-[18px]" />
            <span>{t.nameError}</span>
          </p>
        )}
      </div>

      <div className="card mt-5 flex items-start gap-3.5 bg-[#E6F4EA]/60 p-4 text-sm leading-relaxed text-[#202124] dark:bg-[#0D652D]/25 dark:text-[#E8EAED]">
        <TonalIcon name="shield_lock" tone="green" size="sm" />
        <p className="text-[#5F6368] dark:text-[#9AA0A6]">
          <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
            {t.privacyTitle}
          </strong>{' '}
          {t.privacyBody}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-8">
        <button
          type="button"
          className="btn-ghost flex h-14 w-14 shrink-0 items-center justify-center"
          onClick={onBack}
          aria-label={t.back}
        >
          <Icon name="arrow_back" className="text-[22px]" />
        </button>
        <button type="submit" className="btn-primary flex-1">
          <span>{t.continue}</span>
          <Icon name="arrow_forward" className="text-[20px]" />
        </button>
      </div>
    </form>
  )
}
