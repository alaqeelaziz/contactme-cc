'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BusinessCardPreview from '@/components/BusinessCardPreview'
import QRGenerator from '@/components/QRGenerator'
import PricingSection from '@/components/PricingSection'

interface Props {
  messages: any
  locale: string
}

const content = {
  ar: {
    badge: 'منصة contactme الرقمية',
    title1: 'تواصل بسهولة',
    title2: 'اعمل بذكاء',
    description: 'أنشئ بروفايلك الرقمي الاحترافي في دقائق. بياناتك، روابطك، ورمز QR مخصص — كل شيء في مكان واحد.',
    ctaPrimary: 'أنشئ بروفايلك مجاناً',
    ctaSecondary: 'شاهد المثال',
    badges: ['بدون بطاقة ائتمان', 'متعدد اللغات'],
    qrTitle: 'جرّب مولّد رمز QR الآن',
    qrDesc: 'ادخل أي رابط وشاهد رمز QR يُنشأ فورياً',
    printBadge: 'جديد',
    printTitle: 'اطبع بزنس كارتك المجاني',
    printSubtitle: 'صمّم داخل المنصة وحمّل ملف جاهز للطباعة',
    steps: [
      { icon: '🎨', title: 'صمّم', desc: 'اختر الألوان والخط من لوحة التحكم' },
      { icon: '⬇️', title: 'حمّل PDF', desc: 'جاهز للطباعة بدقة عالية' },
      { icon: '🖨️', title: 'اطبع', desc: 'في أي مطبعة أو من البيت' },
    ],
    printCta: 'ابدأ تصميم كارتك ←',
    footer: `© ${new Date().getFullYear()} contactme.cc — جميع الحقوق محفوظة`,
  },
  en: {
    badge: 'contactme digital platform',
    title1: 'Connect effortlessly',
    title2: 'Work smarter',
    description: 'Build your professional digital profile in minutes. Links, contact details, and a custom QR code — all in one place.',
    ctaPrimary: 'Create your profile free',
    ctaSecondary: 'See the demo',
    badges: ['No credit card', 'Multilingual'],
    qrTitle: 'Try the QR Generator Now',
    qrDesc: 'Enter any link and see your QR code generated instantly',
    printBadge: 'New',
    printTitle: 'Print Your Business Card Free',
    printSubtitle: 'Design inside the platform and download a print-ready file',
    steps: [
      { icon: '🎨', title: 'Design', desc: 'Choose colors and fonts from the dashboard' },
      { icon: '⬇️', title: 'Download PDF', desc: 'High quality, print-ready' },
      { icon: '🖨️', title: 'Print', desc: 'At any print shop or at home' },
    ],
    printCta: 'Start designing your card →',
    footer: `© ${new Date().getFullYear()} contactme.cc — All rights reserved`,
  },
  zh: {
    badge: 'contactme 数字平台',
    title1: '轻松连接',
    title2: '更聪明地工作',
    description: '几分钟内创建您的专业数字个人资料。链接、联系信息和自定义二维码——一应俱全。',
    ctaPrimary: '创建个人资料',
    ctaSecondary: '查看示例',
    badges: ['无需信用卡', '多语言支持'],
    qrTitle: '立即试用二维码生成器',
    qrDesc: '输入任意链接，即时生成二维码',
    printBadge: '新功能',
    printTitle: '免费打印您的名片',
    printSubtitle: '在平台内设计并下载可打印文件',
    steps: [
      { icon: '🎨', title: '设计', desc: '从控制面板选择颜色和字体' },
      { icon: '⬇️', title: '下载PDF', desc: '高质量，可直接打印' },
      { icon: '🖨️', title: '打印', desc: '在任何打印店或在家打印' },
    ],
    printCta: '开始设计您的名片 →',
    footer: `© ${new Date().getFullYear()} contactme.cc — 保留所有权利`,
  },
  fr: {
    badge: 'Plateforme numérique contactme',
    title1: 'Connectez facilement',
    title2: 'Travaillez plus intelligemment',
    description: 'Créez votre profil numérique professionnel en minutes. Liens, coordonnées et QR code personnalisé — tout en un.',
    ctaPrimary: 'Créer votre profil gratuitement',
    ctaSecondary: 'Voir la démo',
    badges: ['Sans carte de crédit', 'Multilingue'],
    qrTitle: 'Essayez le générateur QR maintenant',
    qrDesc: 'Entrez un lien et générez votre code QR instantanément',
    printBadge: 'Nouveau',
    printTitle: 'Imprimez votre carte de visite gratuitement',
    printSubtitle: 'Concevez sur la plateforme et téléchargez un fichier prêt à imprimer',
    steps: [
      { icon: '🎨', title: 'Concevoir', desc: 'Choisissez couleurs et polices' },
      { icon: '⬇️', title: 'Télécharger PDF', desc: 'Haute qualité, prêt à imprimer' },
      { icon: '🖨️', title: 'Imprimer', desc: 'Dans toute imprimerie ou à la maison' },
    ],
    printCta: 'Commencer à concevoir →',
    footer: `© ${new Date().getFullYear()} contactme.cc — Tous droits réservés`,
  },
  es: {
    badge: 'Plataforma digital contactme',
    title1: 'Conéctate fácilmente',
    title2: 'Trabaja más inteligente',
    description: 'Crea tu perfil digital profesional en minutos. Enlaces, datos de contacto y código QR personalizado — todo en un lugar.',
    ctaPrimary: 'Crea tu perfil gratis',
    ctaSecondary: 'Ver el demo',
    badges: ['Sin tarjeta de crédito', 'Multiidioma'],
    qrTitle: 'Prueba el generador de QR ahora',
    qrDesc: 'Ingresa cualquier enlace y genera tu código QR al instante',
    printBadge: 'Nuevo',
    printTitle: 'Imprime tu tarjeta de visita gratis',
    printSubtitle: 'Diseña en la plataforma y descarga un archivo listo para imprimir',
    steps: [
      { icon: '🎨', title: 'Diseñar', desc: 'Elige colores y fuentes' },
      { icon: '⬇️', title: 'Descargar PDF', desc: 'Alta calidad, listo para imprimir' },
      { icon: '🖨️', title: 'Imprimir', desc: 'En cualquier imprenta o en casa' },
    ],
    printCta: 'Empieza a diseñar tu tarjeta →',
    footer: `© ${new Date().getFullYear()} contactme.cc — Todos los derechos reservados`,
  },
}

type LocaleKey = keyof typeof content

export default function HomePageClient({ messages, locale }: Props) {
  const c = content[(locale as LocaleKey) in content ? locale as LocaleKey : 'ar']

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {c.badge}
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                <span className="gradient-text">{c.title1}</span>
                <br />
                {c.title2}
              </h1>

              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">
                {c.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/login?tab=register" className="btn-primary text-base px-8 py-4">
                  {c.ctaPrimary}
                </Link>
                <Link href="#demo" className="btn-secondary text-base px-8 py-4">
                  {c.ctaSecondary}
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 mt-8 text-sm text-[var(--text-muted)]">
                {c.badges.map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <BusinessCardPreview />
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{c.qrTitle}</h2>
          <p className="text-[var(--text-muted)] mb-10">{c.qrDesc}</p>
          <div className="max-w-sm mx-auto">
            <QRGenerator showDownload />
          </div>
        </div>
      </section>

      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #6B7EFF10, #A855F710)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'white', border: '1px solid var(--border)' }}>
            🖨️ {c.printBadge}
          </span>
          <h2 className="text-4xl font-bold mb-4">{c.printTitle}</h2>
          <p className="text-[var(--text-muted)] mb-10">{c.printSubtitle}</p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {c.steps.map(s => (
              <div key={s.title} className="rounded-2xl p-6 bg-white/80" style={{ border: '1px solid var(--border)' }}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/login?tab=register" className="btn-primary px-10 py-4 inline-block">
            {c.printCta}
          </Link>
        </div>
      </section>

      <div style={{ background: 'var(--surface)' }}>
        <PricingSection locale={locale} />
      </div>

      <footer className="border-t py-8 px-4 text-center text-sm text-[var(--text-muted)]"
        style={{ borderColor: 'var(--border)' }}>
        {c.footer}
      </footer>
    </div>
  )
}