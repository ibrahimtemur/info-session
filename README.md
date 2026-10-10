# Info Session — Masa Eşleştirme ☕

Bu proje, bir kafede gerçekleştirilen ilk topluluk etkinliği için geliştirilmiş bir masa eşleştirme uygulamasıdır. Katılımcılar telefonlarından veya web üzerinden uygulamaya girip 8 soruluk bir anketi doldurur. Sistem, verilen cevaplara göre katılımcıları "en uyumlu" ve "çeşitlilik açısından en dengeli" karma masalara otomatik olarak atar. 

Hem modern bir kullanıcı arayüzü (Frontend) hem de sağlam bir veritabanı altyapısı (Backend) içerir. 

## İçindekiler
1. [Ekran Görüntüleri](#ekran-görüntüleri)
2. [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
3. [Özellikler ve Şu Anki Durum](#özellikler-ve-şu-anki-durum)
4. [Proje Yapısı](#proje-yapısı)
5. [Yerel Kurulum ve Çalıştırma](#yerel-kurulum-ve-çalıştırma)
6. [Ortam Değişkenleri (.env)](#ortam-değişkenleri-env)
7. [Eşleştirme Algoritması](#eşleştirme-algoritması)
8. [Canlıya Alma Rehberi (Deployment)](#canlıya-alma-rehberi-deployment)
9. [Bilinen Eksikler](#bilinen-eksikler)

---

## Ekran Görüntüleri
> *Buraya eklenecek: Uygulamanın ana ekranı, anket arayüzü ve admin panelinin ekran görüntüleri.*

---

## Kullanılan Teknolojiler

| Bölüm | Teknoloji | Açıklama |
|---|---|---|
| **Frontend** | React (v19) + Vite (v8) | Modern ve hızlı arayüz kütüphanesi. |
| **Stil / UI** | Tailwind CSS (v4) + Framer Motion | Hızlı biçimlendirme ve akıcı animasyonlar. |
| **Backend** | Node.js + Express (v5) | API sunucusu. |
| **Veritabanı** | better-sqlite3 | Eşzamanlı işlemleri ve kalıcılığı sağlayan, dosya tabanlı güvenilir SQL veritabanı. |
| **Doğrulama (Validation)**| Zod | Gelen isteklerin yapısal bütünlüğünü doğrulamak için (tip güvenliği). |
| **Test** | Vitest + Supertest | Frontend mantığı ve backend API entegrasyon testleri. |

---

## Özellikler ve Şu Anki Durum

| Özellik | Durum |
|---------|-------|
| 🎨 **Kullanıcı Arayüzü (UI)** | ✅ Tamamlandı (Responsive, modern, açık/koyu tema) |
| 📊 **Anket ve Eşleştirme Mantığı** | ✅ Tamamlandı (8 soru, akıllı puanlama) |
| 💾 **Backend ve Veritabanı** | ✅ Tamamlandı (Express + SQLite, atomic transactions) |
| 🔒 **Admin Paneli & Güvenlik** | ✅ Tamamlandı (Token tabanlı doğrulama, IP Rate Limit) |
| 📱 **Geç Gelenler (Latecomer)** | ✅ Tamamlandı (Dolu masalara karışmadan boş yere veya bekleme listesine) |
| 🧪 **Otomatik Testler** | ✅ Tamamlandı (22 Frontend, 10 Backend testi geçiyor) |

---

## Proje Yapısı

Proje genel olarak Frontend (Kök dizin) ve Backend (`/backend`) olarak ikiye ayrılmıştır:

```text
info-session/
├── README.md               # Projenin ana dokümantasyonu
├── API_CONTRACT.md         # Frontend ve Backend arasındaki iletişim kuralları
├── package.json            # Frontend bağımlılıkları ve scriptleri
├── vite.config.js          # Vite ayarları ve Backend proxy yapılandırması
├── .env.example            # Frontend için örnek ortam değişkenleri
├── src/                    # Frontend Kodları
│   ├── api/                # Backend iletişimi (client.js ve mockServer.js)
│   ├── components/         # Yeniden kullanılabilir UI bileşenleri
│   ├── lib/                # Eşleştirme algoritması (matching.js) ve testleri
│   └── pages/              # Sayfalar (Admin, Home, Result vb.)
└── backend/                # Backend Kodları
    ├── package.json        # Backend bağımlılıkları ve scriptleri
    ├── .env.example        # Backend için örnek ortam değişkenleri
    ├── data.db             # SQLite Veritabanı dosyası
    ├── src/
    │   ├── server.js       # Express sunucu yapılandırması
    │   ├── db.js           # Veritabanı bağlantısı
    │   ├── routes/         # API uç noktaları (admin.js, participants.js, tables.js)
    │   └── services/       # İş mantığı (placement.js vb.)
    └── tests/              # Backend entegrasyon testleri
```

---

## Yerel Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için NodeJS (v20+) kurulu olmalıdır. 

### 1. Backend Kurulumu ve Başlatılması
Yeni bir terminal açıp şu komutları çalıştırın:
```bash
cd backend
npm install
npm run dev
```
*(Backend sunucusu varsayılan olarak `http://localhost:3000` portunda ayağa kalkacaktır.)*

### 2. Frontend Kurulumu ve Başlatılması
Projenin **kök dizininde** farklı bir terminal açıp şu komutları çalıştırın:
```bash
npm install
npm run dev
```
*(Frontend sunucusu varsayılan olarak `http://localhost:5173` portunda açılır ve API isteklerini otomatik olarak Backend portu olan 3000'e proxy'ler.)*

### 3. Diğer Yararlı Komutlar (Kök Dizinde)
- `npm run test`: Frontend'deki eşleştirme algoritması ve utility testlerini çalıştırır.
- `npm run seed`: Veritabanına rastgele test verisi (katılımcı) ekler. (Örn: `npm run seed 30` ile 30 kişi eklenir)
- `npm run build`: Projenin üretime (production) hazır halini derler.

*(Backend dizininde `cd backend` sonrası `npm run test` diyerek API uç noktalarının (supertest) testlerini de çalıştırabilirsiniz.)*

---

## Ortam Değişkenleri (.env)

Güvenlik sebebiyle parolalar asla kod içine yazılmaz. Kök dizinde ve `backend/` klasöründe `.env` isimli dosyalar oluşturmalısınız. 

**Kök Dizin (Frontend) `.env` Değişkenleri:**
| Değişken Adı | Açıklama | Örnek Değer |
|--------------|----------|-------------|
| `VITE_USE_MOCK` | Backend olmadan sahte verilerle test etmek için `true` yapılır. Gerçek kullanımda `false` olmalıdır. | `false` |
| `VITE_API_BASE_URL` | İsteklerin gönderileceği ana adres (Eğer Vite config içinde proxy kullanıyorsanız boş bırakılabilir veya kendi URL'niz verilebilir). | `http://localhost:3000` |
| `VITE_ADMIN_PASSWORD` | Sadece Mock (sahte) modda test ederken kullanılan admin şifresi. | *(İstediğiniz bir şifre)* |

**Backend Dizini (`/backend`) `.env` Değişkenleri:**
| Değişken Adı | Açıklama | Örnek Değer |
|--------------|----------|-------------|
| `PORT` | API sunucusunun çalışacağı port. | `3000` |
| `FRONTEND_ORIGIN` | CORS politikası gereği sadece izin verilen Frontend adresleri (virgülle birden fazla eklenebilir). | `http://localhost:5173, http://localhost:5174` |
| `ADMIN_PASSWORD` | **Gerçek Admin Paneli parolası.** Güçlü bir şifre seçmelisiniz. | *(Güçlü bir şifre)* |
| `DB_PATH` | SQLite veritabanı dosyasının konumu. | `./data.db` |

---

## Eşleştirme Algoritması

Eşleştirme mantığı `src/lib/matching.js` içerisinde yer alır ve algoritma temel olarak katılımcıların 8 farklı soruya verdiği yanıtları bir **vektör** olarak değerlendirir. 

1. **Katılımcı Vektörü:** Sosyallik puanı (`social ∈ [-1,1]`), ilgi alanları, sohbet tarzı, etkinlik beklentisi ve bölüm gibi veriler işlenir.
2. **Toplu Dağıtım (Rebalance):** Tüm katılımcılar bir havuzda toplanır. Önce birbirine karakter/sosyallik olarak en uzak kişiler farklı masalara tohum (seed) olarak dağıtılır. Geri kalanlar masaların dengesini bozmayacak ve "çeşitliliği" artıracak şekilde greedy (açgözlü) algoritmayla eklenir. Son olarak binlerce swap (yer değiştirme) denemesi yapılarak genel memnuniyet skoru maksimize edilir.
3. **Puanlama Kriterleri:**
   - Masadaki **ortak ilgi alanı** fazlalığı (+ puan)
   - İçe/Dışa dönüklük oranının **dengeli** olması (+ puan)
   - İnsanların farklı sohbet tarzlarında olması (çeşitlilik) (+ puan)
   - Birebir aynı bölümde olan kişilerin aynı masada fazlaca kümelenmemesi (- puan)
4. **Geç Gelenler (Latecomer):** Etkinlik başladıktan veya toplu dağıtım yapıldıktan sonra gelenler (`placeLatecomer`), o an oturan kimsenin yerini bozmadan kendilerine en uygun müsait masaya yerleştirilir. 
5. **Kapasite ve Bekleme Listesi:** Varsayılan olarak maksimum masa sayısı 12, kişi başı kapasite 6'dır (Toplam 72 kişi). 72 kişiden sonra gelenler "Bekleme Listesi" (Waitlist) havuzuna alınır.

---

## Canlıya Alma Rehberi (Deployment)

Projeyi internete açmak (Canlıya almak) için:

1. **Frontend'i Derleme (Build):** Kök dizinde `npm run build` komutunu çalıştırın. Bu komut `dist/` adında optimize edilmiş statik dosyalar oluşturur. Bu klasörü Vercel, Netlify veya herhangi bir statik sunucuda (Nginx/Apache) yayınlayabilirsiniz.
2. **Backend'i Başlatma:** Backend klasörünüze gidin, `.env` dosyasını (özellikle `FRONTEND_ORIGIN` ve `ADMIN_PASSWORD`) doğru yapılandırın. Terminalde `node src/server.js` (veya `pm2 start src/server.js`) komutuyla API'yi ayaklandırın.
3. **Kalıcı Depolama Uyarısı (SQLite):** Backend SQLite kullandığı için, uygulamanızın çalıştığı sunucunun (örn: Render, Heroku) **kalıcı bir diski (persistent disk/volume)** olduğundan emin olun! Aksi halde her deploy veya yeniden başlatmada veritabanı (data.db) silinebilir.

---

## Bilinen Eksikler
- **Gerçek zamanlı güncellemeler:** Masalardaki güncellemeleri Admin paneli her 5 saniyede bir çekmektedir. Çok büyük bir katılımcı trafiğinde WebSockets/Server-Sent Events'e (SSE) geçilmesi gerekebilir.
- **Kişiye Özel Silme İşlemi:** Şimdilik sadece Admin panelinden tüm veritabanı sıfırlanabilmektedir. Tekil bir kullanıcıyı sistemden çıkarma özelliği şu an mevcut değildir, ancak kullanıcının masası değiştirilebilir.
