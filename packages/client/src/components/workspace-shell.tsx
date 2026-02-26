import type { ReactNode } from "react"
import { useCallback, useRef, useState, type ChangeEvent } from "react"

//import { SidebarProvider } from "../components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Topbar } from "./topbar"
import { ComposeEmailCard } from "./compose-email"
import { CampaignSettingsCard } from "./campaign-settings"

import type { Recipient } from "../lib/types"
import { parseRecipientsFromText } from "../lib/recipients"
import { renderTemplate, sleep } from "../lib/mail"



type WorkspaceShellProps = {
  children?: ReactNode
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {

    // Recipients (one mail per recipient, no CC)
    const [recipientsText, setRecipientsText] = useState("")
    const [recipients, setRecipients] = useState<Recipient[]>([])
  
    const [rateLimit, setRateLimit] = useState<number>(1.0)
   
  
    // Sending progress
    const [isSending, setIsSending] = useState(false)
    const [sentCount, setSentCount] = useState(0)
    const [sendError, setSendError] = useState<string | null>(null)
  
    const [showPreview, setShowPreview] = useState(false)

  
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
  
          const res = await fetch("http://localhost:3000/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: rec.email,
              subject: subjectRendered,
              content: bodyRendered,
              format: format,
            }),
          });
  
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
      recipients,
      subject,
      body,
      format,
      rateLimit,
    ])
  
    const handleStopSending = useCallback(() => {
      sendAbortRef.current?.abort()
    }, [])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Topbar/>

      <div className="flex min-h-0 flex-1">
        <AppSidebar/>
        <main className="min-w-0 flex-1 flex flex-col">{children}
          <div className="flex min-h-0 flex-1 min-w-0 gap-4 overflow-hidden p-6">
            <ComposeEmailCard
                        subject={subject}
                        setSubject={setSubject}
                        body={body}
                        setBody={setBody}
                        format={format}
                        setFormat={setFormat}
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
                        
                        rateLimit={rateLimit}
                        sentCount={sentCount}
              setRateLimit={setRateLimit}
              />
            </div>
        </main>
      </div>
    </div>
  )
}
