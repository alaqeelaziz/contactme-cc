import Link from 'next/link'

type Locale = 'ar' | 'en' | 'zh' | 'fr' | 'es'

const content: Record<Locale, {
  title: string
  titleHighlight: string
  subtitle: string
  currency: string
  period: string
  mostPopular: string
  plans: { name: string; price: string; period: string; features: string[]; notIncluded: string[]; cta: string; href: string; highlight: boolean; color: string }[]
}> = {
  ar: {
    title: 'اختر الخطة',
    titleHighlight: 'المناسبة لك',
    subtitle: 'ابدأ مجاناً وطوّر حسابك متى تشاء',
    currency: 'ريال',
    period: 'شهرياً',
    mostPopular: 'الأكثر طلباً',
    plans: [
      { name: 'مجاني', price: '0', period: 'دائماً', color: 'from-gray-400 to-gray-500', features: ['بروفايل شخصي أساسي', '3 روابط', 'رمز QR أساسي', 'زر واتساب', 'إعلانات في البروفايل'], notIncluded: ['تحليلات', 'ماسح البطاقات', 'QR مخصص'], cta: 'ابدأ مجاناً', href: '/login?tab=register', highlight: false },
      { name: 'برو فردي', price: '15', period: 'شهرياً', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['روابط غير محدودة', 'بدون إعلانات', 'رمز QR مخصص الألوان', 'ماسح بطاقات الأعمال بالذكاء الاصطناعي', 'إحصائيات المشاهدات', 'زر واتساب + حجز'], notIncluded: ['حسابات الموظفين', 'كتالوج خدمات'], cta: 'ابدأ التجربة', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { name: 'برو شركة', price: '49', period: 'شهرياً', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['كل مميزات برو فردي', 'حسابات لـ 10 موظفين', 'كتالوج الخدمات', 'زر الحجز', 'إحصائيات الفريق', 'شعار الشركة'], notIncluded: [], cta: 'للشركات', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  en: {
    title: 'Choose the',
    titleHighlight: 'Right Plan',
    subtitle: 'Start free and upgrade anytime',
    currency: 'SAR',
    period: 'monthly',
    mostPopular: 'Most Popular',
    plans: [
      { name: 'Free', price: '0', period: 'forever', color: 'from-gray-400 to-gray-500', features: ['Basic personal profile', '3 links', 'Basic QR code', 'WhatsApp button', 'Ads on profile'], notIncluded: ['Analytics', 'Card scanner', 'Custom QR'], cta: 'Start free', href: '/login?tab=register', highlight: false },
      { name: 'Pro Individual', price: '15', period: 'monthly', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Unlimited links', 'No ads', 'Custom color QR code', 'AI business card scanner', 'View analytics', 'WhatsApp + booking button'], notIncluded: ['Team accounts', 'Service catalog'], cta: 'Start trial', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { name: 'Pro Business', price: '49', period: 'monthly', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['All Pro Individual features', '10 employee accounts', 'Service catalog', 'Booking button', 'Team analytics', 'Company logo'], notIncluded: [], cta: 'For businesses', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  zh: {
    title: '选择适合您的',
    titleHighlight: '套餐',
    subtitle: '免费开始，随时升级',
    currency: 'SAR',
    period: '每月',
    mostPopular: '最受欢迎',
    plans: [
      { name: '免费', price: '0', period: '永久', color: 'from-gray-400 to-gray-500', features: ['基本个人资料', '3个链接', '基本二维码', 'WhatsApp按钮', '个人资料广告'], notIncluded: ['分析', '名片扫描', '自定义二维码'], cta: '免费开始', href: '/login?tab=register', highlight: false },
      { name: '专业个人版', price: '15', period: '每月', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['无限链接', '无广告', '自定义颜色二维码', 'AI名片扫描', '查看统计', 'WhatsApp+预约按钮'], notIncluded: ['团队账户', '服务目录'], cta: '开始试用', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { name: '专业企业版', price: '49', period: '每月', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['所有专业个人版功能', '10个员工账户', '服务目录', '预约按钮', '团队统计', '公司标志'], notIncluded: [], cta: '企业版', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  fr: {
    title: 'Choisissez le',
    titleHighlight: 'bon forfait',
    subtitle: 'Commencez gratuitement et évoluez à tout moment',
    currency: 'SAR',
    period: 'mensuel',
    mostPopular: 'Le plus populaire',
    plans: [
      { name: 'Gratuit', price: '0', period: 'toujours', color: 'from-gray-400 to-gray-500', features: ['Profil personnel de base', '3 liens', 'QR code basique', 'Bouton WhatsApp', 'Publicités sur le profil'], notIncluded: ['Analytiques', 'Scanner de cartes', 'QR personnalisé'], cta: 'Commencer gratuitement', href: '/login?tab=register', highlight: false },
      { name: 'Pro Individuel', price: '15', period: 'mensuel', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Liens illimités', 'Sans publicités', 'QR code couleur personnalisé', 'Scanner IA de cartes de visite', 'Analytiques des vues', 'WhatsApp + bouton réservation'], notIncluded: ['Comptes équipe', 'Catalogue de services'], cta: 'Commencer l\'essai', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { name: 'Pro Entreprise', price: '49', period: 'mensuel', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['Toutes les fonctionnalités Pro', '10 comptes employés', 'Catalogue de services', 'Bouton réservation', 'Analytiques équipe', 'Logo entreprise'], notIncluded: [], cta: 'Pour les entreprises', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
  es: {
    title: 'Elige el',
    titleHighlight: 'plan correcto',
    subtitle: 'Empieza gratis y mejora cuando quieras',
    currency: 'SAR',
    period: 'mensual',
    mostPopular: 'Más popular',
    plans: [
      { name: 'Gratis', price: '0', period: 'siempre', color: 'from-gray-400 to-gray-500', features: ['Perfil personal básico', '3 enlaces', 'Código QR básico', 'Botón WhatsApp', 'Anuncios en perfil'], notIncluded: ['Analíticas', 'Escáner de tarjetas', 'QR personalizado'], cta: 'Empezar gratis', href: '/login?tab=register', highlight: false },
      { name: 'Pro Individual', price: '15', period: 'mensual', color: 'from-[#4B9EFF] to-[#8B5CF6]', features: ['Enlaces ilimitados', 'Sin anuncios', 'QR de color personalizado', 'Escáner IA de tarjetas', 'Analíticas de vistas', 'WhatsApp + botón reserva'], notIncluded: ['Cuentas de equipo', 'Catálogo de servicios'], cta: 'Iniciar prueba', href: '/login?tab=register&plan=pro_individual', highlight: true },
      { name: 'Pro Empresa', price: '49', period: 'mensual', color: 'from-[#8B5CF6] to-[#EC4899]', features: ['Todas las funciones Pro', '10 cuentas de empleados', 'Catálogo de servicios', 'Botón reserva', 'Analíticas de equipo', 'Logo empresa'], notIncluded: [], cta: 'Para empresas', href: '/login?tab=register&plan=pro_company', highlight: false },
    ],
  },
}

interface Props {
  locale?: string
}

export default function PricingSection({ locale = 'ar' }: Props) {
  const c = content[(locale as Locale) in content ? locale as Locale : 'ar']

  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {c.title} <span className="gradient-text">{c.titleHighlight}</span>
          </h2>
          <p className="text-[var(--text-muted)] text-lg">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {c.plans.map((plan) => (
            <div key={plan.name}
              className={`relative rounded-2xl border overflow-hidden transition-transform hover:-translate-y-1 ${plan.highlight ? 'border-[#4B9EFF] shadow-xl shadow-blue-500/20' : 'border-[var(--border)]'}`}
              style={{ background: 'var(--surface)' }}>
              {plan.highlight && <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }} />}
              {plan.highlight && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
                    {c.mostPopular}
                  </span>
                </div>
              )}
              <div className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-br ${plan.color} text-white font-bold text-lg`}>
                  {plan.price === '0' ? '∞' : plan.price[0]}
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold gradient-text">{plan.price}</span>
                  <span className="text-[var(--text-muted)]">{c.currency} / {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-muted)] line-through">
                      <svg className="w-4 h-4 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.highlight ? 'btn-primary w-full text-center' : 'btn-secondary w-full text-center'}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}