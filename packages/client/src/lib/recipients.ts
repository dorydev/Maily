import type { Recipient } from "./types"

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export const parseRecipientsFromText = (text: string): Recipient[] => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const sep = lines.some((l) => l.includes(";")) ? ";" : lines.some((l) => l.includes(",")) ? "," : null

  if (!sep) {
    return lines.filter(isEmail).map((email) => ({ email, data: {} }))
  }

  const rows = lines.map((l) => l.split(sep).map((x) => x.trim()))
  const first = rows[0] ?? []
  const looksLikeHeader = first.some((cell) => cell && !isEmail(cell))
  const headers = looksLikeHeader ? first : ["email", ...first.slice(1).map((_, i) => `col${i + 1}`)]
  const startIdx = looksLikeHeader ? 1 : 0

  const out: Recipient[] = []

  for (let i = startIdx; i < rows.length; i++) {
    const row = rows[i] ?? []
    const rec: Recipient = { email: "", data: {} }

    headers.forEach((h, idx) => {
      const key = (h || "").toLowerCase()
      const val = row[idx] ?? ""
      if (key === "email" || key === "mail") rec.email = val
      else if (key) rec.data[key] = val
    })

    if (rec.email && isEmail(rec.email)) out.push(rec)
  }

  return out
}
