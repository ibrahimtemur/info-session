# GDG on Campus · Info Session — Masa Eşleştirme Uygulaması

Bu proje, **GDG on Campus** topluluğunun bir kafede gerçekleştirdiği tanışma etkinliği (**Info Session**) için geliştirilmiş mobil öncelikli bir masa eşleştirme web uygulamasıdır. Katılımcılar telefonlarından 8 kısa soruluk anketi (1–2 dakika) yanıtlar; sistem verilen cevaplara göre katılımcıları hem ortak ilgi alanlarına sahip hem de çeşitlilik açısından dengeli masalara otomatik olarak yerleştirir. Organizatörler ise masaüstü **Admin Paneli** ve tam ekran **Projektör Görünümü** üzerinden etkinliği canlı olarak yönetir.

Hem **Google / Material Design 3** tasarım diline sahip modern bir kullanıcı arayüzü (Frontend) hem de **Neon Postgres** tabanlı bir API (Backend) içerir. Canlı sürüm **Vercel + Neon** üzerinde çalışır.

---

## Canlı Yayın & Hızlı Erişim

Uygulama Vercel üzerinde aktiftir. Aşağıdaki bağlantılara tıklayarak veya QR kodları telefonunuzun kamerasıyla okutarak hemen deneyebilirsiniz:

| Katılımcı Uygulaması (Masanı Bul) | Yönetici Paneli (Admin) |
| :---: | :---: |
| [![Info Session · Masanı Bul](docs/qr/qr-app.png)](https://info-session-psi.vercel.app/) | [![Admin · Info Session](docs/qr/qr-admin.png)](https://info-session-psi.vercel.app/admin) |
| **[Info Session · Masanı Bul](https://info-session-psi.vercel.app/)** | **[Admin · Info Session](https://info-session-psi.vercel.app/admin)** |
| *Katılımcıların 8 soruluk anketi doldurup masasını öğrendiği mobil ekran* | *Masa dağılımları, canlı doluluk, kişi taşıma/silme ve projektör görünümü* |

---

## İçindekiler
1. [Canlı Yayın & Hızlı Erişim](#canlı-yayın--hızlı-erişim)
2. [Tasarım Dili (Google / Material Design 3)](#tasarım-dili-google--material-design-3)
3. [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
4. [Özellikler ve Şu Anki Durum](#özellikler-ve-şu-anki-durum)
5. [Proje Yapısı](#proje-yapısı)
6. [Yerel Kurulum ve Çalıştırma](#yerel-kurulum-ve-çalıştırma)
7. [Ortam Değişkenleri (.env)](#ortam-değişkenleri-env)
8. [Eşleştirme Algoritması ve Etkinlik Akışı](#eşleştirme-algoritması-ve-etkinlik-akışı)
9. [Canlıya Alma Rehberi (Deployment)](#canlıya-alma-rehberi-deployment)

---

## Tasarım Dili (Google / Material Design 3)

Arayüz, resmi bir **GDG on Campus** ürünü hissiyatı verecek şekilde **Material Design 3** standartlarıyla tasarlanmıştır:

- **Google 4-Renk Paleti:**
  - **Birincil Aksiyon:** Google Mavi `#4285F4` (basılı `#1A73E8`)
  - **Vurgu Renkleri:** Kırmızı `#EA4335`, Sarı `#FBBC04`, Yeşil `#34A853`
  - **Tonal Kapsayıcılar:** Mavi `#E8F0FE`, Yeşil `#E6F4EA`, Sarı `#FEF7E0`, Kırmızı `#FCE8E6`
  - **Düz Yüzeyler (Flat Surfaces):** Açık temada `#F8F9FA` arka plan / `#FFFFFF` kart yüzeyi (`#DADCE0` kenarlık); koyu temada `#202124` arka plan / `#303134` kart yüzeyi.
- **Tipografi ve İkonografi:**
  - Başlıklar: **Google Sans** (`Outfit` yedekli), Gövde: **Roboto**
  - Tüm ikonlar emoji yerine renkli tonal daireler içinde **Material Symbols Rounded** kullanılarak oluşturulmuştur.
  - Üst barda `< >` kod braketi ve dört Google rengi nokta ile `"GDG on Campus · Info Session"` marka imzası yer alır.
- **Masa Renk Kimliği (`tableNumber mod 4`):**
  - Her masa numarası dört Google renginden biriyle eşleşir (`Masa 1` Kırmızı, `Masa 2` Sarı, `Masa 3` Yeşil, `Masa 4` Mavi vb.) ve bu renk katılımcı sonuç kartında, admin masa kartlarında ve 1920×1080 projektör ekranında tutarlı şekilde kullanılır.

---

## Kullanılan Teknolojiler

| Bölüm | Teknoloji | Açıklama |
|---|---|---|
| **Frontend** | React (v19) + Vite (v8) | Mobil öncelikli, hızlı arayüz kütüphanesi. |
| **Stil / UI** | Tailwind CSS (v4) + Framer Motion + Material Symbols Rounded | Google Material Design 3 bileşenleri ve akıcı geçiş animasyonları. |
| **Backend** | Node.js + Express (v5) | REST API; Vercel serverless fonksiyonu olarak çalışır. |
| **Veritabanı** | Neon Postgres (`pg`) | Serverless uyumlu, kalıcı Postgres. Yerleştirme işlemleri advisory lock ile sıraya alınır. |
| **Doğrulama (Validation)** | Zod | Gelen isteklerin yapısal bütünlüğünü doğrulamak için. |
| **Test** | Vitest + Supertest + PGlite | Frontend algoritma/admin birim testleri ve süreç içi Postgres ile backend API entegrasyon testleri (42 test). |
| **Barındırma** | Vercel + Neon | Frontend + API tek projede, veritabanı Neon Frankfurt (`fra1`). |

---

## Özellikler ve Şu Anki Durum

| Özellik | Durum |
|---------|-------|
| **GDG on Campus Material 3 UI** | Tamamlandı (Açık/koyu tema, AA kontrast, 48px+ dokunma hedefleri, 56px hap butonlar) |
| **Anket ve Eşleştirme Mantığı** | Tamamlandı (8 soru: derecelendirme ölçeği, tekli seçim, çoklu seçim, opsiyonel soru atlama) |
| **Sonuç Ekranları** | Tamamlandı (Masaya yerleşenler için masa renginde hero kart + buz kırıcı soru, havuzda bekleyenler için otomatik güncellenen ekran, bekleme listesi sırası) |
| **Backend ve Veritabanı** | Tamamlandı (Express + Neon Postgres, transaction + advisory lock) |
| **Admin Paneli & Projektör Görünümü** | Tamamlandı (4 özet istatistik kartı, havuz dağıtım banner'ı, CSV indirme, 30 kişilik simülasyon, kişi taşıma/silme modal pencereleri ve `#202124` koyu tema canlı Projektör ekranı) |
| **Otomatik Testler** | Tamamlandı (Frontend ve Backend toplam 42 test geçiyor) |

---

## Proje Yapısı

Proje Frontend (`src/`), Vercel fonksiyon girişi (`api/`) ve Backend kodu (`backend/`) olarak yapılandırılmıştır. Tüm bağımlılıklar kökteki tek `package.json` içindedir:

```text
info-session/
├── README.md                        # Projenin ana dokümantasyonu
├── API_CONTRACT.md                  # Frontend ve Backend arasındaki iletişim kuralları
├── package.json                     # Tüm bağımlılıklar ve scriptler (frontend + backend)
├── vite.config.js                   # Vite ayarları, test ayarları ve yerel API proxy'si
├── vercel.json                      # Vercel yönlendirmeleri ve fonksiyon bölgesi (fra1)
├── index.html                       # Google Fonts (Outfit, Roboto, Material Symbols Rounded) ve kök HTML
├── api/
│   └── index.js                     # Vercel serverless giriş noktası (Express uygulamasını dışa aktarır)
├── docs/
│   └── qr/                          # README için QR kod görselleri (qr-app.png, qr-admin.png)
├── public/
│   └── qr/                          # Statik sunulan QR kod görselleri
├── scripts/
│   └── seed.mjs                     # Hızlı test verisi üretme betiği
├── src/                             # Frontend Kodları
│   ├── App.jsx                      # Katılımcı akışı ve /admin yönlendirmesi
│   ├── index.css                    # Material Design 3 renk token'ları ve bileşen sınıfları
│   ├── main.jsx                     # React uygulama girişi
│   ├── api/                         # Backend iletişimi (client.js, errors.js, mockServer.js)
│   ├── components/                  # Yeniden kullanılabilir M3 bileşenleri
│   │   ├── Icon.jsx                 # Material Symbols Rounded, TonalIcon, GdgBrandMark, getTablePalette
│   │   ├── OfflineBanner.jsx        # Çevrimdışı uyarı bandı
│   │   ├── OptionCard.jsx           # İkonlu tekli/çoklu seçenek kartı
│   │   ├── ProgressBar.jsx          # Anket ilerleme çubuğu ("Soru 3 / 8" ve "%38")
│   │   ├── QuestionCard.jsx         # Soru başlığı ve girdi kapsayıcısı
│   │   ├── SliderQuestion.jsx       # 5 adımlı dairesel derecelendirme ölçeği
│   │   ├── ThemeToggle.jsx          # Açık/koyu tema değiştirici
│   │   └── admin/                   # Admin bileşenleri (LoginForm, TableCard, MoveDialog, ConfirmDialog, Modal, ProjectorView, ui.js)
│   ├── lib/                         # Eşleştirme algoritması (matching.js), sorular (questions.js), CSV ve birim testleri
│   └── pages/                       # Sayfalar (Welcome, Name, Quiz, Result, Admin)
└── backend/                         # Backend Kodları
    ├── .env.example                 # Backend için örnek ortam değişkenleri
    ├── scripts/
    │   └── seed.js                  # Backend veritabanı tohumlama betiği
    ├── src/
    │   ├── server.js                # Express uygulaması
    │   ├── db.js                    # Postgres bağlantısı (pg / testte PGlite)
    │   ├── middleware/              # Admin yetki doğrulaması (adminAuth.js)
    │   ├── routes/                  # API uç noktaları (admin.js, participants.js, tables.js)
    │   ├── services/                # İş mantığı (placement.js)
    │   └── shared/                  # Paylaşılan eşleştirme modülü (matching.js)
    └── tests/                       # Backend API entegrasyon testleri (api.test.js)
```

---

## Yerel Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için Node.js (v20+) kurulu olmalıdır. Backend ve frontend **tek bir `package.json`** kullanır.

### 1. Bağımlılıkları kurun
Kök dizinde:
```bash
npm install
```

### 2. Backend'i başlatın
API için bir Postgres veritabanı gerekir (örn. ücretsiz bir Neon veritabanı). `backend/.env` dosyasına `DATABASE_URL` ve `ADMIN_PASSWORD` yazın, sonra:
```bash
npm run dev:api
```
*(API varsayılan olarak `http://localhost:3000` portunda çalışır. Tablo ilk istekte otomatik oluşturulur.)*

### 3. Frontend'i başlatın
Farklı bir terminalde:
```bash
npm run dev
```
*(Frontend `http://localhost:5173` portunda açılır ve `/api` isteklerini otomatik olarak 3000 portuna yönlendirir.)*

### 4. Diğer Yararlı Komutlar (Kök Dizinde)
- `npm test`: Frontend ve backend (API) testlerini çalıştırır. Backend testleri gerçek veritabanı gerektirmez; süreç içi Postgres (PGlite) kullanır.
- `npm run seed`: Rastgele test verisi (katılımcı) üretir. (Örn: `npm run seed 30` ile 30 kişi)
- `npm run build`: Projenin üretime (production) hazır halini `dist/` klasörüne derler.

---

## Ortam Değişkenleri (.env)

Güvenlik sebebiyle parolalar asla kod içine yazılmaz. Yerelde kök dizinde `.env` (frontend) ve `backend/.env` (API) dosyaları kullanılır; Vercel'de bu değerler panelden girilir.

**Kök Dizin (Frontend) `.env` Değişkenleri:**
| Değişken Adı | Açıklama | Örnek Değer |
|--------------|----------|-------------|
| `VITE_USE_MOCK` | Backend olmadan tarayıcı içi sahte verilerle test etmek için `true` yapılır. Gerçek kullanımda `false` olmalıdır. | `false` |
| `VITE_API_BASE_URL` | İsteklerin gönderileceği ana adres. Vercel'de **boş bırakılır** (API aynı alan adında). Yerelde boşsa Vite proxy'si `localhost:3000`'e yönlendirir. | *(boş)* |
| `VITE_ADMIN_PASSWORD` | Sadece Mock (sahte) modda test ederken kullanılan admin şifresi. | *(İstediğiniz bir şifre)* |

**Backend (`backend/.env` ve Vercel) Değişkenleri:**
| Değişken Adı | Açıklama | Örnek Değer |
|--------------|----------|-------------|
| `DATABASE_URL` | Postgres bağlantı adresi. Vercel'de Neon entegrasyonu otomatik ekler. | `postgres://...` |
| `ADMIN_PASSWORD` | **Gerçek Admin Paneli parolası.** Güçlü bir şifre seçmelisiniz. | *(Güçlü bir şifre)* |
| `PORT` | Yerelde API sunucusunun portu. | `3000` |
| `FRONTEND_ORIGIN` | (İsteğe bağlı) Frontend farklı bir alan adındaysa CORS izni; virgülle birden fazla eklenebilir. Vercel'de gerekmez. | `http://localhost:5173` |

---

## Eşleştirme Algoritması ve Etkinlik Akışı

Eşleştirme mantığı `src/lib/matching.js` içerisinde yer alır ve algoritma katılımcıların 8 farklı soruya verdiği yanıtları bir **özellik vektörü** olarak değerlendirir:

1. **Katılımcı Vektörü:** Sosyallik puanı (`social ∈ [-1,1]`), ilgi alanları (`tech`, `art`, `sport`, `startup`, `musicGame`), sohbet tarzı (`listener`, `talker`, `funny`), etkinlik beklentisi (`network`, `friend`, `learn`), bölüm (`dept`) ve ilk kafe siparişi (`fun`) işlenir.
2. **Bekleme Havuzu ve Toplu Dağıtım (Batch Matching):** Katılımcılar anketi tamamladıklarında önce bekleme havuzuna (`waiting`) alınır ve ekranlarında *"Cevapların Kaydedildi! Masalar birazdan dağıtılacak…"* durumu görüntülenir. Admin panelinden **"Masaları Dağıt"** butonuna basıldığında, havuzdaki tüm katılımcılar tek seferde algoritmaya girer. Birbirine en uzak profiller farklı masalara tohum (seed) olarak dağıtılır, ardından açgözlü (greedy) yerleştirme ve yüzlerce swap (yerel iyileştirme) adımıyla dengeli masalar kurulur. Katılımcıların ekranları otomatik polling ile güncellenerek masa numarasını, masa arkadaşlarını ve buz kırıcı soruyu gösterir.
3. **Puanlama Kriterleri:**
   - Masadaki **ortak ilgi alanı** sayısı (+ puan)
   - İçe/Dışa dönüklük ortalamasının dengeli ve yayılımının zengin olması (+ puan)
   - Farklı sohbet tarzlarının aynı masada buluşması (+ puan)
   - Aynı beklentiye sahip olanların eşleşmesi (+ küçük bonus)
   - Aynı bölümden kişilerin tek masada kümelenmemesi (- çeşitlilik cezası)
4. **Geç Gelenler (Latecomer):** İlk toplu dağıtımdan sonra katılanlar (`placeLatecomer`), mevcut oturan kimsenin yerini değiştirmeden en yüksek marjinal uyumu sağlayan müsait masaya yerleştirilir.
5. **Kapasite ve Bekleme Listesi:** Maksimum masa sayısı 12, masa başı kapasite 6'dır (Toplam 72 kişi). Tüm masalar dolduğunda yeni gelenler sırasıyla **Bekleme Listesi**'ne (`waitlist`) alınır.

---

## Canlıya Alma Rehberi (Deployment)

Proje tek bir **Vercel** projesi olarak yayınlanır: frontend statik dosyalar, backend ise `api/index.js` üzerinden Vercel serverless fonksiyonu olarak çalışır. Veritabanı **Neon Postgres**'tir.

1. **Vercel projesi:** vercel.com'da GitHub reposunu içe aktarın (Framework: Vite, Build: `npm run build`, Output: `dist`).
2. **Veritabanı:** Vercel panelinden Neon'u (Marketplace) projeye bağlayın. `DATABASE_URL` otomatik eklenir.
3. **Ortam değişkenleri:** `ADMIN_PASSWORD` (güçlü bir parola) ve `VITE_USE_MOCK=false` ekleyin.
4. **Bölge:** `vercel.json` içindeki `regions: ["fra1"]` fonksiyonları Frankfurt'a alır (Neon ile aynı bölge, düşük gecikme).
5. **Deploy:** Git push ile otomatik ya da `npx vercel deploy --prod --yes` ile elle.
6. **Kontrol:** `https://<proje>.vercel.app/api/health` → `{"status":"ok"}`.

