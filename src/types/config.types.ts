import type { Localized } from '@/lib/i18n'

interface SiteInfo {
  title: string
  description: string
  website: string
  defaultLocale?: string
}

interface PageInfoTarget {
  type: 'slug' | 'link'
}

interface PageInfoTargetSlug extends PageInfoTarget {
  type: 'slug'
  slug: string
}

interface PageInfoTargetLink extends PageInfoTarget {
  type: 'link'
  link: string
}

export interface PageInfo {
  name: Localized<string>
  target: PageInfoTargetSlug | PageInfoTargetLink
}

export interface Config {
  siteInfo: SiteInfo
  pageInfo: PageInfo[]
}
