/**
 * SORU SETİ
 * ---------------------------------------------------------------------------
 * Her cevap, matching.js içindeki buildVector() ile bir "özellik vektörüne"
 * dönüştürülür:
 *
 *   vector = {
 *     social:    [-1, 1]   // -1 = çok içe dönük, +1 = çok dışa dönük
 *     interests: Set/dizi  // 'tech' | 'art' | 'sport' | 'startup' | 'musicGame'
 *     style:     'listener' | 'talker' | 'funny'
 *     goal:      'network' | 'friend' | 'learn'
 *     dept:      string | null  // masada farklı bölümler karışsın diye
 *     fun:       string | null  // buz kırıcı önerisi için (skora etkisi yok)
 *   }
 *
 * Her sorunun `measures` alanı neyi ölçtüğünü, `contribution` alanı vektöre
 * nasıl katkı verdiğini açıklar. Cevap formatı:
 *   slider -> number (1..5) | cards -> option value | multi -> value[]
 */

export const INTERESTS = [
  { value: 'tech', label: 'Teknoloji', labelEn: 'Technology', icon: 'memory', tone: 'blue' },
  { value: 'art', label: 'Sanat / Tasarım', labelEn: 'Art / Design', icon: 'palette', tone: 'red' },
  { value: 'sport', label: 'Spor', labelEn: 'Sports', icon: 'sports_soccer', tone: 'green' },
  { value: 'startup', label: 'Girişimcilik', labelEn: 'Entrepreneurship', icon: 'lightbulb', tone: 'yellow' },
  { value: 'musicGame', label: 'Müzik / Oyun', labelEn: 'Music / Gaming', icon: 'sports_esports', tone: 'blue' },
]

export const QUESTIONS = [
  {
    id: 'crowd',
    type: 'slider',
    icon: 'groups',
    tone: 'blue',
    text: 'Tanımadığın bir kalabalığa girince ne hissedersin?',
    textEn: 'How do you feel when you walk into a crowd of strangers?',
    min: 1,
    max: 5,
    minLabel: 'Kaçacak yer arıyorum',
    minLabelEn: 'Looking for an exit',
    maxLabel: 'Sahne benim!',
    maxLabelEn: 'The stage is mine!',
    // Ölçtüğü: sosyallik (içe dönük <-> dışa dönük)
    measures: 'sosyallik',
    // Katkı: (v-3)/2 -> [-1,1]; social = ağırlıklı ortalama (bu soru %40)
    contribution: 'social',
    weight: 0.4,
  },
  {
    id: 'starter',
    type: 'slider',
    icon: 'record_voice_over',
    tone: 'green',
    text: 'Sohbeti genelde sen mi başlatırsın?',
    textEn: 'Are you usually the one who starts the conversation?',
    min: 1,
    max: 5,
    minLabel: 'Hiç',
    minLabelEn: 'Rarely',
    maxLabel: 'Hep ben',
    maxLabelEn: 'Always me',
    // Ölçtüğü: sosyallik (davranışsal yön)
    measures: 'sosyallik',
    // Katkı: (v-3)/2 -> [-1,1]; social ortalamasında %40
    contribution: 'social',
    weight: 0.4,
  },
  {
    id: 'interests',
    type: 'multi',
    icon: 'auto_awesome',
    tone: 'yellow',
    text: 'Seni en çok ne heyecanlandırır?',
    textEn: 'What excites you the most?',
    hint: 'En fazla 2 tane seç',
    hintEn: 'Select up to 2',
    max: 2,
    options: INTERESTS,
    // Ölçtüğü: ilgi alanları — ortak ilgi bonusunun ana girdisi
    measures: 'ilgi alanı',
    // Katkı: seçilenler interests kümesine eklenir
    contribution: 'interests',
  },
  {
    id: 'style',
    type: 'cards',
    icon: 'forum',
    tone: 'blue',
    text: 'Sohbette hangisisin?',
    textEn: 'Which one are you in a conversation?',
    options: [
      { value: 'listener', label: 'Dinleyici', labelEn: 'Good listener', icon: 'hearing', tone: 'blue' },
      { value: 'talker', label: 'Konuşkan', labelEn: 'Talkative', icon: 'mic', tone: 'green' },
      {
        value: 'funny',
        label: 'Espri odaklı',
        labelEn: 'Humor-focused',
        icon: 'sentiment_very_satisfied',
        tone: 'yellow',
      },
    ],
    // Ölçtüğü: sohbet tarzı — masada hepsi dinleyici olmasın
    measures: 'sohbet tarzı',
    // Katkı: style alanı (tarz çeşitliliği ufak bonus)
    contribution: 'style',
  },
  {
    id: 'goal',
    type: 'cards',
    icon: 'flag',
    tone: 'red',
    text: 'Bu etkinlikten en çok ne bekliyorsun?',
    textEn: 'What do you hope to get most out of this event?',
    options: [
      { value: 'network', label: 'Network', labelEn: 'Networking', icon: 'handshake', tone: 'blue' },
      { value: 'friend', label: 'Arkadaşlık', labelEn: 'Making friends', icon: 'diversity_3', tone: 'green' },
      { value: 'learn', label: 'Bilgi edinmek', labelEn: 'Learning new things', icon: 'menu_book', tone: 'yellow' },
    ],
    // Ölçtüğü: beklenti — aynı beklentiye sahip olanlar küçük bonus alır
    measures: 'beklenti',
    // Katkı: goal alanı
    contribution: 'goal',
  },
  {
    id: 'dept',
    type: 'cards',
    optional: true,
    icon: 'school',
    tone: 'blue',
    text: 'Hangi alandansın?',
    textEn: 'What is your field of study?',
    hint: 'İstersen atlayabilirsin',
    hintEn: 'Feel free to skip if you like',
    options: [
      { value: 'engineering', label: 'Mühendislik', labelEn: 'Engineering', icon: 'engineering', tone: 'blue' },
      { value: 'business', label: 'İşletme / İktisat', labelEn: 'Business / Economics', icon: 'trending_up', tone: 'green' },
      { value: 'design', label: 'Tasarım / Mimarlık', labelEn: 'Design / Architecture', icon: 'architecture', tone: 'red' },
      { value: 'science', label: 'Fen / Sağlık', labelEn: 'Science / Health', icon: 'science', tone: 'yellow' },
      { value: 'social', label: 'Sosyal / Hukuk', labelEn: 'Social Sciences / Law', icon: 'balance', tone: 'blue' },
      { value: 'other', label: 'Diğer', labelEn: 'Other', icon: 'category', tone: 'green' },
    ],
    // Ölçtüğü: bölüm çeşitliliği — masada FARKLI bölümler karışsın
    measures: 'bölüm',
    // Katkı: dept alanı; masada zaten olan bölüm skoru düşürür (çeşitlilik bonusu)
    contribution: 'dept',
  },
  {
    id: 'friday',
    type: 'cards',
    icon: 'dark_mode',
    tone: 'blue',
    text: 'Cuma gecesi planın nedir?',
    textEn: 'What is your ideal Friday night plan?',
    options: [
      {
        value: 'home',
        label: 'Evde dizi & battaniye',
        labelEn: 'Cozy at home with a series',
        icon: 'weekend',
        tone: 'blue',
        social: -0.6,
      },
      {
        value: 'game',
        label: 'Oyun / müzik seansı',
        labelEn: 'Gaming / music session',
        icon: 'headphones',
        tone: 'green',
        social: -0.1,
      },
      {
        value: 'out',
        label: 'Dışarı, arkadaşlarla!',
        labelEn: 'Out with friends!',
        icon: 'celebration',
        tone: 'yellow',
        social: 0.7,
      },
      {
        value: 'study',
        label: 'Ders / proje',
        labelEn: 'Studying / side project',
        icon: 'laptop_chromebook',
        tone: 'red',
        social: -0.3,
      },
    ],
    // Ölçtüğü: enerji / sosyal tercih
    measures: 'enerji',
    // Katkı: seçeneğin `social` değeri, social ortalamasında %20 ağırlıkla
    contribution: 'social',
    weight: 0.2,
  },
  {
    id: 'drink',
    type: 'cards',
    icon: 'local_cafe',
    tone: 'yellow',
    text: 'Kafede ilk siparişin ne olur?',
    textEn: 'What is your first order at a café?',
    options: [
      { value: 'coffee', label: 'Filtre kahve', labelEn: 'Filter coffee', icon: 'coffee', tone: 'blue' },
      { value: 'tea', label: 'Çay', labelEn: 'Tea', icon: 'emoji_food_beverage', tone: 'green' },
      { value: 'cold', label: 'Soğuk içecek', labelEn: 'Iced drink', icon: 'ac_unit', tone: 'yellow' },
      { value: 'energy', label: 'Enerji içeceği', labelEn: 'Energy drink', icon: 'bolt', tone: 'red' },
    ],
    // Ölçtüğü: sadece eğlence — buz kırıcı sorusunu kişiselleştirir
    measures: 'eğlence',
    // Katkı: fun alanı (eşleştirme skoruna etkisi YOK)
    contribution: 'fun',
  },
]

/** Seçili dile göre soruyu ve seçeneklerini yerelleştirir. */
export function localizeQuestion(q, lang = 'tr') {
  if (lang !== 'en') return q
  return {
    ...q,
    text: q.textEn || q.text,
    hint: q.hintEn || q.hint,
    minLabel: q.minLabelEn || q.minLabel,
    maxLabel: q.maxLabelEn || q.maxLabel,
    options: q.options?.map((o) => ({
      ...o,
      label: o.labelEn || o.label,
    })),
  }
}

/** Bir sorunun cevabı geçerli mi? (opsiyonel sorular boş geçilebilir) */
export function isAnswered(question, value) {
  if (question.optional) return true
  if (question.type === 'multi') return Array.isArray(value) && value.length >= 1
  return value !== undefined && value !== null && value !== ''
}
