import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function formatWhatsApp(number: string): string {
  const clean = number.replace(/\D/g, '')
  return `https://wa.me/${clean}`
}

export function getAvatarUrl(url: string | null, supabaseUrl: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${supabaseUrl}/storage/v1/object/public/${url}`
}
