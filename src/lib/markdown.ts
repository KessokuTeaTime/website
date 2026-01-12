import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { cjkFriendlyExtension } from 'micromark-extension-cjk-friendly'
import { gfmStrikethroughCjkFriendly } from 'micromark-extension-cjk-friendly-gfm-strikethrough'

export const micromarkExtensions = [cjkFriendlyExtension(), gfmStrikethroughCjkFriendly()]

// processor

let processor: ReturnType<typeof createProcessor /* myth */> | null = null

function createProcessor() {
  return unified()
    .use(remarkParse, { extensions: micromarkExtensions })
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
}

function getProcessor() {
  processor ??= createProcessor()
  return processor
}

// rendering

export function renderBlock(markdown: string): string {
  return getProcessor().processSync(markdown).toString()
}

export function renderInline(markdown: string): string {
  const html = renderBlock(markdown).trim()
  if (html.startsWith('<p>') && html.endsWith('</p>\n')) {
    return html.slice(3, -5)
  }
  return html
}
