import type { Localized } from '@/utils/i18n'

export interface SiteInfo {
  title: string
  description: string
  website: string
}

export interface PageInfoTarget {
  type: 'slug' | 'link'
}

export interface PageInfoTargetSlug extends PageInfoTarget {
  type: 'slug'
  slug: string
}

export interface PageInfoTargetLink extends PageInfoTarget {
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
