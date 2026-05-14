'use client'
import { Dancing_Script } from 'next/font/google'

const dancing = Dancing_Script({ subsets: ['latin'], weight: '700' })

export default function Logo({ size = 'md', showText = true }: {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}) {
  const cmSize = { sm: '36px', md: '48px', lg: '62px' }[size]
  const textSize = { sm: '14px', md: '17px', lg: '22px' }[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', direction: 'ltr' }}>
      <span className={dancing.className} style={{
        fontSize: cmSize, lineHeight: 1.1,
        background: 'linear-gradient(135deg, #6B7EFF, #A855F7)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', display: 'inline-block',
      }}>Cm</span>
      {showText && (
        <span style={{ fontWeight: 800, fontSize: textSize, letterSpacing: '-0.5px', lineHeight: 1, direction: 'ltr' }}>
          <span style={{ color: 'var(--text, #1a1a2e)' }}>contact</span>
          <span style={{ background: 'linear-gradient(135deg,#6B7EFF,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>me</span>
          <span style={{ color: '#9CA3AF', fontWeight: 400 }}>.cc</span>
        </span>
      )}
    </div>
  )
}