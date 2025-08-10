import type { Config } from './types'

export const config: Config = {
  siteInfo: {
    title: '結束ティータイム',
    description: '下北沢で本当人気なバンド。',
    website: 'https://kessokuteatime.work'
  },
  pageInfo: [
    {
      name: {
        fallback: 'About',
        localizations: {
          en: 'About',
          zh: '关于'
        }
      },
      target: {
        type: 'slug',
        slug: '/'
      }
    },
    {
      name: {
        fallback: 'People',
        localizations: {
          en: 'People',
          zh: '成员'
        }
      },
      target: {
        type: 'slug',
        slug: '/people'
      }
    },
    {
      name: {
        fallback: 'Works',
        localizations: {
          en: 'Works',
          zh: '作品'
        }
      },
      target: {
        type: 'slug',
        slug: '/works'
      }
    },
    {
      name: {
        fallback: 'Blog',
        localizations: {
          en: 'Blog',
          zh: '博客'
        }
      },
      target: {
        type: 'link',
        link: 'https://blog.kessokuteatime.work'
      }
    },
    {
      name: {
        fallback: 'Documentation',
        localizations: {
          en: 'Documentation',
          zh: '文档'
        }
      },
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
