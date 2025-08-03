import type { Config } from './types'

export const config: Config = {
  siteInfo: {
    title: '結束ティータイム',
    description: '下北沢で本当人気なバンド。',
    website: 'https://kessokuteatime.work'
  },
  pageInfo: [
    {
      name: 'About',
      target: {
        type: 'slug',
        slug: '/'
      }
    },
    {
      name: 'People',
      target: {
        type: 'slug',
        slug: '/people'
      }
    },
    {
      name: 'Works',
      target: {
        type: 'slug',
        slug: '/works'
      }
    },
    {
      name: 'Blog',
      target: {
        type: 'link',
        link: 'https://blog.kessokuteatime.work'
      }
    },
    {
      name: 'Documentation',
      target: {
        type: 'link',
        link: 'https://docs.kessokuteatime.work'
      }
    }
  ]
}

export const makeTitle = (subtitle: string): string => {
  return `${subtitle} - ${config.siteInfo.title}`
}
