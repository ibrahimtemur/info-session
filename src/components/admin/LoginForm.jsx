import { useState } from 'react'
import { adminLogin } from '../../api/client.js'
import Icon, { TonalIcon } from '../Icon.jsx'
import { useI18n } from '../../lib/i18n.jsx'
import { messageOf } from './ui.js'

/** Admin parola ekranı (Screen 10). Parola doğrulaması API'de (mock'ta VITE_ADMIN_PASSWORD) yapılır. */
export default function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const { lang, t } = useI18n()

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await adminLogin(password)
      onSuccess()
    } catch (err) {
      setError(messageOf(err, lang))
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={submit}
      className="card mx-auto mt-16 w-full max-w-md p-7 sm:p-8"
      aria-labelledby="admin-login-title"
    >
      <div className="flex flex-col items-center text-center">
        <TonalIcon name="lock" tone="blue" size="lg" />
        <h1
          id="admin-login-title"
          className="font-heading mt-4 text-2xl font-bold text-[#202124] dark:text-[#E8EAED]"
        >
          {t.adminLoginTitle}
        </h1>
        <p className="mt-1 text-sm text-[#5F6368] dark:text-[#9AA0A6]">
          {t.adminLoginSubtitle}
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-sm font-semibold text-[#202124] dark:text-[#E8EAED]"
        >
          {t.adminPasswordLabel}
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`input-m3 h-12 px-4 text-base ${error ? 'input-m3-error' : ''}`}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-center gap-2 rounded-xl border border-[#EA4335]/40 bg-[#FCE8E6] px-3.5 py-2.5 text-sm font-medium text-[#C5221F] dark:border-[#F28B82]/40 dark:bg-[#8C1D18] dark:text-[#F28B82]"
        >
          <Icon name="error" className="text-[18px] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        id="admin-login"
        type="submit"
        className="btn-primary mt-6 w-full"
        disabled={busy || !password}
      >
        <span>{busy ? t.adminChecking : t.adminLoginBtn}</span>
        {!busy && <Icon name="login" className="text-[20px]" />}
      </button>
    </form>
  )
}
