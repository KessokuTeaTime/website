export function getCopyrightSpan(startYear: number): string {
  const currentYear = new Date().getFullYear()
  return startYear >= currentYear ? `${currentYear}` : `${startYear}-${currentYear}`
}
