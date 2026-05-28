'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import ProfileEditor from '@/components/dashboard/ProfileEditor'
import LinksManager from '@/components/dashboard/LinksManager'
import BusinessCardScanner from '@/components/dashboard/BusinessCardScanner'
import BusinessCardTab from '@/components/dashboard/BusinessCardTab'
import QRDownloader from '@/components/dashboard/QRDownloader'
import AnalyticsCard from '@/components/dashboard/AnalyticsCard'
import ServicesManager from '@/components/dashboard/ServicesManager'
import type { Profile, Link as LinkType, Service } from '@/lib/types'

interface Props {
  initialProfile: Profile
  initialLinks: LinkType[]
  initialServices: Service[]
  viewCount: number
  profileUrl: string
}

type Tab = 'profile' | 'links' | 'services' | 'card' | 'qr' | 'scanner' | 'analytics'

const ALL_TABS: { id: Tab; labelKey: string; icon: string; proOnly?: boolean; companyOnly?: boolean }[] = [
  { id: 'profile',   labelKey: 'tabs.profile',   icon: '👤' },
  { id: 'links',     labelKey: 'tabs.links',      icon: '🔗' },
  { id: 'services',  labelKey: 'tabs.services',   icon: '💼', companyOnly: true },
  { id: 'card',      labelKey: 'tabs.card',       icon: '🎴' },
  { id: 'qr',        labelKey: 'tabs.qr',         icon: '📱' },
  { id: 'scanner',   labelKey: 'tabs.scanner',    icon: '📷', proOnly: true },
  { id: 'analytics', labelKey: 'tabs.analytics',  icon: '📊', proOnly: true },
]

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
  const TABS = ALL_TABS.filter((tab) => !tab.companyOnly || profile.account_type === 'company')

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">{t('title')}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {t('greeting', { name: profile.full_name })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${profile.username}`}
              target="_blank"
              className="btn-secondary text-sm py-2 px-4 gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {t('viewProfile')}
            </Link>
            {!profile.is_pro && (
              <button className="btn-primary text-sm py-2 px-4 gap-1">
                <span>⭐</span>
                {t('upgradePro')}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' }}>
            {profile.is_pro ? '⭐' : '🔖'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {profile.plan === 'free' && t('plan.free')}
              {profile.plan === 'pro_individual' && t('plan.proIndividual')}
              {profile.plan === 'pro_company' && t('plan.proCompany')}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {profile.plan === 'free'
                ? t('planDescription.free')
                : t('planDescription.pro')}
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded-full"
            style={{
              background: profile.is_pro ? '#4B9EFF20' : 'var(--bg)',
              color: profile.is_pro ? '#4B9EFF' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: profile.is_pro ? '#4B9EFF40' : 'var(--border)',
            }}>
            {profile.account_type === 'personal' ? t('accountType.personal') : t('accountType.company')}
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
          style={{ background: 'var(--surface)', scrollbarWidth: 'none' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #4B9EFF, #8B5CF6)' } : {}}
            >
              <span>{tab.icon}</span>
              {t(tab.labelKey)}
              {tab.proOnly && !profile.is_pro && (
                <span className="text-[10px] px-1 py-0.5 rounded-full bg-[#8B5CF620] text-[#8B5CF6]">Pro</span>
              )}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('profile')}</h2>
              <ProfileEditor profile={profile} onUpdate={setProfile} />
            </div>
          )}
          {activeTab === 'links' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('links')}</h2>
              <LinksManager userId={profile.user_id} isPro={profile.is_pro} initialLinks={initialLinks} />
            </div>
          )}
          {activeTab === 'services' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('services')}</h2>
              <ServicesManager userId={profile.user_id} initialServices={initialServices} />
            </div>
          )}
          {activeTab === 'card' && (
            <div>
              <h2 className="text-lg font-bold mb-5">🎴 {t('tabs.card') ?? 'بطاقة الأعمال'}</h2>
              <BusinessCardTab profile={profile} profileUrl={profileUrl} />
            </div>
          )}
          {activeTab === 'qr' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('qrContent')}</h2>
              <QRDownloader profileUrl={profileUrl} isPro={profile.is_pro} username={profile.username} />
            </div>
          )}
          {activeTab === 'scanner' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('scanner')}</h2>
              <BusinessCardScanner isPro={profile.is_pro} />
            </div>
          )}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-lg font-bold mb-5">{t('analytics')}</h2>
              <AnalyticsCard viewCount={viewCount} isPro={profile.is_pro} createdAt={profile.created_at} />
            </div>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <p className="text-sm text-[var(--text-muted)] flex-1 truncate" dir="ltr">{profileUrl}</p>
          <button
            onClick={() => { navigator.clipboard.writeText(profileUrl) }}
            className="text-xs font-medium text-[#4B9EFF] hover:underline flex-shrink-0"
          >
            {t('profileUrl')}
          </button>
        </div>
      </div>
    </div>
  )
}
