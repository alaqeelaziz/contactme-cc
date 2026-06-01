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
      { title: '1. قبول الشروط', body: 'باستخدامك لمنصة contactme.cc فأنت توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى التوقف عن استخدام الخدمة.' },
      { title: '2. الاستخدام المقبول', body: 'يجب استخدام المنصة للأغراض المشروعة فقط. يُحظر نشر محتوى مسيء، مضلل، أو ينتهك حقوق الآخرين.' },
      { title: '3. حسابك', body: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك. يجب إخطارنا فوراً عند اشتباهك في أي استخدام غير مصرح به.' },
      { title: '4. المحتوى', body: 'أنت تمتلك المحتوى الذي تنشره. بنشره على المنصة، تمنحنا ترخيصاً لعرضه. نحتفظ بحق إزالة أي محتوى ينتهك هذه الشروط.' },
      { title: '5. الخدمة المجانية', body: 'نقدم الخدمة الأساسية مجاناً. نحتفظ بالحق في تغيير الميزات المتاحة في الخطة المجانية مع إشعار مسبق.' },
      { title: '6. إنهاء الخدمة', body: 'نحتفظ بحق تعليق أو إنهاء أي حساب يخالف هذه الشروط. يمكنك حذف حسابك في أي وقت.' },
      { title: '7. تحديث الشروط', body: 'قد نحدّث هذه الشروط من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني.' },
      { title: '8. التواصل', body: 'لأي استفسار بخصوص هذه الشروط، تواصل معنا على: support@contactme.cc' },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: June 2025',
    back: 'Back to Home',
    sections: [
      { title: '1. Acceptance of Terms', body: 'By using contactme.cc, you agree to these Terms of Service. If you do not agree, please stop using the service.' },
      { title: '2. Acceptable Use', body: 'You must use the platform for lawful purposes only. Posting offensive, misleading, or rights-infringing content is prohibited.' },
      { title: '3. Your Account', body: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any suspected unauthorized use.' },
      { title: '4. Content', body: 'You own the content you post. By publishing it on the platform, you grant us a license to display it. We reserve the right to remove content that violates these terms.' },
      { title: '5. Free Service', body: 'We provide the basic service for free. We reserve the right to change features available in the free plan with prior notice.' },
      { title: '6. Termination', body: 'We reserve the right to suspend or terminate any account that violates these terms. You may delete your account at any time.' },
      { title: '7. Updates to Terms', body: 'We may update these terms from time to time. We will notify you of any material changes via email.' },
      { title: '8. Contact', body: 'For any questions about these terms, contact us at: support@contactme.cc' },
    ],
  },
  zh: {
    title: '服务条款',
    updated: '最后更新：2025年6月',
    back: '返回首页',
    sections: [
      { title: '1. 接受条款', body: '使用contactme.cc即表示您同意本服务条款。如不同意，请停止使用本服务。' },
      { title: '2. 可接受的使用', body: '您必须仅将平台用于合法目的。禁止发布冒犯性、误导性或侵犯他人权利的内容。' },
      { title: '3. 您的账户', body: '您有责任保护账户凭据的机密性。如发现任何未经授权的使用，请立即通知我们。' },
      { title: '4. 内容', body: '您拥有发布的内容。通过在平台上发布，您授予我们展示权。我们保留删除违反条款内容的权利。' },
      { title: '5. 免费服务', body: '我们免费提供基本服务。我们保留在提前通知的情况下更改免费计划功能的权利。' },
      { title: '6. 终止', body: '我们保留暂停或终止违反条款账户的权利。您可以随时删除账户。' },
      { title: '7. 条款更新', body: '我们可能不时更新这些条款。我们将通过电子邮件通知您任何重大变更。' },
      { title: '8. 联系', body: '如有关于条款的问题，请联系：support@contactme.cc' },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    updated: 'Dernière mise à jour : juin 2025',
    back: "Retour à l'accueil",
    sections: [
      { title: '1. Acceptation des conditions', body: "En utilisant contactme.cc, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas, veuillez cesser d'utiliser le service." },
      { title: '2. Utilisation acceptable', body: 'Vous devez utiliser la plateforme uniquement à des fins légales. La publication de contenu offensant, trompeur ou portant atteinte aux droits est interdite.' },
      { title: '3. Votre compte', body: 'Vous êtes responsable de la confidentialité de vos identifiants. Informez-nous immédiatement de toute utilisation non autorisée suspectée.' },
      { title: '4. Contenu', body: 'Vous possédez le contenu que vous publiez. En le publiant, vous nous accordez une licence pour l\'afficher. Nous nous réservons le droit de supprimer tout contenu enfreignant ces conditions.' },
      { title: '5. Service gratuit', body: 'Nous fournissons le service de base gratuitement. Nous nous réservons le droit de modifier les fonctionnalités du plan gratuit avec préavis.' },
      { title: '6. Résiliation', body: 'Nous nous réservons le droit de suspendre ou résilier tout compte violant ces conditions. Vous pouvez supprimer votre compte à tout moment.' },
      { title: '7. Mises à jour', body: 'Nous pouvons mettre à jour ces conditions de temps à autre. Nous vous informerons de tout changement important par email.' },
      { title: '8. Contact', body: 'Pour toute question sur ces conditions : support@contactme.cc' },
    ],
  },
  es: {
    title: 'Términos de servicio',
    updated: 'Última actualización: junio 2025',
    back: 'Volver al inicio',
    sections: [
      { title: '1. Aceptación de términos', body: 'Al usar contactme.cc, aceptas estos Términos de servicio. Si no estás de acuerdo, deja de usar el servicio.' },
      { title: '2. Uso aceptable', body: 'Debes usar la plataforma solo para fines legales. Está prohibido publicar contenido ofensivo, engañoso o que infrinja derechos.' },
      { title: '3. Tu cuenta', body: 'Eres responsable de mantener la confidencialidad de tus credenciales. Notifícanos inmediatamente ante cualquier uso no autorizado.' },
      { title: '4. Contenido', body: 'Eres dueño del contenido que publicas. Al publicarlo, nos otorgas licencia para mostrarlo. Nos reservamos el derecho de eliminar contenido que viole estos términos.' },
      { title: '5. Servicio gratuito', body: 'Ofrecemos el servicio básico gratis. Nos reservamos el derecho de cambiar las funciones del plan gratuito con aviso previo.' },
      { title: '6. Terminación', body: 'Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos. Puedes eliminar tu cuenta en cualquier momento.' },
      { title: '7. Actualizaciones', body: 'Podemos actualizar estos términos ocasionalmente. Te notificaremos cualquier cambio importante por email.' },
      { title: '8. Contacto', body: 'Para preguntas sobre estos términos: support@contactme.cc' },
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
