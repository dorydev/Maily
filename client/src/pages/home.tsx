"use client"

import { useRef, useState, useEffect, type ChangeEvent } from "react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch";

import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { SidebarProvider } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { MailPreview } from "../components/mail-preview"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"

import fontIcon from "../assets/icons8-font-90.svg"
import fileIcon from "../assets/icons8-add-file-100.svg"
import linkIcon from "../assets/icons8-add-link-100.svg"
import { MaskIcon } from "../components/mask-icon"

function Home() {

  // Dark-Light switch

  const [isDark, setIsDark] = useState(false);
  
    useEffect(() => {
      const root = document.documentElement;
      const stored = localStorage.getItem("theme");
  
      if (stored === "dark") {
        root.classList.add("dark");
        setIsDark(true);
        return;
      }
  
      if (stored === "light") {
        root.classList.remove("dark");
        setIsDark(false);
        return;
      }
      // Pas de thème stocké : on peut se baser sur la préférence système
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
      setIsDark(false);
    }
  }, []);
    const handleToggleTheme = (next: boolean) => {
    const root = document.documentElement;

    if (next) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(next);
  };


  // Recipients (one mail per recipient, no CC)
  type Recipient = { email: string; data: Record<string, string> }
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

  const addVariable = () => setVariables((v) => [...v, { key: "", label: "" }])

  const updateVariable = (i: number, field: "key" | "label", value: string) =>
    setVariables((v) => v.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)))

  const removeVariable = (i: number) => setVariables((v) => v.filter((_, idx) => idx !== i))

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) setSignatures((prev) => [...prev, ...files])
  }

  // Parse recipients from textarea:
  // - one email per line, OR
  // - CSV-like with ';' or ',' and optional header line.
  const parseRecipientsFromText = (text: string): Recipient[] => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length === 0) return []

    const sep = lines.some((l) => l.includes(";")) ? ";" : lines.some((l) => l.includes(",")) ? "," : null

    const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

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

  const applyRecipientsFromText = () => {
    const parsed = parseRecipientsFromText(recipientsText)
    setRecipients(parsed)
    setSentCount(0)
    setSendError(null)
  }

  const handleRecipientsFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const text = await f.text()
    setRecipientsText(text)
    e.target.value = ""
  }

  const bodyRef = useRef<HTMLTextAreaElement | null>(null)

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

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const renderTemplate = (tpl: string, rec: Recipient) => {
    return tpl.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, (m) => {
      const key = m.slice(1).toLowerCase()
      if (key === "email") return rec.email
      return rec.data[key] ?? m
    })
  }

  const normalizedApiBase = apiBaseUrl.trim().replace(/\/+$/, "")
  const normalizedSendRoute = apiSendRoute.trim().startsWith("/") ? apiSendRoute.trim() : `/${apiSendRoute.trim()}`
  const sendUrl = normalizedApiBase && apiSendRoute.trim() ? `${normalizedApiBase}${normalizedSendRoute}` : ""

  const handleSend = async () => {
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

    try {
      for (let i = 0; i < recipients.length; i++) {
        const rec = recipients[i]
        const subjectRendered = renderTemplate(subject, rec)
        const bodyRendered = renderTemplate(body, rec)

        await fetch(sendUrl, {
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
        })

        setSentCount(i + 1)

        const delayMs = Math.max(0, Number.isFinite(rateLimit) ? rateLimit : 0) * 1000
        if (i < recipients.length - 1 && delayMs > 0) await sleep(delayMs)
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar/>
        <main className="flex w-full min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 min-w-0 items-center gap-3 border-b bg-background px-6 py-3">
            
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
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
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight">Maily</div>
            <div className="truncate text-xs text-muted-foreground leading-tight">Bulk Sender</div>
          </div>

            <div className="ml-auto flex items-center gap-2">
              <Switch checked={isDark} onCheckedChange={handleToggleTheme} />
              <span className="text-sm text-muted-foreground">
                {isDark ? "Dark" : "Light"}
              </span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 min-w-0 gap-4 overflow-hidden p-6">
            <div className="flex flex-1 min-w-0 flex-col">
              <Card className="flex min-h-0 flex-1 flex-col">
                <CardHeader className="border-b pb-4">
                  <CardTitle className="text-base font-semibold">Compose Email</CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden pt-6">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="subject"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject..."
                      className="h-10"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col space-y-1.5">
                    <Label
                      htmlFor="body"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Message Body
                    </Label>
                    <Textarea
                      id="body"
                      ref={bodyRef}
                      className="flex-1 min-h-0 resize-none font-mono text-sm"
                      placeholder="Write your email message here... Use variables like $prenom"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-1">
                      {/* Format chooser */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="sm" className="h-9 gap-2">
                            <MaskIcon src={fontIcon} className="h-4 w-4" />
                            <span className="text-xs">{format.toUpperCase()}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] space-y-3">
                          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Email Format
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "md" ? "secondary" : "outline"}
                              onClick={() => setFormat("md")}
                              className="flex-1"
                            >
                              MD
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "html" ? "secondary" : "outline"}
                              onClick={() => setFormat("html")}
                              className="flex-1"
                            >
                              HTML
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "txt" ? "secondary" : "outline"}
                              onClick={() => setFormat("txt")}
                              className="flex-1"
                            >
                              TXT
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Attachments */}
                      <Button type="button" variant="ghost" size="sm" className="h-9" disabled>
                        <MaskIcon src={fileIcon} className="h-4 w-4" />
                      </Button>

                      {/* Insert variable */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="sm" className="h-9">
                            <MaskIcon src={linkIcon} className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] space-y-3">
                          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Insert Variable
                          </Label>

                          {variables.filter((v) => v.key.trim() && v.label.trim()).length === 0 ? (
                            <div className="text-xs text-muted-foreground py-2">
                              No variables configured. Add them in the settings panel.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {variables
                                .filter((v) => v.key.trim() && v.label.trim())
                                .map((v) => (
                                  <Button
                                    key={v.key}
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="justify-between h-9 font-normal"
                                    onClick={() => insertAtCursor(v.key)}
                                  >
                                    <span className="font-mono text-xs">{v.key}</span>
                                    <span className="text-xs text-muted-foreground">{v.label}</span>
                                  </Button>
                                ))}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center gap-2">
                      <Popover open={showPreview} onOpenChange={setShowPreview}>
                        <PopoverTrigger asChild>
                          <Button type="button" size="sm" variant={showPreview ? "secondary" : "outline"}>
                            {showPreview ? "Hide Preview" : "Show Preview"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[min(560px,85vw)] h-[70vh] overflow-auto" align="end">
                          <MailPreview subject={subject} body={body} format={format} recipientEmail={recipients[0]?.email} />
                        </PopoverContent>
                      </Popover>
                      <Button size="sm" onClick={handleSend} disabled={isSending || recipients.length === 0}>
                        {isSending ? "Sending..." : "Send Campaign"}
                      </Button>
                    </div>
                  </div>

                  {sendError && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                      <strong>Error:</strong> {sendError}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>


            <Card className="flex min-h-0 flex-col w-[clamp(260px,26vw,380px)] shrink-0">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-semibold">Campaign Settings</CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto pt-6">
                {/* RECIPIENTS */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Recipients
                    </Label>
                    {recipients.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {recipients.length}
                      </Badge>
                    )}
                  </div>

                  <Textarea
                    value={recipientsText}
                    onChange={(e) => setRecipientsText(e.target.value)}
                    placeholder="Paste emails or CSV data..."
                    className="min-h-[100px] resize-none text-xs font-mono"
                  />

                  <div className="flex items-center gap-2">
                    <Button type="button" size="sm" className="flex-1" onClick={applyRecipientsFromText}>
                      Apply
                    </Button>

                    <Button asChild type="button" size="sm" variant="outline">
                      <label className="cursor-pointer">
                        Upload CSV
                        <input
                          type="file"
                          accept=".csv,.txt,text/csv,text/plain"
                          className="hidden"
                          onChange={handleRecipientsFileUpload}
                        />
                      </label>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">One email per line or CSV format with headers.</p>
                </section>

                <Separator />

                <section className="space-y-3">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Campaign Stats
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-xs text-muted-foreground mb-1">Format</div>
                      <div className="font-semibold text-sm">{format.toUpperCase()}</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-xs text-muted-foreground mb-1">Variables</div>
                      <div className="font-semibold text-sm">{variables.length}</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-xs text-muted-foreground mb-1">Rate Limit</div>
                      <div className="font-semibold text-sm">{rateLimit}s</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <div className="text-xs text-muted-foreground mb-1">Progress</div>
                      <div className="font-semibold text-sm">
                        {sentCount}/{recipients.length}
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Settings popover */}
                <div className="mt-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent">
                        Advanced Settings
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[420px] space-y-4" align="end">
                      {/* MAIL SELECTOR */}
                      <section className="space-y-2 w-full">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Select mail account
                        </Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a mail..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Mails connected</SelectLabel>
                              <SelectItem value="mail_1">example1@mail.com</SelectItem>
                              <SelectItem value="mail_2">example2@mail.com</SelectItem>
                              <SelectItem value="mail_3">example3@mail.com</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </section>

                      {/* VARIABLES */}
                      <section className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Variables</Label>

                        <ScrollArea className="h-32 w-full rounded-md border">
                          <div className="p-3">
                            <div className="space-y-2">
                              {variables.map((v, i) => (
                                <div key={`${v.key}-${i}`} className="space-y-2">
                                  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2">
                                    <Input
                                      className="h-9"
                                      placeholder="$prenom"
                                      value={v.key}
                                      onChange={(e) => updateVariable(i, "key", e.target.value)}
                                    />
                                    <Input
                                      className="h-9"
                                      placeholder="Prenom"
                                      value={v.label}
                                      onChange={(e) => updateVariable(i, "label", e.target.value)}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9"
                                      onClick={() => removeVariable(i)}
                                      aria-label="Remove variable"
                                    >
                                      ✕
                                    </Button>
                                  </div>

                                  {i !== variables.length - 1 && <Separator />}
                                </div>
                              ))}

                              {variables.length === 0 && (
                                <div className="text-xs text-muted-foreground">
                                  No variables yet. Click "Add variable".
                                </div>
                              )}
                            </div>
                          </div>
                        </ScrollArea>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={addVariable}
                        >
                          + Add variable
                        </Button>
                      </section>

                      {/* SIGNATURES */}
                      <section className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Signatures</Label>

                        {signatures.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {signatures.map((f, i) => (
                              <Badge key={i} variant="secondary">
                                {f.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button asChild type="button" size="sm" variant="outline" className="w-full bg-transparent">
                          <label className="cursor-pointer">
                            Upload Signature Files
                            <input
                              type="file"
                              accept="image/*,.html,.txt"
                              multiple
                              className="hidden"
                              onChange={handleSignatureUpload}
                            />
                          </label>
                        </Button>
                      </section>

                      {/* API CONFIG */}
                      <section className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          API Configuration
                        </Label>

                        <div className="space-y-2">
                          <Input
                            placeholder="https://api.example.com"
                            value={apiBaseUrl}
                            onChange={(e) => setApiBaseUrl(e.target.value)}
                          />
                          <Input
                            placeholder="/send-mail"
                            value={apiSendRoute}
                            onChange={(e) => setApiSendRoute(e.target.value)}
                          />
                        </div>

                        {sendUrl && <p className="text-xs text-muted-foreground font-mono break-all">→ {sendUrl}</p>}
                      </section>

                      {/* RATE LIMIT */}
                      <section className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                          Rate limit (seconds between emails)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={rateLimit}
                          onChange={(e) => setRateLimit(Number.parseFloat(e.target.value) || 0)}
                        />
                      </section>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        </SidebarProvider>
    </div>
  )
}

export default Home
