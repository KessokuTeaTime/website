export type QueryRecord = Record<string, string | number | boolean>

export function toQueryRecord<T extends object>(obj: T): QueryRecord {
  const record: QueryRecord = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) {
      record[k] = v as string | number | boolean
    }
  }
  return record
}

export function withQuery(url: string, params?: QueryRecord): string {
  if (!params) return url
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => search.append(k, String(v)))
  return `${url}?${search.toString()}`
}
