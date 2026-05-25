'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import BusinessCardPreview from '@/components/BusinessCardPreview'
import BusinessCardDesigner from '@/components/BusinessCardDesigner'
import QRGenerator from '@/components/QRGenerator'

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
    badges: ['بدون بطاقة ائتمان', 'متعدد اللغات', 'مجاني للأبد'],
    statsTitle: 'موثوق به من قِبل المحترفين',
    stats: [
      { value: '5+', label: 'لغات مدعومة' },
      { value: '100%', label: 'مجاني للبدء' },
      { value: '3', label: 'أدوات احترافية' },
      { value: '∞', label: 'روابط وبيانات' },
    ],
    featuresTitle: 'كل ما تحتاجه في مكان واحد',
    featuresSubtitle: 'أدوات احترافية لتعزيز حضورك الرقمي',
    features: [
      { icon: '🔗', title: 'روابط غير محدودة', desc: 'اجمع كل روابطك المهمة في صفحة واحدة قابلة للمشاركة' },
      { icon: '📱', title: 'رمز QR ذكي', desc: 'أنشئ رمز QR مخصص الألوان يفتح بروفايلك فوراً' },
      { icon: '🤖', title: 'ماسح بطاقات بالذكاء الاصطناعي', desc: 'استخرج بيانات أي بطاقة أعمال بصورة واحدة' },
      { icon: '🎴', title: 'بطاقة أعمال رقمية', desc: 'صمّم بطاقتك وحمّلها كصورة أو PDF جاهز للطباعة' },
      { icon: '📊', title: 'إحصائيات المشاهدات', desc: 'تابع من زار بروفايلك ومتى' },
      { icon: '🌍', title: 'دعم متعدد اللغات', desc: 'واجهة كاملة بالعربية والإنجليزية والفرنسية والصينية والإسبانية' },
    ],
    qrTitle: 'جرّب مولّد رمز QR الآن',
    cardTitle: 'صمّم بطاقة أعمالك مجاناً',
    cardSubtitle: 'بدون تسجيل — عبّي بياناتك وحمّل البطاقة فوراً',
    ctaTitle: 'جاهز تبدأ؟',
    ctaDesc: 'أنشئ بروفايلك الآن مجاناً — لا تحتاج بطاقة ائتمان',
    ctaBtn: 'ابدأ مجاناً الآن',
    footer: `© ${new Date().getFullYear()} contactme.cc — جميع الحقوق محفوظة`,
  },
  en: {
    badge: 'contactme digital platform',
    title1: 'Connect effortlessly',
    title2: 'Work smarter',
    description: 'Build your professional digital profile in minutes. Links, contact details, and a custom QR code — all in one place.',
    ctaPrimary: 'Create your profile free',
    ctaSecondary: 'See the demo',
    badges: ['No credit card', 'Multilingual', 'Free forever'],
    statsTitle: 'Trusted by professionals',
    stats: [
      { value: '5+', label: 'Languages' },
      { value: '100%', label: 'Free to start' },
      { value: '3', label: 'Pro tools' },
      { value: '∞', label: 'Links & data' },
    ],
    featuresTitle: 'Everything you need in one place',
    featuresSubtitle: 'Professional tools to boost your digital presence',
    features: [
      { icon: '🔗', title: 'Unlimited links', desc: 'Gather all your important links in one shareable page' },
      { icon: '📱', title: 'Smart QR code', desc: 'Create a custom-colored QR that opens your profile instantly' },
      { icon: '🤖', title: 'AI card scanner', desc: 'Extract data from any business card with one photo' },
      { icon: '🎴', title: 'Digital business card', desc: 'Design your card and download as image or print-ready PDF' },
      { icon: '📊', title: 'View analytics', desc: 'Track who visited your profile and when' },
      { icon: '🌍', title: 'Multilingual', desc: 'Full interface in Arabic, English, French, Chinese & Spanish' },
    ],
    qrTitle: 'Try the QR Generator Now',
    cardTitle: 'Design Your Business Card for Free',
    cardSubtitle: 'No sign-up needed — fill in your details and download instantly',
    ctaTitle: 'Ready to start?',
    ctaDesc: 'Create your profile now for free — no credit card needed',
    ctaBtn: 'Start for free now',
    footer: `© ${new Date().getFullYear()} contactme.cc — All rights reserved`,
  },
  zh: {
    badge: 'contactme 数字平台',
    title1: '轻松连接',
    title2: '更聪明地工作',
    description: '几分钟内创建您的专业数字个人资料。链接、联系信息和自定义二维码——一应俱全。',
    ctaPrimary: '创建个人资料',
    ctaSecondary: '查看示例',
    badges: ['无需信用卡', '多语言支持', '永久免费'],
    statsTitle: '受专业人士信赖',
    stats: [
      { value: '5+', label: '支持语言' },
      { value: '100%', label: '免费开始' },
      { value: '3', label: '专业工具' },
      { value: '∞', label: '链接和数据' },
    ],
    featuresTitle: '所有功能，一应俱全',
    featuresSubtitle: '专业工具，提升您的数字形象',
    features: [
      { icon: '🔗', title: '无限链接', desc: '将所有重要链接汇集在一个可分享的页面上' },
      { icon: '📱', title: '智能二维码', desc: '创建自定义颜色的二维码，即时打开您的个人资料' },
      { icon: '🤖', title: 'AI名片扫描仪', desc: '一张照片即可提取名片数据' },
      { icon: '🎴', title: '数字名片', desc: '设计您的名片并下载为图片或可打印PDF' },
      { icon: '📊', title: '查看分析', desc: '跟踪谁访问了您的个人资料及时间' },
      { icon: '🌍', title: '多语言支持', desc: '完整支持阿拉伯语、英语、法语、中文和西班牙语' },
    ],
    qrTitle: '立即试用二维码生成器',
    cardTitle: '免费设计您的名片',
    cardSubtitle: '无需注册 — 填写信息后立即下载',
    ctaTitle: '准备好开始了吗？',
    ctaDesc: '立即免费创建您的个人资料 — 无需信用卡',
    ctaBtn: '立即免费开始',
    footer: `© ${new Date().getFullYear()} contactme.cc — 保留所有权利`,
  },
  fr: {
    badge: 'Plateforme numérique contactme',
    title1: 'Connectez facilement',
    title2: 'Travaillez plus intelligemment',
    description: 'Créez votre profil numérique professionnel en minutes. Liens, coordonnées et QR code personnalisé — tout en un.',
    ctaPrimary: 'Créer votre profil gratuitement',
    ctaSecondary: 'Voir la démo',
    badges: ['Sans carte de crédit', 'Multilingue', 'Gratuit pour toujours'],
    statsTitle: 'Approuvé par les professionnels',
    stats: [
      { value: '5+', label: 'Langues' },
      { value: '100%', label: 'Gratuit au départ' },
      { value: '3', label: 'Outils pro' },
      { value: '∞', label: 'Liens et données' },
    ],
    featuresTitle: 'Tout ce dont vous avez besoin',
    featuresSubtitle: 'Des outils professionnels pour booster votre présence digitale',
    features: [
      { icon: '🔗', title: 'Liens illimités', desc: 'Rassemblez tous vos liens importants sur une page partageable' },
      { icon: '📱', title: 'QR code intelligent', desc: 'Créez un QR personnalisé qui ouvre votre profil instantanément' },
      { icon: '🤖', title: 'Scanner IA de cartes', desc: "Extrayez les données de n'importe quelle carte en une photo" },
      { icon: '🎴', title: 'Carte de visite digitale', desc: 'Concevez et téléchargez en image ou PDF prêt à imprimer' },
      { icon: '📊', title: 'Analyses de vues', desc: 'Suivez qui a visité votre profil et quand' },
      { icon: '🌍', title: 'Multilingue', desc: 'Interface complète en arabe, anglais, français, chinois et espagnol' },
    ],
    qrTitle: 'Essayez le générateur QR maintenant',
    cardTitle: 'Concevez votre carte de visite gratuitement',
    cardSubtitle: 'Sans inscription — remplissez vos infos et téléchargez instantanément',
    ctaTitle: 'Prêt à commencer ?',
    ctaDesc: 'Créez votre profil gratuitement — sans carte bancaire',
    ctaBtn: 'Commencer gratuitement',
    footer: `© ${new Date().getFullYear()} contactme.cc — Tous droits réservés`,
  },
  es: {
    badge: 'Plataforma digital contactme',
    title1: 'Conéctate fácilmente',
    title2: 'Trabaja más inteligente',
    description: 'Crea tu perfil digital profesional en minutos. Enlaces, datos de contacto y código QR personalizado — todo en un lugar.',
    ctaPrimary: 'Crea tu perfil gratis',
    ctaSecondary: 'Ver el demo',
    badges: ['Sin tarjeta de crédito', 'Multiidioma', 'Gratis para siempre'],
    statsTitle: 'De confianza para profesionales',
    stats: [
      { value: '5+', label: 'Idiomas' },
      { value: '100%', label: 'Gratis al inicio' },
      { value: '3', label: 'Herramientas pro' },
      { value: '∞', label: 'Enlaces y datos' },
    ],
    featuresTitle: 'Todo lo que necesitas en un lugar',
    featuresSubtitle: 'Herramientas profesionales para impulsar tu presencia digital',
    features: [
      { icon: '🔗', title: 'Enlaces ilimitados', desc: 'Reúne todos tus enlaces importantes en una página compartible' },
      { icon: '📱', title: 'QR inteligente', desc: 'Crea un QR personalizado que abre tu perfil al instante' },
      { icon: '🤖', title: 'Escáner IA de tarjetas', desc: 'Extrae datos de cualquier tarjeta con una foto' },
      { icon: '🎴', title: 'Tarjeta de visita digital', desc: 'Diseña y descarga como imagen o PDF listo para imprimir' },
      { icon: '📊', title: 'Analíticas de vistas', desc: 'Rastrea quién visitó tu perfil y cuándo' },
      { icon: '🌍', title: 'Multiidioma', desc: 'Interfaz completa en árabe, inglés, francés, chino y español' },
    ],
    qrTitle: 'Prueba el generador de QR ahora',
    cardTitle: 'Diseña tu tarjeta de visita gratis',
    cardSubtitle: 'Sin registro — rellena tus datos y descarga al instante',
    ctaTitle: '¿Listo para empezar?',
    ctaDesc: 'Crea tu perfil ahora gratis — sin tarjeta de crédito',
    ctaBtn: 'Empieza gratis ahora',
    footer: `© ${new Date().getFullYear()} contactme.cc — Todos los derechos reservados`,
  },
}

type LocaleKey = keyof typeof content

export default function HomePageClient({ messages, locale }: Props) {
  const c = content[(locale as LocaleKey) in content ? locale as LocaleKey : 'ar']

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }} />
        </div>

        <div className="max-w-5xl mx-auto relative">
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
              <p className="text-lg text-[var(--text-muted)] mb-8 leading-relaxed">{c.description}</p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/login?tab=register" className="btn-primary text-base px-8 py-4 hover:scale-105 transition-transform">
                  {c.ctaPrimary}
                </Link>
                <Link href="#demo" className="btn-secondary text-base px-8 py-4">{c.ctaSecondary}</Link>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-[var(--text-muted)]">
                {c.badges.map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <section className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #6366F108, #A855F708)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-[var(--text-muted)] mb-8 font-medium">{c.statsTitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {c.stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold gradient-text">{s.value}</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{c.featuresTitle}</h2>
            <p className="text-[var(--text-muted)] text-lg">{c.featuresSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'linear-gradient(135deg, #6366F115, #A855F715)' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'linear-gradient(135deg, #6366F120, #A855F720)', border: '1px solid #6366F140', color: '#6366F1' }}>
            📱 مجاني بالكامل
          </span>
          <h2 className="text-3xl font-bold mb-10">{c.qrTitle}</h2>
          <div className="max-w-sm mx-auto">
            <QRGenerator showDownload />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
              style={{ background: 'linear-gradient(135deg, #6366F120, #A855F720)', border: '1px solid #6366F140', color: '#6366F1' }}>
              🎴 مجاني بالكامل
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">{c.cardTitle}</h2>
            <p className="text-[var(--text-muted)]">{c.cardSubtitle}</p>
          </div>
          <BusinessCardDesigner />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #6366F1, #A855F7)' }}>
            <h2 className="text-3xl font-extrabold text-white mb-3">{c.ctaTitle}</h2>
            <p className="text-white/80 mb-8">{c.ctaDesc}</p>
            <Link href="/login?tab=register"
              className="inline-block bg-white font-bold py-4 px-10 rounded-2xl text-base transition-all hover:scale-105 hover:shadow-xl"
              style={{ color: '#6366F1' }}>
              {c.ctaBtn} ←
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-4 text-center text-sm text-[var(--text-muted)]"
        style={{ borderColor: 'var(--border)' }}>
        {c.footer}
      </footer>
    </div>
  )
}