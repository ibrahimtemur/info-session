/** Admin ekranı için ortak Material 3 Tailwind sınıfları (48px+ dokunma hedefleri). */
const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45'

export const btn = {
  primary: `${base} bg-[#4285F4] text-white shadow-sm hover:bg-[#1A73E8] active:bg-[#1A73E8] dark:bg-[#8AB4F8] dark:text-[#202124] dark:hover:bg-[#AECBFA]`,
  ghost: `${base} border border-[#DADCE0] bg-white text-[#202124] hover:bg-[#F1F3F4] active:bg-[#E8EAED] dark:border-[#5F6368] dark:bg-[#303134] dark:text-[#E8EAED] dark:hover:bg-[#3C4043]`,
  danger: `${base} bg-[#EA4335] text-white shadow-sm hover:bg-[#C5221F] active:bg-[#C5221F]`,
  small:
    'inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-[#DADCE0] bg-white px-3 text-xs font-semibold text-[#202124] transition-colors hover:border-[#4285F4] hover:bg-[#E8F0FE] hover:text-[#174EA6] dark:border-[#5F6368] dark:bg-[#303134] dark:text-[#E8EAED] dark:hover:border-[#8AB4F8] dark:hover:bg-[#3C4043]',
  smallDanger:
    'inline-flex min-h-9 items-center justify-center gap-1 rounded-full border border-[#EA4335]/35 bg-[#FCE8E6]/70 px-3 text-xs font-semibold text-[#C5221F] transition-colors hover:bg-[#FCE8E6] dark:border-[#F28B82]/35 dark:bg-[#8C1D18]/40 dark:text-[#F28B82] dark:hover:bg-[#8C1D18]/60',
}

export function messageOf(e) {
  if (e?.name === 'NetworkError') return 'Bağlantı yok. İnternetini kontrol et.'
  return e?.message || 'Beklenmeyen bir hata oluştu'
}
