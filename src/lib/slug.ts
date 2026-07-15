export function formSlug(slugs: string[], leadingSlash = true, trailingSlash = true): string {
  const joinedSlug = slugs.join('/')
  return sanitizeSlug(joinedSlug, leadingSlash, trailingSlash)
}

export function parseSlug(slug: string): string[] {
  const trimmedSlug = slug.replace(/^\/|\/$/g, '')
  return trimmedSlug === '' ? [] : trimmedSlug.split('/')
}

export function sanitizeSlug(slug: string, leadingSlash = true, trailingSlash = true): string {
  const trimmedSlug = slug.replace(/^\/|\/$/g, '')
  const finalSlug = leadingSlash ? `/${trimmedSlug}` : trimmedSlug
  return trailingSlash ? `${finalSlug}/` : finalSlug
}
