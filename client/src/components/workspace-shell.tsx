import { Archive, House, Settings } from "lucide-react"
import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { useCallback, useMemo, useRef, useState, type ChangeEvent } from "react"

//import { SidebarProvider } from "../components/ui/sidebar"
//import { AppSidebar } from "../components/app-sidebar"
import { ComposeEmailCard } from "../components/compose-email"
import { CampaignSettingsCard } from "../components/campaign-settings"

import type { Recipient } from "../lib/types"
import { parseRecipientsFromText } from "../lib/recipients"
import { renderTemplate, sleep } from "../lib/mail"

type NavItem = {
  to: string
  label: string
  Icon: typeof House
}

const primaryNav: NavItem[] = [
  { to: "/home", label: "Homepage", Icon: House },
  { to: "/archives", label: "Archives", Icon: Archive },
]

const secondaryNav: NavItem[] = [
  { to: "/smtp-config", label: "Settings", Icon: Settings },
]

type WorkspaceShellProps = {
  children?: ReactNode
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const { pathname } = useLocation()

  const isActive = (to: string) => pathname === to

    // Recipients (one mail per recipient, no CC)
    const [recipientsText, setRecipientsText] = useState("")
    const [recipients, setRecipients] = useState<Recipient[]>([])
  
    const [rateLimit, setRateLimit] = useState<number>(1.0)
    const [apiBaseUrl, setApiBaseUrl] = useState("")
    const [apiSendRoute, setApiSendRoute] = useState("")
    const [variables, setVariables] = useState<{ key: string; label: string }[]>([{ key: "$prenom", label: "Prenom" }])
    const [signatures, setSignatures] = useState<File[]>([])
  
    // Sending progress
    const [isSending, setIsSending] = useState(false)
    const [sentCount, setSentCount] = useState(0)
    const [sendError, setSendError] = useState<string | null>(null)
  
    const [showPreview, setShowPreview] = useState(false)
  
    const normalizedApiBase = useMemo(() => apiBaseUrl.trim().replace(/\/+$/, ""), [apiBaseUrl])
    const normalizedSendRoute = useMemo(
      () => (apiSendRoute.trim().startsWith("/") ? apiSendRoute.trim() : `/${apiSendRoute.trim()}`),
      [apiSendRoute]
    )
    const sendUrl = useMemo(
      () => (normalizedApiBase && apiSendRoute.trim() ? `${normalizedApiBase}${normalizedSendRoute}` : ""),
      [normalizedApiBase, normalizedSendRoute, apiSendRoute]
    )
  
    const addVariable = () => setVariables((v) => [...v, { key: "", label: "" }])
  
    const updateVariable = (i: number, field: "key" | "label", value: string) =>
      setVariables((v) => v.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)))
  
    const removeVariable = (i: number) => setVariables((v) => v.filter((_, idx) => idx !== i))
  
    const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length) setSignatures((prev) => [...prev, ...files])
    }
  
    const applyRecipientsFromText = useCallback(() => {
      const parsed = parseRecipientsFromText(recipientsText)
      setRecipients(parsed)
      setSentCount(0)
      setSendError(null)
    }, [recipientsText])
  
    // Recipients file upload (front-only: no API)
    const handleRecipientsFileUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (!f) return
  
      // reset input so selecting same file again triggers onChange
      e.target.value = ""
  
      try {
        setSendError(null)
  
        const text = await f.text()
        // keep the raw text visible in the textarea for transparency/debug
        setRecipientsText(text)
  
        // Simple heuristics: CSV files are parsed by lines, TXT lists too.
        // `parseRecipientsFromText` should accept:
        // - one email per line
        // - optionally: "email,prenom,nom" style lines (CSV)
        const parsed = parseRecipientsFromText(text)
  
        setRecipients(parsed)
        setSentCount(0)
        setSendError(null)
      } catch (err) {
        setSendError(err instanceof Error ? err.message : String(err))
      }
    }, [])
  
    const bodyRef = useRef<HTMLTextAreaElement | null>(null)
    const sendAbortRef = useRef<AbortController | null>(null)
  
    const [subject, setSubject] = useState("")
    const [body, setBody] = useState("")
  
    const [format, setFormat] = useState<"md" | "html" | "txt">("md")
  
    const insertAtCursor = (token: string) => {
      const el = bodyRef.current
      if (!el) return
      const start = el.selectionStart ?? body.length
      const end = el.selectionEnd ?? body.length
      const next = body.slice(0, start) + token + body.slice(end)
      setBody(next)
      requestAnimationFrame(() => {
        el.focus()
        const pos = start + token.length
        el.setSelectionRange(pos, pos)
      })
    }
  
  
  
    const handleSend = useCallback(async () => {
      if (isSending) return
      setSendError(null)
  
      if (!sendUrl) {
        setSendError("API not configured (Base URL + Send route).")
        return
      }
  
      if (recipients.length === 0) {
        setSendError("No recipients. Paste a list or upload a CSV/TXT, then click Apply.")
        return
      }
  
      setIsSending(true)
      setSentCount(0)
  
      const controller = new AbortController()
      sendAbortRef.current = controller
  
      try {
        const delayMs = Math.max(0, Number.isFinite(rateLimit) ? rateLimit : 0) * 1000
  
        for (let i = 0; i < recipients.length; i++) {
          if (controller.signal.aborted) throw new Error("Sending cancelled")
  
          const rec = recipients[i]
          const subjectRendered = renderTemplate(subject, rec)
          const bodyRendered = renderTemplate(body, rec)
  
          const res = await fetch(sendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: rec.email,
              subject: subjectRendered,
              body: bodyRendered,
              format,
              variables,
              rateLimitSeconds: rateLimit,
            }),
            signal: controller.signal,
          })
  
          if (!res.ok) {
            const msg = await res.text().catch(() => "")
            throw new Error(msg || `Send failed (HTTP ${res.status})`)
          }
  
          setSentCount(i + 1)
  
          if (i < recipients.length - 1 && delayMs > 0) await sleep(delayMs)
        }
      } catch (err) {
        // If user cancelled, keep the message clear
        if (err instanceof DOMException && err.name === "AbortError") {
          setSendError("Sending cancelled")
        } else {
          setSendError(err instanceof Error ? err.message : String(err))
        }
      } finally {
        sendAbortRef.current = null
        setIsSending(false)
      }
    }, [
      isSending,
      sendUrl,
      recipients,
      subject,
      body,
      format,
      variables,
      rateLimit,
    ])
  
    const handleStopSending = useCallback(() => {
      sendAbortRef.current?.abort()
    }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight">Maily</p>
            <p className="truncate text-sm text-muted-foreground leading-tight">Bulk Sender</p>
          </div>
        </div>

        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
          title="John Doe"
          aria-label="John Doe"
        >
          JD
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[84px] shrink-0 flex-col items-center border-r py-6">
          <nav className="flex w-full flex-col items-center gap-3">
            {primaryNav.map(({ to, label, Icon }) => (
              <Link
                key={label}
                to={to}
                className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors ${
                  isActive(to)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                }`}
                title={label}
                aria-label={label}
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </nav>

          <nav className="mt-auto flex w-full flex-col items-center gap-3">
            {secondaryNav.map(({ to, label, Icon }) => (
              <Link
                key={label}
                to={to}
                className={`inline-flex size-11 items-center justify-center rounded-xl border transition-colors ${
                  isActive(to)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
                }`}
                title={label}
                aria-label={label}
              >
                <Icon className="size-5" />
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}


                    <div className="flex min-h-0 flex-1 min-w-0 gap-4 overflow-hidden p-6">
                      <ComposeEmailCard
                        subject={subject}
                        setSubject={setSubject}
                        body={body}
                        setBody={setBody}
                        format={format}
                        setFormat={setFormat}
                        variables={variables}
                        insertAtCursor={insertAtCursor}
                        showPreview={showPreview}
                        setShowPreview={setShowPreview}
                        recipientsPreviewEmail={recipients[0]?.email}
                        isSending={isSending}
                        recipientsCount={recipients.length}
                        handleSend={handleSend}
                        handleStopSending={handleStopSending}
                        sendError={sendError}
                        bodyRef={bodyRef}
                      />
                      <CampaignSettingsCard
                        recipientsText={recipientsText}
                        setRecipientsText={setRecipientsText}
                        recipientsCount={recipients.length}
                        applyRecipientsFromText={applyRecipientsFromText}
                        handleRecipientsFileUpload={handleRecipientsFileUpload}
                        format={format}
                        variablesCount={variables.length}
                        rateLimit={rateLimit}
                        sentCount={sentCount}
                        signatures={signatures}
                        handleSignatureUpload={handleSignatureUpload}
                        addVariable={addVariable}
                        updateVariable={updateVariable}
                        removeVariable={removeVariable}
                        variables={variables}
                        apiBaseUrl={apiBaseUrl}
                        setApiBaseUrl={setApiBaseUrl}
                        apiSendRoute={apiSendRoute}
                        setApiSendRoute={setApiSendRoute}
                        sendUrl={sendUrl}
                        setRateLimit={setRateLimit}
                      />
                    </div>
        </main>
      </div>
    </div>
  )
}
