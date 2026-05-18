$content = @'
import Navbar from '@/components/Navbar'
import PricingSection from '@/components/PricingSection'
import QRGenerator from '@/components/QRGenerator'
import Link from 'next/link'

interface Props {
  params: { locale: string }
}

const heroContent: Record<string, any> = {
  ar: { badge: 'منصة contactme الرقمية', title1: 'تواصل بسهولة', title2: 'اعمل بذكاء', description: 'أنشئ بروفايلك الرقمي الاحترافي في دقائق.', ctaPrimary: 'أنشئ بروفايلك مجاناً', ctaSecondary: 'شاهد المثال' },
  en: { badge: 'contactme digital platform', title1: 'Connect Easily', title2: 'Work Smart', description: 'Create your professional digital profile in minutes.', ctaPrimary: 'Create your profile free', ctaSecondary: 'See example' },
  zh: { badge: 'contactme 数字平台', title1: '轻松联系', title2: '智慧工作', description: '几分钟内创建您的专业数字档案。', ctaPrimary: '免费创建档案', ctaSecondary: '查看示例' },
  fr: { badge: 'Plateforme numérique contactme', title1: 'Connectez facilement', title2: 'Travaillez intelligemment', description: 'Créez votre profil numérique professionnel en minutes.', ctaPrimary: 'Créer votre profil gratuitement', ctaSecondary: 'Voir un exemple' },
  es: { badge: 'Plataforma digital contactme', title1: 'Conéctate fácilmente', title2: 'Trabaja inteligente', description: 'Crea tu perfil digital profesional en minutos.', ctaPrimary: 'Crea tu perfil gratis', ctaSecondary: 'Ver ejemplo' },
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const hero = heroContent[locale] || heroContent['ar']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          ✨ {hero.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          <span style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {hero.title1}
          </span>{' '}
          <span>{hero.title2}</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          {hero.description}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={`/${locale}/login`} className="btn-primary px-6 py-3 text-base">{hero.ctaPrimary}</Link>
          <Link href={`/${locale}/alaqeelaziz`} className="btn-secondary px-6 py-3 text-base">{hero.ctaSecondary}</Link>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12"><QRGenerator /></section>
      <section className="max-w-4xl mx-auto px-4 py-12"><PricingSection /></section>
    </div>
  )
}
'@
Set-Content -Path "app\[locale]\page.tsx" -Value $content -Encoding UTF8

git add .
git commit -m "fix: remove PrintDesigner from home page (missing required props)"
git push