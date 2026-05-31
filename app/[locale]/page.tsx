import Navbar from '@/components/Navbar'
import QRGenerator from '@/components/QRGenerator'
import PrintDesigner from '@/components/PrintDesigner'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

const content: Record<string, any> = {
  ar: {
    badge: 'منصة contactme الرقمية',
    title1: 'تواصل بسهولة',
    title2: 'اعمل بذكاء',
    description: 'أنشئ بروفايلك الرقمي الاحترافي في دقائق. بياناتك، روابطك، ورمز QR مخصص — كل شيء في مكان واحد.',
    ctaPrimary: 'أنشئ بروفايلك مجاناً',
    ctaSecondary: 'شاهد المثال',
    badges: ['بدون بطاقة ائتمان', 'متعدد اللغات', 'مجاني للأبد'],
    featuresTitle: 'كل ما تحتاجه في مكان واحد',
    featuresSubtitle: 'أدوات احترافية لتعزيز حضورك الرقمي',
    features: [
      { icon: '🔗', title: 'روابط غير محدودة', desc: 'اجمع كل روابطك المهمة في صفحة واحدة' },
      { icon: '📱', title: 'رمز QR ذكي', desc: 'أنشئ رمز QR مخصص الألوان يفتح بروفايلك فوراً' },
      { icon: '🤖', title: 'ماسح بطاقات ذكي', desc: 'استخرج بيانات أي بطاقة أعمال بصورة واحدة' },
      { icon: '🎴', title: 'بطاقة أعمال رقمية', desc: 'صمّم بطاقتك وحمّلها PDF جاهز للطباعة' },
      { icon: '📊', title: 'إحصائيات المشاهدات', desc: 'تابع من زار بروفايلك ومتى' },
      { icon: '🌍', title: 'دعم متعدد اللغات', desc: 'واجهة كاملة بـ 5 لغات عالمية' },
    ],
    pricingTitle: 'الأسعار',
    pricingSubtitle: 'ابدأ مجاناً — بدون بطاقة ائتمان',
    plans: [
      {
        name: 'مجاني',
        price: '$0',
        period: 'للأبد',
        desc: 'مثالي للأفراد',
        features: ['بروفايل رقمي كامل', 'روابط غير محدودة', 'رمز QR مخصص', 'بطاقة أعمال رقمية', 'ماسح بطاقات', 'دعم 5 لغات'],
        cta: 'ابدأ مجاناً',
        highlighted: false,
      },
      {
        name: 'Pro',
        price: 'قريباً',
        period: '',
        desc: 'للمحترفين والشركات',
        features: ['كل مميزات المجاني', 'ماسح بطاقات غير محدود', 'تصدير جهات الاتصال Excel', 'إحصائيات متقدمة', 'دعم أولوي', 'بدون إعلانات'],
        cta: 'أبلغني عند الإطلاق',
        highlighted: true,
      },
    ],
    print: {
      title: 'قم بتصميم بطاقة الأعمال مجاناً',
      subtitle: 'صمّم داخل المنصة وحمّل ملف جاهز للطباعة',
      noteLabel: 'ملاحظة',
      downloadPdfLabel: 'تحميل PDF',
      downloadPngLabel: 'تحميل PNG',
      printLabel: 'طباعة',
      steps: [
        { icon: '🎨', title: 'صمّم', description: 'اختر الألوان والخط من لوحة التحكم' },
        { icon: '📄', title: 'حمّل PDF', description: 'جاهز للطباعة بدقة عالية' },
        { icon: '🖨️', title: 'اطبع', description: 'في أي مطبعة أو من البيت' },
      ],
    },
    ctaTitle: 'جاهز تبدأ؟',
    ctaDesc: 'أنشئ بروفايلك الآن مجاناً — لا تحتاج بطاقة ائتمان',
    ctaBtn: 'ابدأ مجاناً الآن',
    footer: {
      copy: `© ${new Date().getFullYear()} contactme.cc — جميع الحقوق محفوظة`,
      tagline: 'مبني بـ ❤️ للمحترفين العرب والعالم',
      links: [
        { label: 'سياسة الخصوصية', href: '/ar/privacy' },
        { label: 'الشروط والأحكام', href: '/ar/terms' },
        { label: 'تواصل معنا', href: 'mailto:support@contactme.cc' },
      ],
    },
  },
  en: {
    badge: 'contactme digital platform',
    title1: 'Connect effortlessly',
    title2: 'Work smarter',
    description: 'Build your professional digital profile in minutes. Links, contact details, and a custom QR code — all in one place.',
    ctaPrimary: 'Create your profile free',
    ctaSecondary: 'See example',
    badges: ['No credit card', 'Multilingual', 'Free forever'],
    featuresTitle: 'Everything you need in one place',
    featuresSubtitle: 'Professional tools to boost your digital presence',
    features: [
      { icon: '🔗', title: 'Unlimited links', desc: 'Gather all your important links in one shareable page' },
      { icon: '📱', title: 'Smart QR code', desc: 'Create a custom-colored QR that opens your profile instantly' },
      { icon: '🤖', title: 'AI card scanner', desc: 'Extract data from any business card with one photo' },
      { icon: '🎴', title: 'Digital business card', desc: 'Design and download as print-ready PDF' },
      { icon: '📊', title: 'View analytics', desc: 'Track who visited your profile and when' },
      { icon: '🌍', title: 'Multilingual', desc: 'Full interface in 5 global languages' },
    ],
    pricingTitle: 'Pricing',
    pricingSubtitle: 'Start free — no credit card required',
    plans: [
      {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for individuals',
        features: ['Full digital profile', 'Unlimited links', 'Custom QR code', 'Digital business card', 'Card scanner', '5 language support'],
        cta: 'Start for free',
        highlighted: false,
      },
      {
        name: 'Pro',
        price: 'Coming soon',
        period: '',
        desc: 'For professionals & businesses',
        features: ['Everything in Free', 'Unlimited card scanner', 'Export contacts to Excel', 'Advanced analytics', 'Priority support', 'No ads'],
        cta: 'Notify me at launch',
        highlighted: true,
      },
    ],
    print: {
      title: 'Design your business card for free',
      subtitle: 'Design inside the platform and download a print-ready file',
      noteLabel: 'Note',
      downloadPdfLabel: 'Download PDF',
      downloadPngLabel: 'Download PNG',
      printLabel: 'Print',
      steps: [
        { icon: '🎨', title: 'Design', description: 'Choose colors and fonts from the dashboard' },
        { icon: '📄', title: 'Download PDF', description: 'High resolution, print-ready' },
        { icon: '🖨️', title: 'Print', description: 'At any print shop or at home' },
      ],
    },
    ctaTitle: 'Ready to start?',
    ctaDesc: 'Create your profile now for free — no credit card needed',
    ctaBtn: 'Start for free now',
    footer: {
      copy: `© ${new Date().getFullYear()} contactme.cc — All rights reserved`,
      tagline: 'Built with ❤️ for professionals worldwide',
      links: [
        { label: 'Privacy Policy', href: '/en/privacy' },
        { label: 'Terms of Service', href: '/en/terms' },
        { label: 'Contact Us', href: 'mailto:support@contactme.cc' },
      ],
    },
  },
  zh: {
    badge: 'contactme 数字平台',
    title1: '轻松连接',
    title2: '更聪明地工作',
    description: '几分钟内创建您的专业数字个人资料。',
    ctaPrimary: '创建个人资料',
    ctaSecondary: '查看示例',
    badges: ['无需信用卡', '多语言支持', '永久免费'],
    featuresTitle: '所有功能，一应俱全',
    featuresSubtitle: '专业工具，提升您的数字形象',
    features: [
      { icon: '🔗', title: '无限链接', desc: '将所有重要链接汇集在一个可分享的页面上' },
      { icon: '📱', title: '智能二维码', desc: '创建自定义颜色的二维码' },
      { icon: '🤖', title: 'AI名片扫描仪', desc: '一张照片即可提取名片数据' },
      { icon: '🎴', title: '数字名片', desc: '设计并下载为可打印PDF' },
      { icon: '📊', title: '查看分析', desc: '跟踪谁访问了您的个人资料' },
      { icon: '🌍', title: '多语言支持', desc: '完整支持5种全球语言' },
    ],
    pricingTitle: '定价',
    pricingSubtitle: '免费开始 — 无需信用卡',
    plans: [
      { name: '免费', price: '$0', period: '永久', desc: '适合个人', features: ['完整数字档案', '无限链接', '自定义二维码', '数字名片', '名片扫描', '5种语言'], cta: '免费开始', highlighted: false },
      { name: 'Pro', price: '即将推出', period: '', desc: '适合专业人士', features: ['免费版所有功能', '无限名片扫描', '导出Excel', '高级分析', '优先支持', '无广告'], cta: '发布时通知我', highlighted: true },
    ],
    print: { title: '免费设计名片', subtitle: '在平台内设计并下载可打印文件', noteLabel: '注意', downloadPdfLabel: '下载 PDF', downloadPngLabel: '下载 PNG', printLabel: '打印', steps: [{ icon: '🎨', title: '设计', description: '从仪表板选择颜色和字体' }, { icon: '📄', title: '下载 PDF', description: '高分辨率，可打印' }, { icon: '🖨️', title: '打印', description: '在任何打印店或在家' }] },
    ctaTitle: '准备好开始了吗？',
    ctaDesc: '立即免费创建您的个人资料',
    ctaBtn: '立即免费开始',
    footer: { copy: `© ${new Date().getFullYear()} contactme.cc — 保留所有权利`, tagline: '用 ❤️ 为全球专业人士打造', links: [{ label: '隐私政策', href: '/zh/privacy' }, { label: '服务条款', href: '/zh/terms' }, { label: '联系我们', href: 'mailto:support@contactme.cc' }] },
  },
  fr: {
    badge: 'Plateforme numérique contactme',
    title1: 'Connectez facilement',
    title2: 'Travaillez intelligemment',
    description: 'Créez votre profil numérique professionnel en minutes.',
    ctaPrimary: 'Créer votre profil gratuitement',
    ctaSecondary: 'Voir un exemple',
    badges: ['Sans carte de crédit', 'Multilingue', 'Gratuit pour toujours'],
    featuresTitle: 'Tout ce dont vous avez besoin',
    featuresSubtitle: 'Des outils professionnels pour booster votre présence',
    features: [
      { icon: '🔗', title: 'Liens illimités', desc: 'Rassemblez tous vos liens sur une page partageable' },
      { icon: '📱', title: 'QR code intelligent', desc: 'Créez un QR personnalisé qui ouvre votre profil' },
      { icon: '🤖', title: 'Scanner IA', desc: "Extrayez les données de n'importe quelle carte" },
      { icon: '🎴', title: 'Carte de visite digitale', desc: 'Concevez et téléchargez en PDF prêt à imprimer' },
      { icon: '📊', title: 'Analyses', desc: 'Suivez qui a visité votre profil' },
      { icon: '🌍', title: 'Multilingue', desc: 'Interface complète en 5 langues' },
    ],
    pricingTitle: 'Tarifs',
    pricingSubtitle: 'Commencez gratuitement — sans carte bancaire',
    plans: [
      { name: 'Gratuit', price: '$0', period: 'pour toujours', desc: 'Parfait pour les particuliers', features: ['Profil complet', 'Liens illimités', 'QR personnalisé', 'Carte digitale', 'Scanner', '5 langues'], cta: 'Commencer gratuitement', highlighted: false },
      { name: 'Pro', price: 'Bientôt', period: '', desc: 'Pour les professionnels', features: ['Tout du gratuit', 'Scanner illimité', 'Export Excel', 'Analyses avancées', 'Support prioritaire', 'Sans pub'], cta: 'Me notifier', highlighted: true },
    ],
    print: { title: 'Concevez votre carte de visite gratuitement', subtitle: 'Concevez et téléchargez un fichier prêt à imprimer', noteLabel: 'Note', downloadPdfLabel: 'Télécharger PDF', downloadPngLabel: 'Télécharger PNG', printLabel: 'Imprimer', steps: [{ icon: '🎨', title: 'Concevoir', description: 'Choisissez couleurs et polices' }, { icon: '📄', title: 'Télécharger PDF', description: 'Haute résolution' }, { icon: '🖨️', title: 'Imprimer', description: "Chez tout imprimeur" }] },
    ctaTitle: 'Prêt à commencer ?',
    ctaDesc: 'Créez votre profil gratuitement',
    ctaBtn: 'Commencer gratuitement',
    footer: { copy: `© ${new Date().getFullYear()} contactme.cc — Tous droits réservés`, tagline: 'Fait avec ❤️ pour les professionnels', links: [{ label: 'Confidentialité', href: '/fr/privacy' }, { label: 'Conditions', href: '/fr/terms' }, { label: 'Contact', href: 'mailto:support@contactme.cc' }] },
  },
  es: {
    badge: 'Plataforma digital contactme',
    title1: 'Conéctate fácilmente',
    title2: 'Trabaja inteligente',
    description: 'Crea tu perfil digital profesional en minutos.',
    ctaPrimary: 'Crea tu perfil gratis',
    ctaSecondary: 'Ver ejemplo',
    badges: ['Sin tarjeta', 'Multiidioma', 'Gratis para siempre'],
    featuresTitle: 'Todo lo que necesitas',
    featuresSubtitle: 'Herramientas profesionales para tu presencia digital',
    features: [
      { icon: '🔗', title: 'Enlaces ilimitados', desc: 'Reúne todos tus enlaces en una página' },
      { icon: '📱', title: 'QR inteligente', desc: 'Crea un QR personalizado' },
      { icon: '🤖', title: 'Escáner IA', desc: 'Extrae datos de cualquier tarjeta' },
      { icon: '🎴', title: 'Tarjeta digital', desc: 'Diseña y descarga como PDF' },
      { icon: '📊', title: 'Analíticas', desc: 'Rastrea quién visitó tu perfil' },
      { icon: '🌍', title: 'Multiidioma', desc: 'Interfaz en 5 idiomas' },
    ],
    pricingTitle: 'Precios',
    pricingSubtitle: 'Empieza gratis — sin tarjeta',
    plans: [
      { name: 'Gratis', price: '$0', period: 'para siempre', desc: 'Para individuos', features: ['Perfil completo', 'Enlaces ilimitados', 'QR personalizado', 'Tarjeta digital', 'Escáner', '5 idiomas'], cta: 'Empieza gratis', highlighted: false },
      { name: 'Pro', price: 'Próximamente', period: '', desc: 'Para profesionales', features: ['Todo del gratis', 'Escáner ilimitado', 'Exportar Excel', 'Analíticas avanzadas', 'Soporte prioritario', 'Sin anuncios'], cta: 'Notificarme', highlighted: true },
    ],
    print: { title: 'Diseña tu tarjeta de visita gratis', subtitle: 'Diseña y descarga un archivo listo para imprimir', noteLabel: 'Nota', downloadPdfLabel: 'Descargar PDF', downloadPngLabel: 'Descargar PNG', printLabel: 'Imprimir', steps: [{ icon: '🎨', title: 'Diseñar', description: 'Elige colores y fuentes' }, { icon: '📄', title: 'Descargar PDF', description: 'Alta resolución' }, { icon: '🖨️', title: 'Imprimir', description: 'En cualquier imprenta' }] },
    ctaTitle: '¿Listo para empezar?',
    ctaDesc: 'Crea tu perfil ahora gratis',
    ctaBtn: 'Empieza gratis ahora',
    footer: { copy: `© ${new Date().getFullYear()} contactme.cc — Todos los derechos reservados`, tagline: 'Hecho con ❤️ para profesionales', links: [{ label: 'Privacidad', href: '/es/privacy' }, { label: 'Términos', href: '/es/terms' }, { label: 'Contacto', href: 'mailto:support@contactme.cc' }] },
  },
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const c = content[locale] || content['ar']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          ✨ {c.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          <span style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {c.title1}
          </span>{' '}
          <span>{c.title2}</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>{c.description}</p>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
          <Link href={`/${locale}/login`} className="btn-primary px-6 py-3 text-base">{c.ctaPrimary}</Link>
          <Link href={`/${locale}/alaqeelaziz`} className="btn-secondary px-6 py-3 text-base">{c.ctaSecondary}</Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm" style={{ color: 'var(--text-muted)' }}>
          {c.badges.map((b: string) => (
            <div key={b} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{c.featuresTitle}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{c.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.map((f: any, i: number) => (
              <div key={i} className="p-5 rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{c.pricingTitle}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{c.pricingSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {c.plans.map((plan: any, i: number) => (
              <div key={i} className={`relative p-7 rounded-3xl flex flex-col ${plan.highlighted ? 'text-white' : ''}`}
                style={plan.highlighted
                  ? { background: 'linear-gradient(135deg, #6366F1, #A855F7)' }
                  : { background: 'var(--surface)', border: '1px solid var(--border)' }}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">⭐ قريباً</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className={`text-xs mb-4 ${plan.highlighted ? 'text-white/70' : ''}`} style={!plan.highlighted ? { color: 'var(--text-muted)' } : {}}>{plan.desc}</p>
                <div className="text-3xl font-extrabold mb-6">{plan.price} <span className={`text-sm font-normal ${plan.highlighted ? 'text-white/70' : ''}`} style={!plan.highlighted ? { color: 'var(--text-muted)' } : {}}>{plan.period}</span></div>
                <ul className="space-y-2 mb-7 flex-1">
                  {plan.features.map((f: string, j: number) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/login`}
                  className={`text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 ${plan.highlighted ? 'bg-white text-indigo-600' : 'btn-primary'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Generator */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <QRGenerator />
      </section>

      {/* Business Card */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <PrintDesigner
          title={c.print.title}
          subtitle={c.print.subtitle}
          steps={c.print.steps}
          downloadPdfLabel={c.print.downloadPdfLabel}
          downloadPngLabel={c.print.downloadPngLabel}
          printLabel={c.print.printLabel}
          noteLabel={c.print.noteLabel}
        />
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}>
            <h2 className="text-2xl font-extrabold text-white mb-3">{c.ctaTitle}</h2>
            <p className="text-white/80 mb-7 text-sm">{c.ctaDesc}</p>
            <Link href={`/${locale}/login`}
              className="inline-block bg-white font-bold py-3 px-8 rounded-2xl text-sm transition-all hover:scale-105"
              style={{ color: '#6366F1' }}>
              {c.ctaBtn} ←
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center md:text-right">
              <p className="font-bold text-base mb-0.5">
                <span style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>contactme</span>.cc
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.footer.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {c.footer.links.map((l: any, i: number) => (
                <Link key={i} href={l.href} className="text-sm transition-colors hover:underline" style={{ color: 'var(--text-muted)' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-center text-xs pt-6" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {c.footer.copy}
          </div>
        </div>
      </footer>
    </div>
  )
}
