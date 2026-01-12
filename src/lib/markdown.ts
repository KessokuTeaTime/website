import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

// processor

let processor: ReturnType<typeof createProcessor> | null = null

function createProcessor() {
  return unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify)
}

function getProcessor() {
  processor ??= createProcessor()
  return processor
}

// rendering

export function renderBlock(markdown: string): string {
  return getProcessor().processSync(`\n\n${markdown}\n\n`).toString().trim()
}

export function renderInline(markdown: string): string {
  const html = renderBlock(markdown)
  if (html.startsWith('<p>') && html.endsWith('</p>')) {
    return html.slice(3, -4)
  }
  return html
}
