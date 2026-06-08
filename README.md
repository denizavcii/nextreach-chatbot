# NextReach Chatbot

NextReach'in landing page'indeki "Bize Ulaşın" formunun yerini alan web chatbot'u. 6 saatlik stajyer değerlendirme görevi olarak geliştirildi.

**Canlı Link:** https://nextreach-chatbot-snowy.vercel.app  
**Admin Panel:** https://nextreach-chatbot-snowy.vercel.app/admin

---

## Kurulum

```bash
git clone https://github.com/denizavcii/nextreach-chatbot.git
cd nextreach-chatbot
npm install
```

`.env.local` dosyası oluştur:

```
NEXT_PUBLIC_SUPABASE_URL=supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
```

```bash
npm run dev
```

Tarayıcıda aç: http://localhost:3000

---

## Teknoloji Seçimleri

| Teknoloji             | Neden                                                       |
| --------------------- | ----------------------------------------------------------- |
| Next.js + Tailwind    | Frontend ve API route'ları tek projede, hızlı UI geliştirme |
| Supabase              | Hızlı kurulum, ücretsiz tier, basit JS client               |
| Kural tabanlı chatbot | Öngörülebilir, debug edilebilir, 6 saatlik limite uygun     |

---

## Nasıl Çalışır

Ziyaretçi "Bize Ulaşın" butonuna tıklar, chatbot sırayla şunları toplar:

1. İsim
2. Şirket adı
3. Sektör
4. Sorun / ihtiyaç
5. Ekip büyüklüğü
6. Aciliyet
7. E-posta
8. Telefon (isteğe bağlı)

E-posta veya telefon verilmezse talep sisteme **kaydedilmez**.

---

## Lead Skor Sistemi (1-10)

| Bilgi                                   | Puan |
| --------------------------------------- | ---- |
| E-posta + telefon ikisi                 | +4   |
| Sadece e-posta veya telefon             | +2   |
| Aciliyet: Hemen                         | +3   |
| Aciliyet: 1-3 ay içinde                 | +2   |
| Aciliyet: Sadece araştırıyorum          | +1   |
| Ekip 50+ kişi                           | +2   |
| Ekip 10-49 kişi                         | +1   |
| Detaylı sorun açıklaması (20+ karakter) | +1   |

- **7-10 → Sıcak** — hemen ara
- **4-6 → Orta** — bu hafta dön
- **0-3 → Soğuk** — düşük öncelik

---

## Admin Panel Özellikleri

- Özet kartlar: toplam talep, sıcak lead, okunmadı, daha önce ulaşmış
- Her lead için tam konuşma geçmişi
- Okundu/okunmadı işareti
- Daha önce ulaşmış tespiti (aynı email veya telefon)
- Yenile butonu

---

## PRD'de Muğlak Bırakılan Kararlar

**Chatbot tonu:** Samimi ve kısa. Resmi değil ama profesyonel.

**İyi/kötü lead ayrımı:** Ulaşılabilirlik ve aciliyet en yüksek puanı alıyor — satış ekibi için bunlar öncelikli.

**Admin view:** Üstte özet kartlar, altta tablo. Satış ekibi günde bir bakışta "bugün kim gelmiş, neden" sorusunu cevaplayabiliyor.

**Spam koruması:** E-posta validasyonu zorunlu, minimum 7 adım tamamlanmadan kayıt yapılmıyor. Aynı email veya telefon tekrar gelirse işaretleniyor.

**Soru atlamak istemezse:** Telefon isteğe bağlı. Diğer sorular bir kez tekrarlanıyor ama zorlanmıyor.

---

## Daha Fazla Zamanda Yapılacaklar

- Yeni lead gelince satış ekibine e-posta bildirimi
- Admin panelde filtreleme ve arama
- Rate limiting (spam engelleme)
- Claude API ile daha doğal chatbot akışı
- Admin panelde lead'e not ekleme

---

## Toplam Süre

~5,5 saat
