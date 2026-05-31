import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

const content: Record<string, any> = {
  ar: {
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: يونيو 2025',
    back: 'العودة للرئيسية',
    sections: [
      {
        title: '1. المعلومات التي نجمعها',
        body: 'نجمع المعلومات التي تقدمها مباشرة عند إنشاء حساب، مثل: الاسم، البريد الإلكتروني، رقم الواتساب، والروابط التي تضيفها لبروفايلك.',
      },
      {
        title: '2. كيف نستخدم معلوماتك',
        body: 'نستخدم معلوماتك لتشغيل الخدمة، تحسين تجربتك، وإرسال إشعارات متعلقة بحسابك. لا نبيع بياناتك لأي طرف ثالث.',
      },
      {
        title: '3. مشاركة المعلومات',
        body: 'البروفايل الذي تنشئه هو بروفايل عام يمكن لأي شخص مشاهدته عبر الرابط. بإمكانك التحكم في ما تعرضه من معلومات في إعدادات حسابك.',
      },
      {
        title: '4. حماية البيانات',
        body: 'نستخدم تشفير SSL لحماية بياناتك. يتم تخزين البيانات على خوادم آمنة عبر Supabase.',
      },
      {
        title: '5. ملفات تعريف الارتباط (Cookies)',
        body: 'نستخدم cookies لحفظ جلسة تسجيل الدخول وتفضيلات اللغة فقط.',
      },
      {
        title: '6. حقوقك',
        body: 'يحق لك طلب حذف حسابك وبياناتك في أي وقت عبر التواصل معنا على support@contactme.cc.',
      },
      {
        title: '7. التواصل معنا',
        body: 'لأي استفسار بخصوص سياسة الخصوصية، تواصل معنا على: support@contactme.cc',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2025',
    back: 'Back to Home',
    sections: [
      {
        title: '1. Information We Collect',
        body: 'We collect information you provide when creating an account, such as name, email, WhatsApp number, and links you add to your profile.',
      },
      {
        title: '2. How We Use Your Information',
        body: 'We use your information to operate the service, improve your experience, and send account-related notifications. We never sell your data to third parties.',
      },
      {
        title: '3. Information Sharing',
        body: 'Your profile is public and can be viewed by anyone with your link. You control what information is displayed in your account settings.',
      },
      {
        title: '4. Data Protection',
        body: 'We use SSL encryption to protect your data. Data is stored on secure servers via Supabase.',
      },
      {
        title: '5. Cookies',
        body: 'We use cookies only to maintain your login session and language preferences.',
      },
      {
        title: '6. Your Rights',
        body: 'You may request deletion of your account and data at any time by contacting us at support@contactme.cc.',
      },
      {
        title: '7. Contact Us',
        body: 'For any privacy-related questions, contact us at: support@contactme.cc',
      },
    ],
  },
}

export default function PrivacyPage({ params }: Props) {
  const { locale } = params
  const c = content[locale] || content['ar']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-8 transition-colors">
          ← {c.back}
        </Link>
        <h1 className="text-3xl font-extrabold mb-2">{c.title}</h1>
        <p className="text-sm text-[var(--text-muted)] mb-10">{c.updated}</p>
        <div className="space-y-8">
          {c.sections.map((s: any, i: number) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-base mb-3">{s.title}</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
