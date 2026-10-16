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
  { value: 'tech', label: 'Teknoloji', icon: 'memory', tone: 'blue' },
  { value: 'art', label: 'Sanat / Tasarım', icon: 'palette', tone: 'red' },
  { value: 'sport', label: 'Spor', icon: 'sports_soccer', tone: 'green' },
  { value: 'startup', label: 'Girişimcilik', icon: 'lightbulb', tone: 'yellow' },
  { value: 'musicGame', label: 'Müzik / Oyun', icon: 'sports_esports', tone: 'blue' },
]

export const QUESTIONS = [
  {
    id: 'crowd',
    type: 'slider',
    icon: 'groups',
    tone: 'blue',
    text: 'Tanımadığın bir kalabalığa girince ne hissedersin?',
    min: 1,
    max: 5,
    minLabel: 'Kaçacak yer arıyorum',
    maxLabel: 'Sahne benim!',
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
    min: 1,
    max: 5,
    minLabel: 'Hiç',
    maxLabel: 'Hep ben',
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
    hint: 'En fazla 2 tane seç',
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
    options: [
      { value: 'listener', label: 'Dinleyici', icon: 'hearing', tone: 'blue' },
      { value: 'talker', label: 'Konuşkan', icon: 'mic', tone: 'green' },
      { value: 'funny', label: 'Espri odaklı', icon: 'sentiment_very_satisfied', tone: 'yellow' },
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
    options: [
      { value: 'network', label: 'Network', icon: 'handshake', tone: 'blue' },
      { value: 'friend', label: 'Arkadaşlık', icon: 'diversity_3', tone: 'green' },
      { value: 'learn', label: 'Bilgi edinmek', icon: 'menu_book', tone: 'yellow' },
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
    hint: 'İstersen atlayabilirsin',
    options: [
      { value: 'engineering', label: 'Mühendislik', icon: 'engineering', tone: 'blue' },
      { value: 'business', label: 'İşletme / İktisat', icon: 'trending_up', tone: 'green' },
      { value: 'design', label: 'Tasarım / Mimarlık', icon: 'architecture', tone: 'red' },
      { value: 'science', label: 'Fen / Sağlık', icon: 'science', tone: 'yellow' },
      { value: 'social', label: 'Sosyal / Hukuk', icon: 'balance', tone: 'blue' },
      { value: 'other', label: 'Diğer', icon: 'category', tone: 'green' },
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
    options: [
      { value: 'home', label: 'Evde dizi & battaniye', icon: 'weekend', tone: 'blue', social: -0.6 },
      { value: 'game', label: 'Oyun / müzik seansı', icon: 'headphones', tone: 'green', social: -0.1 },
      { value: 'out', label: 'Dışarı, arkadaşlarla!', icon: 'celebration', tone: 'yellow', social: 0.7 },
      { value: 'study', label: 'Ders / proje', icon: 'laptop_chromebook', tone: 'red', social: -0.3 },
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
    options: [
      { value: 'coffee', label: 'Filtre kahve', icon: 'coffee', tone: 'blue' },
      { value: 'tea', label: 'Çay', icon: 'emoji_food_beverage', tone: 'green' },
      { value: 'cold', label: 'Soğuk içecek', icon: 'ac_unit', tone: 'yellow' },
      { value: 'energy', label: 'Enerji içeceği', icon: 'bolt', tone: 'red' },
    ],
    // Ölçtüğü: sadece eğlence — buz kırıcı sorusunu kişiselleştirir
    measures: 'eğlence',
    // Katkı: fun alanı (eşleştirme skoruna etkisi YOK)
    contribution: 'fun',
  },
]

/** Bir sorunun cevabı geçerli mi? (opsiyonel sorular boş geçilebilir) */
export function isAnswered(question, value) {
  if (question.optional) return true
  if (question.type === 'multi') return Array.isArray(value) && value.length >= 1
  return value !== undefined && value !== null && value !== ''
}
