import type { Recipient } from "./types"

export const renderTemplate = (tpl: string, rec: Recipient) => {
  return tpl.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, (m) => {
    const key = m.slice(1).toLowerCase()
    if (key === "email") return rec.email
    return rec.data[key] ?? m
  })
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
