import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const LANG_STORAGE_KEY = 'infosession:lang'

const THEME_EN = {
  'Teknoloji meraklıları': 'Tech enthusiasts',
  'Sanat & tasarım tayfası': 'Art & design crew',
  'Spor aşıkları': 'Sports lovers',
  'Girişimci ruhlar': 'Entrepreneurial minds',
  'Müzik & oyun severler': 'Music & gaming fans',
  'Karma masa': 'Mixed table',
}

const ICEBREAKER_EN = {
  'Hayatını en çok kolaylaştıran uygulama hangisi, neden?':
    'Which app makes your life the easiest, and why?',
  'Son zamanlarda seni en çok etkileyen tasarım ya da eser neydi?':
    'What design or artwork has impressed you the most recently?',
  'Hiç denemediğin ama denemek istediğin spor hangisi?':
    'What is a sport you have never tried but would love to try?',
  'Sınırsız bütçen olsa hangi girişimi kurardın?':
    'If you had an unlimited budget, what startup would you build?',
  'Şu an en çok döndürdüğün şarkı ya da oyun ne?':
    'What song or game do you have on repeat right now?',
  'Üç kelimeyle kendini anlat, masa tahmin etsin!':
    'Describe yourself in three words and let the table guess!',
}

export function translateTheme(theme, lang = 'tr') {
  if (!theme || lang !== 'en') return theme
  return THEME_EN[theme] || theme
}

export function translateIceBreaker(iceBreaker, lang = 'tr') {
  if (!iceBreaker || lang !== 'en') return iceBreaker
  return ICEBREAKER_EN[iceBreaker] || iceBreaker
}

export function translateApiMessage(msg, lang = 'tr') {
  if (!msg || lang !== 'en') return msg
  if (msg === 'Parola hatalı') return 'Incorrect password'
  if (msg === 'Yönetici yetkisi gerekli') return 'Admin authorization required'
  if (msg === 'Katılımcı bulunamadı') return 'Participant not found'
  if (msg === 'Böyle bir masa yok') return 'No such table'
  if (msg === 'Bu cihaz zaten kayıtlı') return 'This device is already registered'
  if (msg === 'Geçersiz veri') return 'Invalid data'
  if (msg === 'Hedef masa numarası geçersiz') return 'Invalid target table number'
  if (msg === 'Sunucu hatası') return 'Server error'
  const fullMatch = /^Masa (\d+) dolu$/.exec(msg)
  if (fullMatch) return `Table ${fullMatch[1]} is full`
  return msg
}

export const STRINGS = {
  tr: {
    developer: 'Geliştirici',
    loading: 'Yükleniyor…',
    themeLight: 'Açık moda geç',
    themeDark: 'Koyu moda geç',
    langSwitchLabel: 'Switch language to English',
    offlineBanner: 'İnternetin koptu! Bağlanınca kaldığın yerden devam edebilirsin.',
    devAddFake: '30 sahte ekle',
    devReset: 'Sıfırla',

    // Welcome
    welcomeSvgAlt: 'Kahve fincanı ve dört Google renkli sandalyeli yuvarlak masa illüstrasyonu',
    welcomeTitlePrefix: "Info Session'a ",
    welcomeTitleAccent: 'hoş geldin!',
    welcomeSubtitle:
      '8 kısa soru, 1-2 dakika. Sana en uygun masayı bulalım; yeni insanlarla tanış, kaynaş!',
    welcomeInfoNote:
      'Anketi sadece bir kez doldurabilirsin, o yüzden içinden geldiği gibi cevapla.',
    welcomeCta: 'Hadi başlayalım',

    // Name
    nameTitle: 'Sana nasıl hitap edelim?',
    nameHelper: 'Masandakiler seni bu isimle görecek.',
    namePlaceholder: 'Adın (veya takma adın)',
    nameError: 'Bir isim yazmadan devam edemeyiz',
    privacyTitle: 'Gizlilik notu:',
    privacyBody:
      'Verilerin sadece bu etkinlikte masa eşleştirmek için kullanılır, başka bir amaçla paylaşılmaz.',
    back: 'Geri',
    continue: 'Devam et',

    // Quiz & ProgressBar
    questionProgress: (cur, total) => `Soru ${cur} / ${total}`,
    formatPercent: (pct) => `%${pct}`,
    quizNetworkError:
      'İnternet bağlantın yok gibi görünüyor. Bağlanınca tekrar dene, cevapların burada duruyor.',
    quizGenericError: 'Bir şeyler ters gitti. Lütfen tekrar dene.',
    quizSelectPrompt: 'Devam etmek için bir seçim yap',
    quizSearching: 'Masan aranıyor…',
    quizFinish: 'Masamı bul',
    quizSkip: 'Atla',
    quizNext: 'İleri',

    // Result
    againNotice: 'Tekrar hoş geldin! Bu cihazdan zaten katılmıştın, sonucun burada.',
    waitingTitle: 'Cevapların Kaydedildi!',
    waitingGreat: 'Harika,',
    waitingBody:
      'Diğer katılımcıların da testi tamamlaması bekleniyor. Organizatör masaları dağıttığında masan ve arkadaşların burada otomatik olarak belirecek.',
    waitingChip: 'Masalar birazdan dağıtılacak…',
    waitingAutoSync: 'Sayfayı açık tutabilirsin, ekran otomatik güncellenecektir.',

    waitlistTitle: 'Masalar şu an dolu!',
    waitlistBadge: (pos) => `Bekleme listesinde ${pos}. sıradasın`,
    waitlistPopularPrefix: 'Çok popülersin,',
    waitlistBody:
      '! Bir yer açılırsa organizatörler seni masaya alacak. Kafeden uzaklaşma, bu ekran otomatik güncellenir.',

    seatedHello: (name) => `Selam ${name}!`,
    seatedYourTable: 'Senin masan:',
    tableLabel: (num) => `Masa ${num}`,
    tablematesTitle: 'Masa arkadaşların',
    youSuffix: ' (sen)',
    tablematesHint: 'Sonradan gelenler de masana katılabilir, liste güncellenir.',
    icebreakerTitle: 'Buz kırıcı soru',

    // Admin Login
    adminDocTitle: 'Admin · Masa Yönetimi · Info Session',
    adminLoginTitle: 'Admin girişi',
    adminLoginSubtitle: 'Masa yönetim paneline erişmek için organizatör parolasını girin.',
    adminPasswordLabel: 'Parola',
    adminChecking: 'Kontrol ediliyor…',
    adminLoginBtn: 'Giriş yap',

    // Admin Dashboard
    adminTitle: 'Masa Yönetimi',
    adminLogout: 'Çıkış',
    adminStaleData: 'son veri gösteriliyor',
    adminSummaryAria: 'Özet',
    statParticipants: 'Katılımcı',
    statSeated: 'Masada',
    statSeatedVal: (seated, tableCount) => `${seated} · ${tableCount} masa`,
    statWaiting: 'Dağıtım Bekleyen',
    statWaitlist: 'Bekleme Listesi',

    bannerWaitingTitle: (count) => `${count} katılımcı havuzda dağıtım bekliyor!`,
    bannerWaitingSub:
      'Katılımcılar şu anda bekleme ekranında. Hazır olduğunda masaları dağıtabilirsin.',
    btnDistributeTables: 'Masaları Dağıt',
    btnUpdateDistribution: 'Dağıtımı Güncelle',
    personCount: (n) => `${n} kişi`,

    actionsAria: 'İşlemler',
    btnProjector: 'Masa Listesi',
    btnExportCsv: 'CSV indir',
    btnRedistributeNew: (n) => `Yeniden Dağıt (${n} yeni)`,
    btnRedistribute: 'Yeniden Dağıt',
    btnSimulate: '30 Simüle Et',
    btnSimulateTitle: 'Sistemi test etmek için 30 sahte katılımcı simüle eder',
    btnReset: 'Sıfırla',
    btnRefresh: 'Yenile',

    tablesAria: 'Masalar',
    emptyPoolReadyTitle: (n) => `Havuzda ${n} katılımcı hazır bekliyor!`,
    emptyPoolReadySub:
      'Katılımcıların karakter testleri tamamlandı. Masaları en uyumlu şekilde oluşturmak için dağıtımı başlatabilirsin.',
    emptyNoParticipants: 'Henüz katılımcı yok. İlk kayıt geldiğinde masalar burada görünür.',

    waitingPoolAria: 'Havuzda bekleyenler',
    waitingPoolHeading: (n) => `Dağıtım Bekleyen Katılımcılar (${n})`,
    waitingPoolBadge: 'Admin dağıtımı bekleniyor',

    waitlistAria: 'Bekleme listesi',
    waitlistHeading: (n) => `Bekleme listesi (${n})`,
    btnSeatFromWaitlist: 'Masaya al',
    btnMove: 'Taşı',
    btnDelete: 'Sil',
    ariaMovePerson: (name) => `${name} kişisini taşı`,
    ariaDeletePerson: (name) => `${name} kişisini sil`,
    titleDeletePerson: 'Katılımcıyı sil',
    emptyTable: 'Boş masa',
    tableOccupancyAria: (num) => `Masa ${num} doluluk`,

    // Dialogs & Toasts
    toastCsvDownloaded: 'CSV indirildi',
    toastMoved: (name, num) => `${name} → Masa ${num}`,
    toastDeleted: (name) => `${name} silindi`,
    toastDistributed: (seated, tables) => `Masalar dağıtıldı: ${seated} kişi, ${tables} masa`,
    toastRedistributed: (seated, tables) => `Yeniden dağıtıldı: ${seated} kişi, ${tables} masa`,
    toastSimulated: '30 test katılımcısı simüle edildi',
    toastReset: 'Tüm katılımcılar silindi',
    csvFilenamePrefix: 'katilimcilar',

    moveDialogTitle: (name) => `Katılımcıyı taşı · ${name}`,
    moveCurrentTable: (num) => `Şu an: Masa ${num}`,
    moveCurrentWaitlist: 'Şu an: Bekleme listesinde',
    movePickTarget: 'Hedef masayı seçin',
    moveHere: 'Mevcut masa',
    moveFull: 'Dolu',
    moveOccupancy: (count, cap) => `${count}/${cap} dolu`,
    cancel: 'Vazgeç',
    working: 'Çalışıyor…',
    close: 'Kapat',

    deleteDialogTitle: (name) => `${name} silinsin mi?`,
    deleteConfirmBtn: 'Evet, sil',
    deleteDialogBody1:
      'sistemden tamamen silinecek. Boşalan koltuğa başka biri oturabilir veya aynı cihazla yeniden kayıt olabilir.',
    irreversibleWarning: 'Bu işlem geri alınamaz.',

    rebalanceDialogTitleInitial: 'Masalar dağıtılsın mı?',
    rebalanceDialogTitleAgain: 'Yeniden dağıtılsın mı?',
    rebalanceBodyInitialPrefix: 'Havuzdaki ',
    rebalanceBodyInitialCount: (n) => `${n} katılımcı`,
    rebalanceBodyInitialSuffix:
      ', ilgi alanları ve karakter testlerine göre en uyumlu masalara yerleştirilecek. Katılımcıların ekranlarında masaları otomatik olarak belirecek.',
    rebalanceBodyAgainPrefix: (n) =>
      `Tüm katılımcılar (${n} kişi) baştan eşleştirme algoritmasıyla dağıtılır. `,
    rebalanceBodyAgainStrong: 'Elle yaptığın taşımalar ve şu anki masa numaraları değişir.',

    seedDialogTitle: '30 Katılımcı Simüle Edilsin mi?',
    seedConfirmBtn: 'Simüle Et',
    seedBodyIntroPrefix: 'Sistemi ve algoritmayı test etmek için ',
    seedBodyIntroStrong: '30 sahte katılımcı',
    seedBodyIntroSuffix: ' sisteme eklenecek.',
    seedBodyPool1: 'Katılımcılar doğrudan ',
    seedBodyPoolStrong1: 'dağıtım havuzuna',
    seedBodyPool2: ' eklenir. Ardından ',
    seedBodyPoolStrong2: '“Masaları Dağıt”',
    seedBodyPool3: ' butonuna basarak algoritmanın masaları nasıl oluşturduğunu test edebilirsin.',
    seedBodyDirect:
      'Mevcut masalara uygun şekilde yerleştirilirler; kapasite dolarsa bekleme listesi oluşur.',
    seedBodyFooter1: 'Testin bitince ',
    seedBodyFooterStrong: 'Sıfırla',
    seedBodyFooter2: ' butonu ile tümünü tek tıkla silebilirsin.',

    resetDialogTitle: 'Tüm veriler silinsin mi?',
    resetConfirmBtn: 'Evet, sıfırla',
    resetBodyPrefix: (n) => `${n} katılımcının tamamı ve masa yerleşimi silinir. `,
    resetBodySuffix: ' Gerekirse önce CSV indir.',

    // Projector View
    projectorAria: 'Masa listesi',
    projectorTitle: 'Masa Listesi',
    projectorConnIssue: 'Bağlantı sorunu — son veri',
    projectorLive: (time) => `Canlı · ${time}`,
    projectorExit: 'Kapat (Esc)',
    projectorEmpty: 'Henüz masa dağıtımı yapılmadı',

    // Generic errors
    networkErrorMsg: 'Bağlantı yok. İnternetini kontrol et.',
    unexpectedErrorMsg: 'Beklenmeyen bir hata oluştu',
  },

  en: {
    developer: 'Developer',
    loading: 'Loading…',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    langSwitchLabel: 'Türkçe diline geç',
    offlineBanner: 'You are offline! You can continue where you left off once reconnected.',
    devAddFake: 'Add 30 fake',
    devReset: 'Reset',

    // Welcome
    welcomeSvgAlt:
      'Illustration of a coffee cup and a round table with four Google-colored chairs',
    welcomeTitlePrefix: 'Welcome to ',
    welcomeTitleAccent: 'Info Session!',
    welcomeSubtitle:
      '8 short questions, 1–2 minutes. Let’s find the best table for you—meet new people and connect!',
    welcomeInfoNote:
      'You can only complete this quiz once, so answer straight from the heart.',
    welcomeCta: 'Let’s get started',

    // Name
    nameTitle: 'What should we call you?',
    nameHelper: 'Your tablemates will see you by this name.',
    namePlaceholder: 'Your name (or nickname)',
    nameError: 'Please enter a name to continue',
    privacyTitle: 'Privacy note:',
    privacyBody:
      'Your data is used solely for table matching during this event and is never shared for any other purpose.',
    back: 'Back',
    continue: 'Continue',

    // Quiz & ProgressBar
    questionProgress: (cur, total) => `Question ${cur} / ${total}`,
    formatPercent: (pct) => `${pct}%`,
    quizNetworkError:
      'It looks like you have no internet connection. Try again once connected—your answers are safe here.',
    quizGenericError: 'Something went wrong. Please try again.',
    quizSelectPrompt: 'Make a selection to continue',
    quizSearching: 'Finding your table…',
    quizFinish: 'Find my table',
    quizSkip: 'Skip',
    quizNext: 'Next',

    // Result
    againNotice: 'Welcome back! You have already joined from this device—here is your result.',
    waitingTitle: 'Your Answers Are Saved!',
    waitingGreat: 'Awesome,',
    waitingBody:
      'Waiting for other participants to finish the quiz. Once the organizer distributes the tables, your table and tablemates will appear here automatically.',
    waitingChip: 'Tables will be distributed shortly…',
    waitingAutoSync: 'You can keep this page open; the screen will update automatically.',

    waitlistTitle: 'Tables are currently full!',
    waitlistBadge: (pos) => `You are #${pos} on the waitlist`,
    waitlistPopularPrefix: 'You’re super popular,',
    waitlistBody:
      '! If a spot opens up, the organizers will seat you at a table. Stay close—this screen updates automatically.',

    seatedHello: (name) => `Hey ${name}!`,
    seatedYourTable: 'Your table:',
    tableLabel: (num) => `Table ${num}`,
    tablematesTitle: 'Your tablemates',
    youSuffix: ' (you)',
    tablematesHint: 'Latecomers may also join your table; the list updates automatically.',
    icebreakerTitle: 'Icebreaker question',

    // Admin Login
    adminDocTitle: 'Admin · Table Management · Info Session',
    adminLoginTitle: 'Admin login',
    adminLoginSubtitle: 'Enter the organizer password to access the table management panel.',
    adminPasswordLabel: 'Password',
    adminChecking: 'Checking…',
    adminLoginBtn: 'Sign in',

    // Admin Dashboard
    adminTitle: 'Table Management',
    adminLogout: 'Sign out',
    adminStaleData: 'showing last known data',
    adminSummaryAria: 'Summary',
    statParticipants: 'Participants',
    statSeated: 'Seated',
    statSeatedVal: (seated, tableCount) => `${seated} · ${tableCount} tables`,
    statWaiting: 'Waiting Pool',
    statWaitlist: 'Waitlist',

    bannerWaitingTitle: (count) => `${count} participants waiting in the pool!`,
    bannerWaitingSub:
      'Participants are currently on the waiting screen. Distribute tables whenever you are ready.',
    btnDistributeTables: 'Distribute Tables',
    btnUpdateDistribution: 'Update Distribution',
    personCount: (n) => `${n} people`,

    actionsAria: 'Actions',
    btnProjector: 'Projector View',
    btnExportCsv: 'Export CSV',
    btnRedistributeNew: (n) => `Redistribute (${n} new)`,
    btnRedistribute: 'Redistribute',
    btnSimulate: 'Simulate 30',
    btnSimulateTitle: 'Simulates 30 fake participants to test the system',
    btnReset: 'Reset',
    btnRefresh: 'Refresh',

    tablesAria: 'Tables',
    emptyPoolReadyTitle: (n) => `${n} participants are ready in the pool!`,
    emptyPoolReadySub:
      'Participant quizzes are complete. Start distribution to create the most compatible tables.',
    emptyNoParticipants: 'No participants yet. Tables will appear here once the first person joins.',

    waitingPoolAria: 'Waiting pool',
    waitingPoolHeading: (n) => `Participants Waiting for Distribution (${n})`,
    waitingPoolBadge: 'Awaiting admin distribution',

    waitlistAria: 'Waitlist',
    waitlistHeading: (n) => `Waitlist (${n})`,
    btnSeatFromWaitlist: 'Assign table',
    btnMove: 'Move',
    btnDelete: 'Delete',
    ariaMovePerson: (name) => `Move ${name}`,
    ariaDeletePerson: (name) => `Delete ${name}`,
    titleDeletePerson: 'Delete participant',
    emptyTable: 'Empty table',
    tableOccupancyAria: (num) => `Table ${num} occupancy`,

    // Dialogs & Toasts
    toastCsvDownloaded: 'CSV downloaded',
    toastMoved: (name, num) => `${name} → Table ${num}`,
    toastDeleted: (name) => `${name} deleted`,
    toastDistributed: (seated, tables) => `Tables distributed: ${seated} people, ${tables} tables`,
    toastRedistributed: (seated, tables) => `Redistributed: ${seated} people, ${tables} tables`,
    toastSimulated: '30 test participants simulated',
    toastReset: 'All participants cleared',
    csvFilenamePrefix: 'participants',

    moveDialogTitle: (name) => `Move participant · ${name}`,
    moveCurrentTable: (num) => `Current: Table ${num}`,
    moveCurrentWaitlist: 'Current: On waitlist',
    movePickTarget: 'Select target table',
    moveHere: 'Current table',
    moveFull: 'Full',
    moveOccupancy: (count, cap) => `${count}/${cap} seated`,
    cancel: 'Cancel',
    working: 'Working…',
    close: 'Close',

    deleteDialogTitle: (name) => `Delete ${name}?`,
    deleteConfirmBtn: 'Yes, delete',
    deleteDialogBody1:
      'will be permanently removed. Someone else can take the freed seat or re-register from the same device.',
    irreversibleWarning: 'This action cannot be undone.',

    rebalanceDialogTitleInitial: 'Distribute tables?',
    rebalanceDialogTitleAgain: 'Redistribute tables?',
    rebalanceBodyInitialPrefix: 'The ',
    rebalanceBodyInitialCount: (n) => `${n} participants`,
    rebalanceBodyInitialSuffix:
      ' in the pool will be seated at the most compatible tables based on their interests and personality quiz. Their tables will appear automatically on their screens.',
    rebalanceBodyAgainPrefix: (n) =>
      `All participants (${n} people) will be reassigned from scratch by the matching algorithm. `,
    rebalanceBodyAgainStrong: 'Manual moves and current table numbers will change.',

    seedDialogTitle: 'Simulate 30 Participants?',
    seedConfirmBtn: 'Simulate',
    seedBodyIntroPrefix: 'To test the system and matching algorithm, ',
    seedBodyIntroStrong: '30 fake participants',
    seedBodyIntroSuffix: ' will be added.',
    seedBodyPool1: 'Participants are added directly to the ',
    seedBodyPoolStrong1: 'waiting pool',
    seedBodyPool2: '. Then you can click ',
    seedBodyPoolStrong2: '“Distribute Tables”',
    seedBodyPool3: ' to test how the algorithm forms tables.',
    seedBodyDirect:
      'They will be placed into available tables; if capacity is reached, a waitlist is formed.',
    seedBodyFooter1: 'When finished testing, click ',
    seedBodyFooterStrong: 'Reset',
    seedBodyFooter2: ' to clear everyone in one click.',

    resetDialogTitle: 'Delete all data?',
    resetConfirmBtn: 'Yes, reset',
    resetBodyPrefix: (n) => `All ${n} participants and table assignments will be deleted. `,
    resetBodySuffix: ' Export CSV first if needed.',

    // Projector View
    projectorAria: 'Table list',
    projectorTitle: 'Table List',
    projectorConnIssue: 'Connection issue — last data',
    projectorLive: (time) => `Live · ${time}`,
    projectorExit: 'Close (Esc)',
    projectorEmpty: 'Tables have not been distributed yet',

    // Generic errors
    networkErrorMsg: 'No connection. Check your internet.',
    unexpectedErrorMsg: 'An unexpected error occurred',
  },
}

export function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved === 'en' || saved === 'tr') return saved
  } catch {
    /* ignore */
  }
  return 'tr'
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const setLang = useCallback((next) => {
    const normalized = next === 'en' ? 'en' : 'tr'
    setLangState(normalized)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, normalized)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = normalized
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'tr' ? 'en' : 'tr')
  }, [lang, setLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: STRINGS[lang] || STRINGS.tr,
      translateTheme: (theme) => translateTheme(theme, lang),
      translateIceBreaker: (ib) => translateIceBreaker(ib, lang),
      translateApiMessage: (msg) => translateApiMessage(msg, lang),
    }),
    [lang, setLang, toggleLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    const lang = getInitialLang()
    return {
      lang,
      setLang: () => {},
      toggleLang: () => {},
      t: STRINGS[lang] || STRINGS.tr,
      translateTheme: (theme) => translateTheme(theme, lang),
      translateIceBreaker: (ib) => translateIceBreaker(ib, lang),
      translateApiMessage: (msg) => translateApiMessage(msg, lang),
    }
  }
  return ctx
}

/** Material 3 dil değiştirici buton (simgesiz, sadece EN / TR). */
export function LanguageToggle({ className = '' }) {
  const { lang, toggleLang, t } = useI18n()
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.langSwitchLabel}
      title={t.langSwitchLabel}
      className={`font-heading flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DADCE0] bg-white text-xs font-bold tracking-wide text-[#202124] transition-colors hover:bg-[#F1F3F4] dark:border-[#5F6368] dark:bg-[#303134] dark:text-[#E8EAED] dark:hover:bg-[#3C4043] ${className}`}
    >
      {lang === 'tr' ? 'EN' : 'TR'}
    </button>
  )
}
