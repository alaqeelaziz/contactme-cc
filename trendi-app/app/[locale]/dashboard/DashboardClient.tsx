'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import ProfileEditor from '@/components/dashboard/ProfileEditor'
import LinksManager from '@/components/dashboard/LinksManager'
import BusinessCardScanner from '@/components/dashboard/BusinessCardScanner'
import QRDownloader from '@/components/dashboard/QRDownloader'
import AnalyticsCard from '@/components/dashboard/AnalyticsCard'
import ServicesManager from '@/components/dashboard/ServicesManager'
import type { Profile, Link as LinkType, Service } from '@/lib/types'

const ADMIN_ID = 'a6fb80bd-3407-4cc5-9ba0-6c80a9e46818'

interface Props {
  initialProfile: Profile
  initialLinks: LinkType[]
  initialServices: Service[]
  viewCount: number
  profileUrl: string
}

type Tab = 'profile' | 'links' | 'services' | 'qr' | 'scanner' | 'analytics' | 'admin'

export default function DashboardClient({
  initialProfile,
  initialLinks,
  initialServices,
  viewCount,
  profileUrl,
}: Props) {
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const t = useTranslations('dashboard')

  const isAdmin = profile.id === ADMIN_ID

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile',   label: t('tabs.profile'),   icon: '👤' },
    { id: 'links',     label: t('tabs.links'),      icon: '🔗' },
    ...(profile.account_type === 'company' ? [{ id: 'services' as Tab, label: t('tabs.services'), icon: '💼' }] : []),
    { id: 'qr',        label: t('tabs.qr'),         icon: '📱' },
    { id: 'scanner',   label: t('tabs.scanner'),    icon: '📷' },
    { id: 'analytics', label: t('tabs.analytics'),  icon: '📊' },
    ...(isAdmin ? [{ id: 'admin' as Tab, label: 'الإدارة', icon: '⚙️' }] : []),
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">{t('title')}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t('greeting', { name: profile.full_name })}</p>
          </div>
          <Link href={`/${profile.username}`} target="_blank" className="btn-secondary text-sm py-2 px-4 gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('viewProfile')}
          </Link>
        </div>
        <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto" style={{ background: 'var(--surface)', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? 'text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #6366F1, #A855F7)' } : {}}>
              <span>{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
        <div className="card">
          {activeTab === 'profile' && <div><h2 className="text-lg font-bold mb-5">{t('profile')}</h2><ProfileEditor profile={profile} onUpdate={setProfile} /></div>}
          {activeTab === 'links' && <div><h2 className="text-lg font-bold mb-5">{t('links')}</h2><LinksManager userId={profile.user_id} isPro={true} initialLinks={initialLinks} /></div>}
          {activeTab === 'services' && <div><h2 className="text-lg font-bold mb-5">{t('services')}</h2><ServicesManager userId={profile.user_id} initialServices={initialServices} /></div>}
          {activeTab === 'qr' && <div><h2 className="text-lg font-bold mb-5">{t('qrContent')}</h2><QRDownloader profileUrl={profileUrl} isPro={true} username={profile.username} /></div>}
          {activeTab === 'scanner' && <div><h2 className="text-lg font-bold mb-5">{t('scanner')}</h2><BusinessCardScanner isPro={true} /></div>}
          {activeTab === 'analytics' && <div><h2 className="text-lg font-bold mb-5">{t('analytics')}</h2><AnalyticsCard viewCount={viewCount} isPro={true} createdAt={profile.created_at} /></div>}
          
        </div>
        <div className="mt-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm text-[var(--text-muted)] flex-1 truncate" dir="ltr">{profileUrl}</p>
          <button onClick={() => navigator.clipboard.writeText(profileUrl)} className="text-xs font-medium text-[#6366F1] hover:underline flex-shrink-0">{t('profileUrl')}</button>
        </div>
      </div>
    </div>
  )
}