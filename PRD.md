# AI Makale Üretici - Ürün Gereksinim Dokümanı (PRD)

## 1. Ürün Özeti

AI Makale Üretici, Google'ın Gemini AI modelini kullanarak otomatik makale ve başlık üreten modern bir web uygulamasıdır. Uygulama, teknoloji, liderlik, yatırım ve kişisel gelişim alanlarında güncel ve özgün içerik üretmeyi amaçlar.

## 2. Hedef Kitle

- İçerik üreticileri ve blog yazarları
- Teknoloji ve dijital medya şirketleri
- Dijital pazarlama uzmanları
- Teknoloji ve blockchain konularında içerik arayan profesyoneller
- Yatırımcılar ve finans profesyonelleri
- Kurumsal iletişim uzmanları
- Kariyer gelişimi arayanlar ve profesyoneller

## 3. İçerik Kategorileri ve Özellikler

### 3.1 Teknoloji Trendleri (tech-trends)
- **Kapsam:**
  - Yapay Zeka ve ML güncellemeleri
  - Blockchain ve kripto teknolojileri
  - Donanım ve çip teknolojileri
  - Sürdürülebilir teknoloji çözümleri
  - Uzay teknolojisi gelişmeleri
  - Sağlık teknolojileri
- **Başlık Formatı:**
  - Şirket/Ürün adı
  - Spesifik özellik/güncelleme
  - Sayısal veri/etki
  - Örnek: "OpenAI'ın GPT-4V Modeli: Görsel Analiz Başarısı %95'e Ulaştı"

### 3.2 Teknoloji Liderleri (tech-leaders)
- **Kapsam:**
  - Lider profilleri ve stratejileri
  - Yatırım ve şirket kararları
  - Vizyon ve gelecek planları
  - Teknoloji trendlerine yaklaşımları
- **Başlık Formatı:**
  - Lider adı
  - Proje/Strateji detayı
  - Somut hedef/etki
  - Örnek: "Sam Altman'ın Q* Projesi: AGI'ye Giden Yol Haritası"

### 3.3 Yatırım İçgörüleri (investment-insights)
- **Kapsam:**
  - Teknoloji şirketleri finansalları
  - Pazar analizleri ve projeksiyonlar
  - Yatırım fırsatları ve riskler
  - Sektörel trendler
- **Başlık Formatı:**
  - Şirket/Sektör adı
  - Finansal metrik/gelişme
  - Sayısal veri
  - Örnek: "NVIDIA'nın AI Çip Satışları: Q4'te %300 Büyüme"

### 3.4 Kişisel Gelişim (personal-growth)
- **Kapsam:**
  - Dijital beceriler ve sertifikasyonlar
  - Kariyer gelişimi stratejileri
  - Uzaktan çalışma ve verimlilik
  - Liderlik ve iletişim becerileri
- **Başlık Formatı:**
  - Spesifik beceri/alan
  - Metodoloji/yaklaşım
  - Somut sonuç/etki
  - Örnek: "AWS Solutions Architect Sertifikası: 6 Haftalık Yol Haritası"

## 4. Teknik Özellikler

### 4.1 AI Entegrasyonu
- **Gemini AI API Kullanımı:**
  - Model: gemini-pro
  - Özelleştirilmiş promptlar
  - Kategori bazlı içerik üretimi
  - Başlık ve makale üretimi için ayrı sistemler

- **Prompt Optimizasyonu:**
  - Kategori bazlı özel promptlar
  - Güncel olayları takip eden dinamik içerik
  - Spesifik ve ölçülebilir sonuçlar
  - SEO dostu başlık formatları

- **Yedek Sistemler:**
  - Önceden hazırlanmış başlık şablonları
  - Kategori bazlı yedek başlıklar
  - Otomatik keyword üretimi
  - Hata durumunda alternatif içerik

### 4.2 Backend Mimarisi
- **API Endpoints:**
  - GET /api/articles: Makaleleri listele
  - POST /api/articles/generate: Yeni makale üret
  - DELETE /api/articles/:id: Makale sil
  - GET /api/topics/random: Rastgele başlıklar üret

- **Rate Limiting:**
  - Makale üretimi: Dakikada 1 istek
  - Başlık üretimi: Dakikada 5 istek
  - Genel istekler: Dakikada 30 istek

- **Güvenlik:**
  - API anahtarı validasyonu
  - CORS koruması
  - Rate limiting
  - Girdi doğrulama

### 4.3 Frontend Özellikleri
- **Kullanıcı Arayüzü:**
  - Modern ve responsive tasarım
  - Karanlık/Aydınlık mod
  - Akordiyon tarzı makale listesi
  - Markdown önizleme

- **İçerik Yönetimi:**
  - Kategori bazlı filtreleme
  - Arama fonksiyonu
  - Makale arşivi
  - Başlık önerileri

## 5. Performans Gereksinimleri

- **Yanıt Süreleri:**
  - Başlık üretimi: < 5 saniye
  - Makale üretimi: < 30 saniye
  - Sayfa yükleme: < 3 saniye
  - API yanıtları: < 1 saniye

- **Ölçeklenebilirlik:**
  - Eşzamanlı kullanıcı: 100+
  - Günlük makale üretimi: 1000+
  - Depolama: Otomatik ölçeklenen
  - Yedekleme: Günlük

## 6. Kalite Metrikleri

- **İçerik Kalitesi:**
  - Başlık özgünlüğü
  - Makale tutarlılığı
  - Güncellik
  - SEO uyumluluğu

- **Teknik Performans:**
  - Uptime: %99.9
  - Hata oranı: < %1
  - API başarı oranı: > %99
  - Ortalama yanıt süresi

## 7. Gelecek Geliştirmeler

### 7.1 Kısa Vadeli (3-6 ay)
- Kullanıcı hesapları ve kimlik doğrulama
- İçerik takvimi ve zamanlama
- Toplu makale üretimi
- Dil seçenekleri (EN/TR)

### 7.2 Orta Vadeli (6-12 ay)
- API entegrasyonu
- İçerik analizi ve raporlama
- SEO optimizasyon araçları
- Otomatik sosyal medya paylaşımları

### 7.3 Uzun Vadeli (12+ ay)
- Özelleştirilebilir AI modelleri
- Sektör spesifik içerik üretimi
- Gelişmiş analitik ve tahminleme
- Çoklu dil desteği

## 8. Teknik Gereksinimler

### 8.1 Sunucu
- Node.js 14+
- Express.js
- 2GB+ RAM
- 20GB+ SSD
- Gemini AI API erişimi

### 8.2 İstemci
- Modern web tarayıcısı
- JavaScript desteği
- Minimum 1024x768 ekran
- Stabil internet bağlantısı

## 9. Güvenlik ve Uyumluluk

### 9.1 Veri Güvenliği
- HTTPS zorunluluğu
- API anahtarı şifreleme
- Kullanıcı verisi koruma
- Düzenli güvenlik taramaları

### 9.2 Uyumluluk
- GDPR uyumluluğu
- KVKK uyumluluğu
- Telif hakkı kontrolü
- İçerik moderasyonu 