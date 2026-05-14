# contactme.cc — تواصل بسهولة، اعمل بذكاء

منصة بروفايل رقمي متكاملة تتيح لك إنشاء صفحة تعريفية احترافية مع رمز QR مخصص وبطاقة أعمال رقمية.

## 🚀 المميزات

- **بروفايل شخصي أو شركة** — صفحة تعريفية متكاملة مع روابط وسائل التواصل الاجتماعي
- **رمز QR مخصص** — ولّد رمز QR لبروفايلك وحمّله كصورة PNG
- **ماسح بطاقات الأعمال** — ارفع صورة بطاقة أعمال واستخرج بياناتها تلقائياً بالذكاء الاصطناعي
- **إحصائيات المشاهدات** — تتبع عدد زوار بروفايلك
- **دعم الوضع الليلي** — تجربة مريحة في جميع الأوقات
- **تصميم عربي RTL** — مبني من الأساس للعربية

## 🛠️ التقنيات المستخدمة

- **Next.js 14** (App Router)
- **Supabase** (قاعدة البيانات والمصادقة والتخزين)
- **Tailwind CSS** (التصميم)
- **Anthropic Claude** (الذكاء الاصطناعي لمسح البطاقات)
- **Vercel** (النشر)

## ⚙️ الإعداد والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/contactme.git
cd contactme
npm install
```

### 2. متغيرات البيئة

انسخ ملف `.env.example` إلى `.env.local` وأضف قيمك:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_SITE_URL=https://contactme.cc
```

### 3. إعداد قاعدة البيانات

شغّل ملف `supabase/schema.sql` في لوحة تحكم Supabase.

### 4. تشغيل التطبيق

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 📦 النشر على Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. ادفع الكود إلى GitHub
2. اربط المستودع في Vercel
3. أضف متغيرات البيئة
4. انشر!

## 💳 خطط الاشتراك

| الخطة | السعر | المميزات |
|-------|-------|----------|
| مجاني | 0 ريال | بروفايل أساسي، 3 روابط، إعلانات، QR أساسي |
| برو فردي | 15 ريال/شهر | روابط غير محدودة، بدون إعلانات، QR مخصص، ماسح البطاقات، إحصائيات |
| برو شركة | 49 ريال/شهر | شركة + 10 موظفين، كتالوج خدمات، زر حجز، إحصائيات الفريق |

## 🗄️ مخطط قاعدة البيانات

- **profiles** — بيانات المستخدمين والشركات
- **links** — الروابط المرتبطة بكل بروفايل
- **services** — خدمات الشركات
- **profile_views** — إحصائيات المشاهدات

## 📄 الترخيص

MIT License
