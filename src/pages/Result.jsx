import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { getResult } from '../api/client.js'
import Icon, { getTablePalette, TonalIcon } from '../components/Icon.jsx'

/**
 * Sonuç ekranları:
 * - Screen 6 (Seated): Masanın Google renginde büyük hero kart, masa arkadaşları ve buz kırıcı soru
 * - Screen 7 (Waiting): Cevapların Kaydedildi! + yanıp sönen durum çipi
 * - Screen 8 (Waitlist): Masalar şu an dolu! + sıra göstergesi
 */
export default function Result({ result, onResultUpdate }) {
  // Havuzda bekleyen katılımcı için otomatik polling
  useEffect(() => {
    if (result.status !== 'waiting') return

    const interval = setInterval(async () => {
      try {
        const next = await getResult()
        if (next && next.status !== 'waiting') {
          onResultUpdate?.(next)
        }
      } catch {
        /* Ağ hatası olursa sonraki turda tekrar dene */
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [result.status, onResultUpdate])

  if (result.status === 'waiting') {
    return (
      <div className="flex flex-1 flex-col justify-center py-4 text-center">
        {result.alreadyJoined && <Again />}
        <div className="card p-6">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E6F4EA] text-[#137333] dark:bg-[#0D652D]/40 dark:text-[#81C995]"
          >
            <Icon name="check_circle" filled className="text-[44px]" />
          </motion.div>

          <h1 className="font-heading mt-5 text-2xl font-bold text-[#202124] sm:text-3xl dark:text-[#E8EAED]">
            Cevapların Kaydedildi!
          </h1>
          <p className="mt-2 text-base font-medium text-[#5F6368] dark:text-[#9AA0A6]">
            Harika,{' '}
            <span className="font-semibold text-[#4285F4] dark:text-[#8AB4F8]">
              {result.name}
            </span>
            !
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#5F6368] dark:text-[#9AA0A6]">
            Diğer katılımcıların da testi tamamlaması bekleniyor. Organizatör masaları dağıttığında
            masan ve arkadaşların burada otomatik olarak belirecek.
          </p>

          <div className="mx-auto mt-6 inline-flex items-center justify-center gap-2.5 rounded-full border border-[#4285F4]/30 bg-[#E8F0FE] px-4 py-2.5 text-sm font-semibold text-[#174EA6] dark:border-[#8AB4F8]/30 dark:bg-[#174EA6]/35 dark:text-[#8AB4F8]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4285F4] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4285F4] dark:bg-[#8AB4F8]" />
            </span>
            <span>Masalar birazdan dağıtılacak…</span>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
            <Icon name="sync" className="text-[16px]" />
            <span>Sayfayı açık tutabilirsin, ekran otomatik güncellenecektir.</span>
          </p>
        </div>
      </div>
    )
  }

  if (result.status === 'waitlist') {
    return (
      <div className="flex flex-1 flex-col justify-center py-4 text-center">
        {result.alreadyJoined && <Again />}
        <div className="card p-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF7E0] text-[#B06000] dark:bg-[#7A4B00]/40 dark:text-[#FDD663]">
            <Icon name="schedule" className="text-[42px]" />
          </div>

          <h1 className="font-heading mt-5 text-2xl font-bold text-[#202124] sm:text-3xl dark:text-[#E8EAED]">
            Masalar şu an dolu!
          </h1>

          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#FBBC04]/50 bg-[#FEF7E0] px-5 py-2 text-base font-bold text-[#B06000] dark:border-[#FDD663]/40 dark:bg-[#7A4B00]/40 dark:text-[#FDD663]">
            <Icon name="format_list_numbered" className="text-[20px]" />
            <span>Bekleme listesinde {result.position}. sıradasın</span>
          </div>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-[#5F6368] dark:text-[#9AA0A6]">
            Çok popülersin,{' '}
            <strong className="font-semibold text-[#202124] dark:text-[#E8EAED]">
              {result.name}
            </strong>
            ! Bir yer açılırsa organizatörler seni masaya alacak. Kafeden uzaklaşma, bu ekran
            otomatik güncellenir.
          </p>
        </div>
      </div>
    )
  }

  const { table } = result
  const palette = getTablePalette(result.tableId)

  return (
    <div className="flex flex-1 flex-col pt-1">
      {result.alreadyJoined && <Again />}

      {/* Masanın Google renginde büyük hero kartı */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className={`rounded-2xl p-6 text-center shadow-sm ${palette.heroBg}`}
      >
        <p className="text-base font-medium opacity-90">Selam {result.name}!</p>
        <p className="mt-0.5 text-sm font-semibold uppercase tracking-wider opacity-85">
          Senin masan:
        </p>
        <h1
          className="font-heading mt-1 text-6xl font-bold leading-none tracking-tight"
          data-testid="table-number"
        >
          Masa {result.tableId}
        </h1>
        <div
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${palette.heroChip}`}
        >
          <Icon name="auto_awesome" className="text-[18px]" />
          <span>{table.theme}</span>
        </div>
      </motion.div>

      {/* Masa arkadaşların */}
      <section className="card mt-4 p-5" aria-labelledby="mates">
        <div className="mb-3 flex items-center gap-2.5">
          <TonalIcon name="groups" tone="blue" size="sm" />
          <h2
            id="mates"
            className="font-heading text-lg font-bold text-[#202124] dark:text-[#E8EAED]"
          >
            Masa arkadaşların
          </h2>
        </div>

        <ul className="flex flex-wrap gap-2">
          {table.members.map((m, i) => {
            const isMe = m.id === result.meId
            return (
              <motion.li
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${
                  isMe
                    ? 'bg-[#4285F4] text-white dark:bg-[#8AB4F8] dark:text-[#202124]'
                    : 'border border-[#DADCE0] bg-[#F8F9FA] text-[#202124] dark:border-[#5F6368] dark:bg-[#3C4043] dark:text-[#E8EAED]'
                }`}
              >
                <Icon name={isMe ? 'person_check' : 'person'} className="text-[16px]" />
                <span>
                  {m.name}
                  {isMe && ' (sen)'}
                </span>
              </motion.li>
            )
          })}
        </ul>
        <p className="mt-3 text-xs text-[#5F6368] dark:text-[#9AA0A6]">
          Sonradan gelenler de masana katılabilir, liste güncellenir.
        </p>
      </section>

      {/* Buz kırıcı soru */}
      <section className="card mt-4 p-5" aria-labelledby="icebreaker-title">
        <div className="mb-2.5 flex items-center gap-2.5">
          <TonalIcon name="forum" tone="yellow" size="sm" />
          <h2
            id="icebreaker-title"
            className="font-heading text-lg font-bold text-[#202124] dark:text-[#E8EAED]"
          >
            Buz kırıcı soru
          </h2>
        </div>
        <blockquote className="font-heading text-lg font-semibold leading-snug text-[#202124] dark:text-[#E8EAED]">
          “{table.iceBreaker}”
        </blockquote>
      </section>
    </div>
  )
}

function Again() {
  return (
    <div className="mb-4 flex items-center gap-2.5 rounded-2xl border border-[#34A853]/30 bg-[#E6F4EA] px-4 py-3 text-left text-xs font-medium text-[#137333] dark:border-[#81C995]/30 dark:bg-[#0D652D]/35 dark:text-[#81C995]">
      <Icon name="verified" className="text-[18px] shrink-0" />
      <span>Tekrar hoş geldin! Bu cihazdan zaten katılmıştın, sonucun burada.</span>
    </div>
  )
}
