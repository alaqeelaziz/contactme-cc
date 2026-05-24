import Navbar from '@/components/Navbar'
import PricingSection from '@/components/PricingSection'
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
    description: 'أنشئ بروفايلك الرقمي الاحترافي في دقائق.',
    ctaPrimary: 'أنشئ بروفايلك مجاناً',
    ctaSecondary: 'شاهد المثال',
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
  },
  en: {
    badge: 'contactme digital platform',
    title1: 'Connect Easily',
    title2: 'Work Smart',
    description: 'Create your professional digital profile in minutes.',
    ctaPrimary: 'Create your profile free',
    ctaSecondary: 'See example',
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
  },
  zh: {
    badge: 'contactme 数字平台',
    title1: '轻松联系',
    title2: '智慧工作',
    description: '几分钟内创建您的专业数字档案。',
    ctaPrimary: '免费创建档案',
    ctaSecondary: '查看示例',
    print: {
      title: '免费设计名片',
      subtitle: '在平台内设计并下载可打印文件',
      noteLabel: '注意',
      downloadPdfLabel: '下载 PDF',
      downloadPngLabel: '下载 PNG',
      printLabel: '打印',
      steps: [
        { icon: '🎨', title: '设计', description: '从仪表板选择颜色和字体' },
        { icon: '📄', title: '下载 PDF', description: '高分辨率，可打印' },
        { icon: '🖨️', title: '打印', description: '在任何打印店或在家' },
      ],
    },
  },
  fr: {
    badge: 'Plateforme numérique contactme',
    title1: 'Connectez facilement',
    title2: 'Travaillez intelligemment',
    description: 'Créez votre profil numérique professionnel en minutes.',
    ctaPrimary: 'Créer votre profil gratuitement',
    ctaSecondary: 'Voir un exemple',
    print: {
      title: 'Concevez votre carte de visite gratuitement',
      subtitle: 'Concevez dans la plateforme et téléchargez un fichier prêt à imprimer',
      noteLabel: 'Note',
      downloadPdfLabel: 'Télécharger PDF',
      downloadPngLabel: 'Télécharger PNG',
      printLabel: 'Imprimer',
      steps: [
        { icon: '🎨', title: 'Concevoir', description: 'Choisissez couleurs et polices' },
        { icon: '📄', title: 'Télécharger PDF', description: 'Haute résolution, prêt à imprimer' },
        { icon: '🖨️', title: 'Imprimer', description: 'Chez tout imprimeur ou à la maison' },
      ],
    },
  },
  es: {
    badge: 'Plataforma digital contactme',
    title1: 'Conéctate fácilmente',
    title2: 'Trabaja inteligente',
    description: 'Crea tu perfil digital profesional en minutos.',
    ctaPrimary: 'Crea tu perfil gratis',
    ctaSecondary: 'Ver ejemplo',
    print: {
      title: 'Diseña tu tarjeta de visita gratis',
      subtitle: 'Diseña dentro de la plataforma y descarga un archivo listo para imprimir',
      noteLabel: 'Nota',
      downloadPdfLabel: 'Descargar PDF',
      downloadPngLabel: 'Descargar PNG',
      printLabel: 'Imprimir',
      steps: [
        { icon: '🎨', title: 'Diseñar', description: 'Elige colores y fuentes del panel' },
        { icon: '📄', title: 'Descargar PDF', description: 'Alta resolución, listo para imprimir' },
        { icon: '🖨️', title: 'Imprimir', description: 'En cualquier imprenta o en casa' },
      ],
    },
  },
}

export default async function HomePage({ params }: Props) {
  const { locale } = params
  const c = content[locale] || content['ar']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="inline-block text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          ✨ {c.badge}
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          <span style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {c.title1}
          </span>{' '}
          <span>{c.title2}</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          {c.description}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={`/${locale}/login`} className="btn-primary px-6 py-3 text-base">{c.ctaPrimary}</Link>
          <Link href={`/${locale}/alaqeelaziz`} className="btn-secondary px-6 py-3 text-base">{c.ctaSecondary}</Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <QRGenerator />
      </section>

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

      <section className="max-w-4xl mx-auto px-4 py-12">
        <PricingSection />
      </section>
    </div>
  )
}
