'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'
import BusinessCardPreview from '@/components/BusinessCardPreview'

interface Step {
  icon: string
  title: string
  description: string
}

interface PrintDesignerProps {
  title: string
  subtitle: string
  steps: Step[]
  downloadPdfLabel: string
  downloadPngLabel: string
  printLabel: string
  noteLabel: string
}

export default function PrintDesigner({
  title,
  subtitle,
  steps,
  downloadPdfLabel,
  downloadPngLabel,
  printLabel,
  noteLabel,
}: PrintDesignerProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)

  async function captureCanvas() {
    const element = printRef.current
    if (!element) {
      toast.error('حدث خطأ أثناء التحميل')
      throw new Error('Print preview not found')
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })

    return canvas
  }

  async function handleDownloadPNG() {
    try {
      setLoading(true)
      const canvas = await captureCanvas()
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = 'contactme-business-card.png'
      a.click()
      toast.success('تم تحميل الصورة')
    } catch (error) {
      toast.error('فشل تحميل الصورة')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    try {
      setLoading(true)
      const canvas = await captureCanvas()
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'pt', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight)
      pdf.save('contactme-business-card.pdf')
      toast.success('تم تحميل ملف PDF')
    } catch (error) {
      toast.error('فشل تحميل ملف PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #6B7EFF10, #A855F710)' }}>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#4B9EFF] mb-4">{noteLabel}</p>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-[var(--text-muted)] max-w-2xl">{subtitle}</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="rounded-3xl border p-5" style={{ borderColor: 'var(--border)' }}>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-[var(--surface)] p-6" style={{ borderColor: 'var(--border)' }}>
          <div ref={printRef} className="p-6 rounded-3xl bg-white shadow-xl">
            <BusinessCardPreview />
          </div>
        </div>

        <div className="rounded-3xl border bg-[var(--bg)] p-6" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-[var(--text-muted)] mb-4">{noteLabel}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="btn-primary w-full gap-2 disabled:opacity-50"
            >
              {downloadPdfLabel}
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={loading}
              className="btn-secondary w-full gap-2 disabled:opacity-50"
            >
              {downloadPngLabel}
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary w-full gap-2"
            >
              {printLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
