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

## Dosya yapısı

| Yol | Görev |
|-----|-------|
| `src/lib/questions.js` | 8 soru; her sorunun neyi ölçtüğü ve vektöre katkısı yorumlarla belgeli |
| `src/lib/matching.js` | Saf JS eşleştirme (tohumlama + greedy + swap), geç gelen, bekleme listesi, tema, buz kırıcı |
| `src/lib/matching.test.js` | 20 kişi dengeli, 72 kişi kapasite, geç gelen, tüm masalar dolu testleri |
| `src/api/client.js` | Uygulamanın backend ile konuştuğu tek nokta; `USE_MOCK` bayrağı |
| `src/api/mockServer.js` | localStorage tabanlı sahte sunucu |
| `src/pages/`, `src/components/` | Ekranlar ve UI parçaları |

## Algoritma özeti

1. Her kişiden vektör: `social ∈ [-1,1]`, ilgi alanları, sohbet tarzı, beklenti, bölüm.
2. **Toplu dağıtım (`assignAll`)**: birbirine en uzak k kişi masalara tohumlanır → kalanlar boyut dengesini koruyarak en yüksek marjinal skorlu masaya eklenir → 400 deterministik swap denemesi (skor artarsa kabul).
3. **Geç gelen (`placeLatecomer`)**: mevcut kimse yer değiştirmez; en yüksek skorlu müsait masaya oturur. Hepsi doluysa bekleme listesi (sıra numarasıyla).
4. Masa sayısı `min(12, ceil(n/6))`; boyutlar `floor/ceil(n/k)` (20 kişi → 4×5).
5. Skor: ortak ilgi + içe/dışa denge + tarz çeşitliliği + (küçük) aynı beklenti − aynı bölüm − doluluk dengesi (geç gelende).

## Gerçek API'ye geçiş

`src/api/client.js` içinde `USE_MOCK = false` yapın. Beklenen uçlar:

- `POST /api/join` gövde `{deviceId, name, answers}` → sonuç nesnesi
- `GET /api/result?deviceId=...` → sonuç nesnesi veya `404` (kayıt yok)

Sonuç nesnesi:
```json
{ "status": "seated", "name": "Ayşe", "meId": "u1", "tableId": 7,
  "table": { "id": 7, "members": [{"id":"u1","name":"Ayşe"}], "theme": "Teknoloji meraklıları 🚀", "iceBreaker": "..." },
  "alreadyJoined": false }
```
veya `{ "status": "waitlist", "name": "Ayşe", "position": 3 }`. Sunucu tarafında `src/lib/matching.js` doğrudan yeniden kullanılabilir (framework'e bağımsız).

## Varsayımlar

- **Mock tek tarayıcıya özgüdür**: localStorage cihazlar arası paylaşılmaz; gerçek etkinlikte masa arkadaşlarının görünmesi için backend gerekir.
- Tailwind v4 kullanıldı (config dosyası yok, `@tailwindcss/vite`).
- Bir cihaz bir kez katılır; tekrar girişte kayıtlı sonuç ve güncel masa listesi gösterilir. Tarayıcı verisi temizlenirse cihaz yeniden katılabilir (backend'de cihaz kimliği/IP ile sınırlanmalı).
- Katılım tek tek geldiği için (backend'siz) yerleşim artımlıdır: etkinlik başlamadan önce sunucuda `assignAll` ile toplu yeniden dengeleme yapılması önerilir (DEV aracı bunu yapar); sonrasında gelenler `placeLatecomer` ile eklenir.
- 72 kişiden sonrası bekleme listesine alınır.
- Bölüm sorusu opsiyoneldir; boş bırakılırsa çeşitlilik hesabında nötr sayılır.
- Slider yerine 1-5 yüz ikonlu büyük dokunma butonları kullanıldı (tek elle kolay).
- Veri minimizasyonu: sadece isim ve anket cevapları saklanır.
