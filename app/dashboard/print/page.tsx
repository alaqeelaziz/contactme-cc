'use client'

import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import PrintDesigner from '@/components/PrintDesigner'

export default function DashboardPrintPage() {
  const t = useTranslations('print')

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
          <p className="text-[var(--text-muted)]">{t('subtitle')}</p>
        </header>

        <PrintDesigner
          title={t('title')}
          subtitle={t('subtitle')}
          steps={[
            { icon: '🎨', title: t('step1.title'), description: t('step1.description') },
            { icon: '⬇️', title: t('step2.title'), description: t('step2.description') },
            { icon: '🖨️', title: t('step3.title'), description: t('step3.description') },
          ]}
          downloadPdfLabel={t('downloadPdf')}
          downloadPngLabel={t('downloadPng')}
          printLabel={t('print')}
          noteLabel={t('note')}
        />
      </div>
    </div>
  )
}
