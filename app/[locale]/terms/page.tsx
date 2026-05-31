import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

const content: Record<string, any> = {
  ar: {
    title: 'الشروط والأحكام',
    updated: 'آخر تحديث: يونيو 2025',
    back: 'العودة للرئيسية',
    sections: [
      {
        title: '1. قبول الشروط',
        body: 'باستخدامك لمنصة contactme.cc فأنت توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى التوقف عن استخدام الخدمة.',
      },
      {
        title: '2. الاستخدام المقبول',
        body: 'يجب استخدام المنصة للأغراض المشروعة فقط. يُحظر نشر محتوى مسيء، مضلل، أو ينتهك حقوق الآخرين.',
      },
      {
        title: '3. حسابك',
        body: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب إخطارنا فوراً عند اشتباهك في أي استخدام غير مصرح به.',
      },
      {
        title: '4. المحتوى',
        body: 'أنت تمتلك المحتوى الذي تنشره. بنشره على المنصة، تمنحنا ترخيصاً لعرضه. نحتفظ بحق إزالة أي محتوى ينتهك هذه الشروط.',
      },
      {
        title: '5. الخدمة المجانية',
        body: 'نقدم الخدمة الأساسية مجاناً. نحتفظ بالحق في تغيير الميزات المتاحة في الخطة المجانية مع إشعار مسبق.',
      },
      {
        title: '6. إنهاء الخدمة',
        body: 'نحتفظ بحق تعليق أو إنهاء أي حساب يخالف هذه الشروط. يمكنك حذف حسابك في أي وقت.',
      },
      {
        title: '7. تحديث الشروط',
        body: 'قد نحدّث هذه الشروط من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني.',
      },
      {
        title: '8. التواصل',
        body: 'لأي استفسار بخصوص هذه الشروط، تواصل معنا على: support@contactme.cc',
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: June 2025',
    back: 'Back to Home',
    sections: [
      {
        title: '1. Acceptance of Terms',
        body: 'By using contactme.cc, you agree to these Terms of Service. If you do not agree, please stop using the service.',
      },
      {
        title: '2. Acceptable Use',
        body: 'You must use the platform for lawful purposes only. Posting offensive, misleading, or rights-infringing content is prohibited.',
      },
      {
        title: '3. Your Account',
        body: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any suspected unauthorized use.',
      },
      {
        title: '4. Content',
        body: 'You own the content you post. By publishing it on the platform, you grant us a license to display it. We reserve the right to remove content that violates these terms.',
      },
      {
        title: '5. Free Service',
        body: 'We provide the basic service for free. We reserve the right to change features available in the free plan with prior notice.',
      },
      {
        title: '6. Termination',
        body: 'We reserve the right to suspend or terminate any account that violates these terms. You may delete your account at any time.',
      },
      {
        title: '7. Updates to Terms',
        body: 'We may update these terms from time to time. We will notify you of any material changes via email.',
      },
      {
        title: '8. Contact',
        body: 'For any questions about these terms, contact us at: support@contactme.cc',
      },
    ],
  },
}

export default function TermsPage({ params }: Props) {
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
