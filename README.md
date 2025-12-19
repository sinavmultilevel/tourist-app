# Ichan Kala AI Tur Rehberi 🇺🇿

Ichan Kala (Khiva) için mobil öncelikli, yapay zeka destekli tur rehberi platformu. Sesli turlar, yer tanıma ve kişiselleştirilmiş planlama özelliklerini içerir.

## 📱 Özellikler

- **Yapay Zeka Sesli Tur**: Konuma duyarlı hikaye anlatımı.
- **Görsel Tanıma**: Herhangi bir binanın fotoğrafını çekin ve tarihini öğrenin.
- **Orijinallik Kontrolü**: Yerel el sanatlarını analiz edin, orijinalliği ve fiyatı doğrulayın.
- **Akıllı Planlayıcı**: Kişiselleştirilmiş yürüyüş rotaları oluşturun.
- **Canlı Çevirmen**: Daha kolay iletişim için gerçek zamanlı ses ve metin çevirisi.

## Admin Panel

The application includes a fully functional Admin Panel for content management.

- **URL**: `http://localhost:3005/admin`
- **Default Credentials**:
  - Email: `admin@ichankala.com`
  - Password: `admin123`

### Features
- Dashboard with system statistics
- Management of Places, Hotels, Restaurants, and Shops
- Global Configuration (Pricing, Languages)
- Secure JWT Authentication

## 🏗 Teknoloji Yığını

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons.
- **Backend**: Python FastAPI, SQLAlchemy, PostgreSQL (Yerel için SQLite).
- **Yapay Zeka**: Mock servisler (OpenAI/Google Vision sistemlerine geçişe uygun tasarlanmıştır).

## 🚀 Başlangıç

### Gereksinimler

- Node.js 18+
- Python 3.9+

### 1. Backend Kurulumu

```bash
cd backend
python -m venv venv
# Windows için:
.\venv\Scripts\activate
# Mac/Linux için:
# source venv/bin/activate

pip install -r requirements.txt

# Sunucuyu çalıştırın
uvicorn app.main:app --reload
```
Sunucu `http://localhost:8000` adresinde başlayacaktır. API Dokümantasyonu: `http://localhost:8000/docs`.

### 2. Frontend Kurulumu

```bash
cd frontend
npm install

# Geliştirme sunucusunu çalıştırın
npm run dev
```
Uygulama `http://localhost:3000` adresinde başlayacaktır.

## 📂 Proje Yapısı

- `backend/app/models`: SQLAlchemy kullanan veritabanı şeması.
- `backend/app/api`: REST API uç noktaları.
- `backend/app/services`: İş mantığı ve yapay zeka mock servisleri.
- `frontend/app`: Next.js App Router sayfaları.

## ⚠️ Mock Veri Notu

Bu proje, ücretli API anahtarlarına ihtiyaç duymadan işlevselliği göstermek için **Mock Yapay Zeka Servisleri** (`backend/app/services/ai_service.py`) kullanır. Görüntü tanıma ve planlama için statik veriler döndürür. Gerçek yapay zekayı etkinleştirmek için servis yöntemlerini kendi LLM sağlayıcınızı çağıracak şekilde güncellemeniz yeterlidir.
