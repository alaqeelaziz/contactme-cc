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
      { title: '1. المعلومات التي نجمعها', body: 'نجمع المعلومات التي تقدمها مباشرة عند إنشاء حساب، مثل: الاسم، البريد الإلكتروني، رقم الواتساب، والروابط التي تضيفها لبروفايلك.' },
      { title: '2. كيف نستخدم معلوماتك', body: 'نستخدم معلوماتك لتشغيل الخدمة، تحسين تجربتك، وإرسال إشعارات متعلقة بحسابك. لا نبيع بياناتك لأي طرف ثالث.' },
      { title: '3. مشاركة المعلومات', body: 'البروفايل الذي تنشئه هو بروفايل عام يمكن لأي شخص مشاهدته عبر الرابط. بإمكانك التحكم في ما تعرضه من معلومات في إعدادات حسابك.' },
      { title: '4. حماية البيانات', body: 'نستخدم تشفير SSL لحماية بياناتك. يتم تخزين البيانات على خوادم آمنة عبر Supabase.' },
      { title: '5. ملفات تعريف الارتباط (Cookies)', body: 'نستخدم cookies لحفظ جلسة تسجيل الدخول وتفضيلات اللغة فقط.' },
      { title: '6. حقوقك', body: 'يحق لك طلب حذف حسابك وبياناتك في أي وقت عبر التواصل معنا على controlcode26@gmail.com.' },
      { title: '7. التواصل معنا', body: 'لأي استفسار بخصوص سياسة الخصوصية، تواصل معنا على: controlcode26@gmail.com' },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2025',
    back: 'Back to Home',
    sections: [
      { title: '1. Information We Collect', body: 'We collect information you provide when creating an account, such as name, email, WhatsApp number, and links you add to your profile.' },
      { title: '2. How We Use Your Information', body: 'We use your information to operate the service, improve your experience, and send account-related notifications. We never sell your data to third parties.' },
      { title: '3. Information Sharing', body: 'Your profile is public and can be viewed by anyone with your link. You control what information is displayed in your account settings.' },
      { title: '4. Data Protection', body: 'We use SSL encryption to protect your data. Data is stored on secure servers via Supabase.' },
      { title: '5. Cookies', body: 'We use cookies only to maintain your login session and language preferences.' },
      { title: '6. Your Rights', body: 'You may request deletion of your account and data at any time by contacting us at controlcode26@gmail.com.' },
      { title: '7. Contact Us', body: 'For any privacy-related questions, contact us at: controlcode26@gmail.com' },
    ],
  },
  zh: {
    title: '隐私政策',
    updated: '最后更新：2025年6月',
    back: '返回首页',
    sections: [
      { title: '1. 我们收集的信息', body: '我们收集您创建账户时提供的信息，如姓名、电子邮件、WhatsApp号码以及您添加到个人资料的链接。' },
      { title: '2. 我们如何使用您的信息', body: '我们使用您的信息来运营服务、改善您的体验并发送账户相关通知。我们绝不向第三方出售您的数据。' },
      { title: '3. 信息共享', body: '您创建的个人资料是公开的，任何人都可以通过链接查看。您可以在账户设置中控制显示的信息。' },
      { title: '4. 数据保护', body: '我们使用SSL加密保护您的数据。数据通过Supabase存储在安全服务器上。' },
      { title: '5. Cookie', body: '我们仅使用cookie来维持您的登录会话和语言偏好。' },
      { title: '6. 您的权利', body: '您可以随时通过联系controlcode26@gmail.com请求删除您的账户和数据。' },
      { title: '7. 联系我们', body: '如有隐私相关问题，请联系：controlcode26@gmail.com' },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juin 2025',
    back: "Retour à l'accueil",
    sections: [
      { title: '1. Informations collectées', body: 'Nous collectons les informations que vous fournissez lors de la création d\'un compte : nom, email, numéro WhatsApp et liens ajoutés à votre profil.' },
      { title: '2. Utilisation de vos informations', body: 'Nous utilisons vos informations pour faire fonctionner le service, améliorer votre expérience et envoyer des notifications. Nous ne vendons jamais vos données.' },
      { title: '3. Partage d\'informations', body: 'Votre profil est public et visible par quiconque possède votre lien. Vous contrôlez les informations affichées dans vos paramètres.' },
      { title: '4. Protection des données', body: 'Nous utilisons le chiffrement SSL. Les données sont stockées sur des serveurs sécurisés via Supabase.' },
      { title: '5. Cookies', body: 'Nous utilisons les cookies uniquement pour maintenir votre session et vos préférences de langue.' },
      { title: '6. Vos droits', body: 'Vous pouvez demander la suppression de votre compte à tout moment en contactant controlcode26@gmail.com.' },
      { title: '7. Nous contacter', body: 'Pour toute question sur la confidentialité : controlcode26@gmail.com' },
    ],
  },
  es: {
    title: 'Política de privacidad',
    updated: 'Última actualización: junio 2025',
    back: 'Volver al inicio',
    sections: [
      { title: '1. Información que recopilamos', body: 'Recopilamos la información que proporcionas al crear una cuenta: nombre, email, número de WhatsApp y enlaces añadidos a tu perfil.' },
      { title: '2. Cómo usamos tu información', body: 'Usamos tu información para operar el servicio, mejorar tu experiencia y enviar notificaciones. Nunca vendemos tus datos a terceros.' },
      { title: '3. Compartir información', body: 'Tu perfil es público y cualquiera con tu enlace puede verlo. Puedes controlar qué información se muestra en la configuración de tu cuenta.' },
      { title: '4. Protección de datos', body: 'Usamos cifrado SSL para proteger tus datos. Los datos se almacenan en servidores seguros mediante Supabase.' },
      { title: '5. Cookies', body: 'Solo usamos cookies para mantener tu sesión de inicio de sesión y preferencias de idioma.' },
      { title: '6. Tus derechos', body: 'Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento contactando a controlcode26@gmail.com.' },
      { title: '7. Contáctanos', body: 'Para preguntas relacionadas con la privacidad: controlcode26@gmail.com' },
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
