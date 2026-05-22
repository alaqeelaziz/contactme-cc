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
    badges: ['بدون بطاقة ائتمان', 'متعدد اللغات'],
    qrTitle: 'جرّب مولّد رمز QR الآن',
    cardTitle: 'صمّم بطاقة أعمالك مجاناً',
    cardSubtitle: 'بدون تسجيل — عبّي بياناتك وحمّل البطاقة فوراً',
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
    cardTitle: 'Design Your Business Card for Free',
    cardSubtitle: 'No sign-up needed — fill in your details and download instantly',
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
    cardTitle: '免费设计您的名片',
    cardSubtitle: '无需注册 — 填写信息后立即下载',
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
    cardTitle: 'Concevez votre carte de visite gratuitement',
    cardSubtitle: 'Sans inscription — remplissez vos infos et téléchargez instantanément',
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
    cardTitle: 'Diseña tu tarjeta de visita gratis',
    cardSubtitle: 'Sin registro — rellena tus datos y descarga al instante',
    footer: `© ${new Date().getFullYear()} contactme.cc — Todos los derechos reservados`,
  },
}

type LocaleKey = keyof typeof content

export default function HomePageClient({ messages, locale }: Props) {
  const c = content[(locale as LocaleKey) in content ? locale as LocaleKey : 'ar']

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
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

      {/* QR Generator */}
      <section id="demo" className="py-20 px-4" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">{c.qrTitle}</h2>
          <div className="max-w-sm mx-auto">
            <QRGenerator showDownload />
          </div>
        </div>
      </section>

      {/* Business Card Designer */}
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

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-[var(--text-muted)]"
        style={{ borderColor: 'var(--border)' }}>
        {c.footer}
      </footer>
    </div>
  )
}
