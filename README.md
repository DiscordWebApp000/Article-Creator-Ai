# AI Makale Üretici

Modern web teknolojileri ve Google'ın Gemini AI modelini kullanarak, teknoloji dünyasındaki en son gelişmeler hakkında özgün ve profesyonel makaleler üreten bir web uygulaması.

## 🎯 Proje Amacı

- Güncel teknoloji gelişmeleri hakkında özgün makaleler üretme
- Spesifik ve ölçülebilir veriler içeren başlıklar oluşturma
- Teknoloji liderleri ve yatırım trendleri hakkında içerik sağlama
- Profesyonel gelişim için kaynak oluşturma

## 🚀 Özellikler

### Başlık Üretimi
- **AI Destekli Başlıklar**
  - Güncel teknoloji gelişmelerine odaklı
  - Spesifik ürün ve güncellemeler
  - Ölçülebilir veriler ve etkiler
  - Kategori bazlı özelleştirme

### İçerik Kategorileri
- **Teknoloji Trendleri**
  - AI ve ML güncellemeleri
  - Donanım ve çip teknolojileri
  - Sürdürülebilir teknoloji
  - Uzay ve sağlık teknolojileri

- **Teknoloji Liderleri**
  - Lider profilleri ve stratejileri
  - Şirket kararları ve yatırımlar
  - Vizyon ve gelecek planları
  - Teknoloji trendlerine yaklaşımlar

- **Yatırım İçgörüleri**
  - Teknoloji şirketleri analizleri
  - Pazar projeksiyonları
  - Finansal metrikler
  - Risk ve fırsat değerlendirmeleri

- **Kişisel Gelişim**
  - Dijital beceriler
  - Kariyer stratejileri
  - Sertifikasyon yol haritaları
  - Verimlilik teknikleri

### Kullanıcı Arayüzü
- Modern ve responsive tasarım
- Karanlık/Aydınlık mod desteği
- Markdown formatında içerik
- Kategori bazlı filtreleme
- Arama fonksiyonu

## 🛠 Teknoloji Stack

### Backend
- Node.js & Express.js
- Google Gemini AI API
- Rate limiting ve güvenlik
- Markdown desteği

### Frontend
- Next.js 13+
- React & TypeScript
- Tailwind CSS
- React Markdown
- Tema desteği

## 💻 Kurulum

1. Repoyu klonlayın:
```bash
git clone [repo-url]
cd video-app
```

2. Backend kurulumu:
```bash
cd backend
npm install
```

3. Frontend kurulumu:
```bash
cd web
npm install
```

4. Backend için .env dosyası oluşturun:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Çalıştırma

1. Backend'i başlatın:
```bash
cd backend
npm run dev
```

2. Frontend'i başlatın:
```bash
cd web
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
video-app/
├── backend/
│   ├── index.js
│   └── package.json
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── api/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── types/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Yapılandırma

### Backend Yapılandırması
- `PORT`: API sunucusunun çalışacağı port (varsayılan: 3001)
- `GEMINI_API_KEY`: Google Gemini AI API erişim anahtarı

### Rate Limiting
- Makale üretimi: Dakikada 1 istek
- Başlık üretimi: Dakikada 5 istek
- Genel istekler: Dakikada 30 istek

### İçerik Limitleri
- Makale uzunluğu: 800-2000 kelime
- Başlık uzunluğu: 3-8 kelime
- Minimum bekleme süresi: 30 saniye
- Maksimum bekleme süresi: 120 saniye

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔗 Faydalı Linkler

- [Google Gemini AI Dokümantasyonu](https://ai.google.dev/docs)
- [Next.js Dokümantasyonu](https://nextjs.org/docs)
- [React Markdown Dokümantasyonu](https://remarkjs.github.io/react-markdown/) 