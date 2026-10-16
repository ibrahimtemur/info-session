import Icon, { TonalIcon } from '../components/Icon.jsx'

/** Karşılama ekranı (Screen 1: Light & Dark) */
export default function Welcome({ onStart }) {
  return (
    <div className="flex flex-1 flex-col justify-between pt-2">
      <div>
        {/* Google renkli geometrik şekillerden oluşan kahve fincanı ve yuvarlak masa illüstrasyonu */}
        <div className="card relative mb-6 flex items-center justify-center overflow-hidden bg-[#F8F9FA] p-5 dark:bg-[#303134]">
          <svg
            viewBox="0 0 320 200"
            className="h-44 w-full max-w-[300px]"
             role="img"
            aria-label="Kahve fincanı ve dört Google renkli sandalyeli yuvarlak masa illüstrasyonu"
          >
            {/* Arka plan tonal daireler */}
            <circle cx="72" cy="48" r="24" fill="#E8F0FE" opacity="0.9" />
            <circle cx="254" cy="44" r="18" fill="#FEF7E0" opacity="0.9" />
            <circle cx="54" cy="154" r="16" fill="#FCE8E6" opacity="0.9" />
            <circle cx="264" cy="152" r="22" fill="#E6F4EA" opacity="0.9" />

            {/* 4 Google renkli sandalye / katılımcı noktası */}
            {/* Üst: Mavi */}
            <rect x="138" y="14" width="44" height="16" rx="8" fill="#4285F4" />
            {/* Sağ: Kırmızı */}
            <rect x="228" y="78" width="16" height="44" rx="8" fill="#EA4335" />
            {/* Alt: Yeşil */}
            <rect x="138" y="170" width="44" height="16" rx="8" fill="#34A853" />
            {/* Sol: Sarı */}
            <rect x="76" y="78" width="16" height="44" rx="8" fill="#FBBC04" />

            {/* Yuvarlak kafe masası */}
            <circle cx="160" cy="100" r="60" fill="#FFFFFF" stroke="#DADCE0" strokeWidth="3" />
            <circle
              cx="160"
              cy="100"
              r="50"
              fill="#F8F9FA"
              stroke="#E8F0FE"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Masadaki 4 küçük tabak / bardak altlığı */}
            <circle cx="160" cy="58" r="6" fill="#4285F4" opacity="0.25" />
            <circle cx="202" cy="100" r="6" fill="#EA4335" opacity="0.25" />
            <circle cx="160" cy="142" r="6" fill="#34A853" opacity="0.25" />
            <circle cx="118" cy="100" r="6" fill="#FBBC04" opacity="0.25" />

            {/* Merkezde kahve fincanı */}
            {/* Fincan tabağı */}
            <ellipse cx="160" cy="116" rx="28" ry="8" fill="#E8F0FE" stroke="#4285F4" strokeWidth="2" />
            {/* Fincan kulpu */}
            <path
              d="M178 92 H185 A8 8 0 0 1 185 108 H178"
              fill="none"
              stroke="#4285F4"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Fincan gövdesi */}
            <path
              d="M140 84 H180 V102 A16 16 0 0 1 164 118 H156 A16 16 0 0 1 140 102 Z"
              fill="#4285F4"
            />
            {/* Fincan üzerindeki sarı-yeşil-kırmızı detay bandı */}
            <rect x="146" y="92" width="8" height="4" rx="2" fill="#FBBC04" />
            <rect x="156" y="92" width="8" height="4" rx="2" fill="#EA4335" />
            <rect x="166" y="92" width="8" height="4" rx="2" fill="#34A853" />
            {/* Buhar çizgileri */}
            <path
              d="M152 76 C152 70, 156 70, 156 64"
              fill="none"
              stroke="#FBBC04"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M162 74 C162 68, 166 68, 166 62"
              fill="none"
              stroke="#EA4335"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M170 76 C170 70, 174 70, 174 64"
              fill="none"
              stroke="#34A853"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#202124] sm:text-4xl dark:text-[#E8EAED]">
          Info Session&apos;a{' '}
          <span className="text-[#4285F4] dark:text-[#8AB4F8]">hoş geldin!</span>
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[#5F6368] sm:text-lg dark:text-[#9AA0A6]">
          8 kısa soru, 1-2 dakika. Sana en uygun masayı bulalım; yeni insanlarla tanış, kaynaş!
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex items-start gap-3.5 rounded-2xl border border-[#4285F4]/25 bg-[#E8F0FE] p-4 text-sm leading-snug text-[#174EA6] dark:border-[#8AB4F8]/30 dark:bg-[#174EA6]/30 dark:text-[#E8EAED]">
          <TonalIcon
            name="info"
            tone="blue"
            size="sm"
            className="bg-white/80 dark:bg-[#303134]"
          />
          <p className="pt-0.5 font-medium">
            Anketi sadece bir kez doldurabilirsin, o yüzden içinden geldiği gibi cevapla.
          </p>
        </div>

        <button type="button" className="btn-primary w-full" onClick={onStart}>
          <span>Hadi başlayalım</span>
          <Icon name="arrow_forward" className="text-[20px]" />
        </button>
      </div>
    </div>
  )
}
