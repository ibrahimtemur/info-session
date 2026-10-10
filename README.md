# Info Session — Masa Eşleştirme ☕

Bir kafede yapılan ilk topluluk etkinliği için: katılımcılar telefondan link/QR ile girer, 8 soruluk anketi **bir kez** doldurur ve uygulama onları karma ama uyumlu masalara yerleştirir.

Stack: Vite + React + Tailwind CSS v4 + Framer Motion, test: Vitest.

## Komutlar

```bash
npm install
npm run dev       # geliştirme sunucusu (telefondan erişim için --host açık)
npm run test      # matching.js birim testleri
npm run seed      # 30 sahte katılımcıyla dağılımı konsolda doğrula (npm run seed 72 ile farklı sayı)
npm run build     # üretim derlemesi
```

Geliştirici aracı: `http://localhost:5173/?dev=1` adresinde "30 sahte ekle" ve "Sıfırla" butonları görünür (yalnızca mock modunda).

## Admin paneli (`/admin`)

`.env.example` dosyasını `.env` olarak kopyalayıp `VITE_ADMIN_PASSWORD` değerini belirleyin, sonra `http://localhost:5173/admin` adresine girin. Panelde: masalar/oturanlar/doluluk, kişiyi başka masaya taşıma (kapasite kontrollü), projektör için tam ekran **Masa Listesi** (5 sn'de bir yenilenir, `Esc` ile kapanır), katılımcıları CSV indirme, **Yeniden Dağıt** ve **Sıfırla** (onay pencereli).

> Mock modunda parola istemci paketinde yer alır; yalnızca geliştirme içindir. Gerçek backend'de parola sunucuda doğrulanır (aşağıya bakın). Excel'de CSV tek sütun görünürse: Veri → Metinden/CSV'den içe aktar ile UTF-8 ve virgül seçin.

## Dosya yapısı

| Yol | Görev |
|-----|-------|
| `src/lib/questions.js` | 8 soru; her sorunun neyi ölçtüğü ve vektöre katkısı yorumlarla belgeli |
| `src/lib/matching.js` | Saf JS eşleştirme (tohumlama + greedy + swap), geç gelen, bekleme listesi, tema, buz kırıcı |
| `src/lib/matching.test.js` | 20 kişi dengeli, 72 kişi kapasite, geç gelen, tüm masalar dolu testleri |
| `src/api/client.js` | Uygulamanın backend ile konuştuğu tek nokta; `API_CONTRACT.md` ile birebir; `USE_MOCK` bayrağı |
| `src/api/mockServer.js` | localStorage tabanlı sahte sunucu (sözleşmeyi taklit eder) |
| `src/api/errors.js` | `ApiError` / `NetworkError` |
| `src/lib/csv.js`, `src/lib/validate.js` | CSV üretimi, kayıt doğrulaması (backend'de de kullanılabilir) |
| `src/pages/Admin.jsx`, `src/components/admin/` | Admin paneli, projektör görünümü |
| `API_CONTRACT.md` | Uç noktalar, JSON örnekleri, hata kodları |
| `src/pages/`, `src/components/` | Ekranlar ve UI parçaları |

## Algoritma özeti

1. Her kişiden vektör: `social ∈ [-1,1]`, ilgi alanları, sohbet tarzı, beklenti, bölüm.
2. **Toplu dağıtım (`assignAll`)**: birbirine en uzak k kişi masalara tohumlanır → kalanlar boyut dengesini koruyarak en yüksek marjinal skorlu masaya eklenir → 400 deterministik swap denemesi (skor artarsa kabul).
3. **Geç gelen (`placeLatecomer`)**: mevcut kimse yer değiştirmez; en yüksek skorlu müsait masaya oturur. Hepsi doluysa bekleme listesi (sıra numarasıyla).
4. Masa sayısı `min(12, ceil(n/6))`; boyutlar `floor/ceil(n/k)` (20 kişi → 4×5).
5. Skor: ortak ilgi + içe/dışa denge + tarz çeşitliliği + (küçük) aynı beklenti − aynı bölüm − doluluk dengesi (geç gelende).

## Backend'e geçiş adımları

Sözleşme: [`API_CONTRACT.md`](API_CONTRACT.md). İstemci tarafı hazırdır; yapılacaklar sunucudadır.

1. **Sunucuyu yazın.** `API_CONTRACT.md`'deki 9 ucu (health, participants POST/GET, tables, PATCH table, admin login/rebalance/reset/export.csv) uygulayın. Dağıtım için `src/lib/matching.js` (`placeLatecomer`, `assignAll`/`rebalance`, `moveParticipant`), doğrulama için `src/lib/validate.js`, CSV için `src/lib/csv.js` doğrudan import edilebilir (framework'e bağımsız saf JS). Mock'taki `src/api/mockServer.js` her uç için çalışan bir referans uygulamadır.
2. **Kalıcılık ve eşzamanlılık.** Yerleşimi (`tables`, `waitlist`) ve katılımcıları (cevaplar, `deviceId`, `createdAt`) veritabanında tutun. Kayıt ve taşıma işlemlerini tek transaction/kilit ile yapın ki iki kişi aynı son koltuğu kapamasın. `deviceId` için benzersiz kısıt → `409 already_registered`.
3. **Admin kimlik doğrulama.** `POST /api/admin/login` parolayı **sunucu ortam değişkeniyle** karşılaştırıp imzalı/rastgele bir token döndürsün; `PATCH …/table`, `rebalance`, `reset`, `export.csv` `Authorization: Bearer <token>` kontrol edip yoksa `401` dönsün. `VITE_ADMIN_PASSWORD` yalnızca mock içindir, üretimde kullanmayın.
4. **CORS / aynı origin.** API ayrı bir alan adındaysa SPA origin'ine CORS izni verin (`Authorization`, `Content-Type` başlıkları, `PATCH` metodu). Ters vekil ile aynı origin'de sunuyorsanız `VITE_API_BASE_URL` boş kalabilir.
5. **İstemciyi açın.** `.env` (veya barındırma ortamı) içinde:
   ```
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=https://api.ornek.com
   ```
   Alternatif olarak `src/api/client.js` içindeki `USE_MOCK` sabitini `false` yapabilirsiniz. Vite değişkenleri derleme anında gömülür; değiştirince `npm run build` yeniden çalıştırın.
6. **Doğrulayın.** `GET /api/health` → 200; ana akışı bir telefondan, `/admin` panelini bir bilgisayardan deneyin (taşı, yeniden dağıt, CSV, Masa Listesi). Mock'ta cihazlar arası paylaşım olmadığını, gerçek API'de masa arkadaşlarının tüm cihazlarda göründüğünü kontrol edin.
7. **Etkinlik öncesi.** `POST /api/admin/reset` ile test verisini temizleyin ve `/admin` → "Yeniden Dağıt" ile toplu dağıtımı çalıştırın; sonradan gelenler otomatik `placeLatecomer` ile eklenir.

## Varsayımlar

- **Mock tek tarayıcıya özgüdür**: localStorage cihazlar arası paylaşılmaz; gerçek etkinlikte masa arkadaşlarının görünmesi için backend gerekir.
- Tailwind v4 kullanıldı (config dosyası yok, `@tailwindcss/vite`).
- Bir cihaz bir kez katılır; tekrar girişte kayıtlı sonuç ve güncel masa listesi gösterilir. Tarayıcı verisi temizlenirse cihaz yeniden katılabilir (backend'de cihaz kimliği/IP ile sınırlanmalı).
- Katılım tek tek geldiği için (backend'siz) yerleşim artımlıdır: etkinlik başlamadan önce sunucuda `assignAll` ile toplu yeniden dengeleme yapılması önerilir (DEV aracı bunu yapar); sonrasında gelenler `placeLatecomer` ile eklenir.
- 72 kişiden sonrası bekleme listesine alınır.
- Bölüm sorusu opsiyoneldir; boş bırakılırsa çeşitlilik hesabında nötr sayılır.
- Slider yerine 1-5 yüz ikonlu büyük dokunma butonları kullanıldı (tek elle kolay).
- Veri minimizasyonu: sadece isim ve anket cevapları saklanır.
