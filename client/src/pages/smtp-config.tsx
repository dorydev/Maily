import { useMemo, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Mail, Server, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type SmtpSecurity = "starttls" | "ssl_tls" | "none"

type SmtpFormState = {
  accountName: string
  fromName: string
  fromEmail: string
  replyTo: string
  host: string
  port: string
  security: SmtpSecurity
  authRequired: boolean
  username: string
  password: string
  allowSelfSignedCerts: boolean
  timeoutSeconds: string
}

type LocationState = {
  email?: string
  accountName?: string
}

const STORAGE_KEY = "maily.smtp.config"

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

const defaultState = (state: LocationState | null): SmtpFormState => ({
  accountName: state?.accountName ?? "",
  fromName: state?.accountName ?? "",
  fromEmail: state?.email ?? "",
  replyTo: state?.email ?? "",
  host: "",
  port: "587",
  security: "starttls",
  authRequired: true,
  username: state?.email ?? "",
  password: "",
  allowSelfSignedCerts: false,
  timeoutSeconds: "30",
})

function SmtpConfigPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LocationState | null) ?? null

  const [form, setForm] = useState<SmtpFormState>(() => {
    const defaults = defaultState(locationState)

    if (typeof window === "undefined") {
      return defaults
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return defaults
      const parsed = JSON.parse(raw) as Partial<SmtpFormState>
      return { ...defaults, ...parsed }
    } catch {
      return defaults
    }
  })

  const [errors, setErrors] = useState<string[]>([])
  const [statusMessage, setStatusMessage] = useState("")
  const [statusKind, setStatusKind] = useState<"success" | "error" | "idle">("idle")

  const smtpUrlPreview = useMemo(() => {
    const protocol = form.security === "ssl_tls" ? "smtps" : "smtp"
    const user = form.username.trim()
    const authPart = user ? `${encodeURIComponent(user)}@` : ""
    return `${protocol}://${authPart}${form.host.trim()}:${form.port.trim()}`
  }, [form.security, form.username, form.host, form.port])

  const updateField = <K extends keyof SmtpFormState>(key: K, value: SmtpFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const validateForm = (): string[] => {
    const validationErrors: string[] = []

    if (!form.accountName.trim()) validationErrors.push("Account name is required.")
    if (!form.fromName.trim()) validationErrors.push("From name is required.")
    if (!isValidEmail(form.fromEmail)) validationErrors.push("From email is invalid.")
    if (form.replyTo.trim() && !isValidEmail(form.replyTo)) validationErrors.push("Reply-to email is invalid.")
    if (!form.host.trim()) validationErrors.push("SMTP host is required.")

    const parsedPort = Number.parseInt(form.port, 10)
    if (Number.isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
      validationErrors.push("Port must be a number between 1 and 65535.")
    }

    const timeout = Number.parseInt(form.timeoutSeconds, 10)
    if (Number.isNaN(timeout) || timeout < 1 || timeout > 300) {
      validationErrors.push("Timeout must be a number between 1 and 300 seconds.")
    }

    if (form.authRequired) {
      if (!form.username.trim()) validationErrors.push("Username is required when authentication is enabled.")
      if (!form.password.trim()) validationErrors.push("Password is required when authentication is enabled.")
    }

    return validationErrors
  }

  const saveConfiguration = (openWorkspace: boolean) => {
    const validationErrors = validateForm()
    setErrors(validationErrors)

    if (validationErrors.length > 0) {
      setStatusKind("error")
      setStatusMessage("Please fix the form errors before saving.")
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      setStatusKind("success")
      setStatusMessage("SMTP configuration saved.")

      if (openWorkspace) {
        navigate("/home")
      }
    } catch (error) {
      setStatusKind("error")
      setStatusMessage(error instanceof Error ? error.message : "Unable to save configuration.")
    }
  }

  return (
    <div className="smtp-config-page relative min-h-screen overflow-hidden px-4 py-8">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Maily</p>
            <h1 className="text-2xl font-semibold tracking-tight">SMTP Configuration</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/login" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardHeader>
              <CardTitle>Connection Details</CardTitle>
              <CardDescription>Set the SMTP server and sender identity used by campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <section className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="accountName">Account name</Label>
                  <Input
                    id="accountName"
                    value={form.accountName}
                    onChange={(e) => updateField("accountName", e.target.value)}
                    placeholder="Work account"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromName">From name</Label>
                  <Input
                    id="fromName"
                    value={form.fromName}
                    onChange={(e) => updateField("fromName", e.target.value)}
                    placeholder="Maily Team"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={form.fromEmail}
                    onChange={(e) => updateField("fromEmail", e.target.value)}
                    placeholder="sender@example.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="replyTo">Reply-to (optional)</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={form.replyTo}
                    onChange={(e) => updateField("replyTo", e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="host">SMTP host</Label>
                  <Input
                    id="host"
                    value={form.host}
                    onChange={(e) => updateField("host", e.target.value)}
                    placeholder="smtp.example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={form.port}
                    onChange={(e) => updateField("port", e.target.value)}
                    placeholder="587"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="security">Security</Label>
                  <Select
                    value={form.security}
                    onValueChange={(value) => {
                      const nextSecurity = value as SmtpSecurity
                      updateField("security", nextSecurity)
                      if (nextSecurity === "ssl_tls" && form.port === "587") updateField("port", "465")
                      if (nextSecurity !== "ssl_tls" && form.port === "465") updateField("port", "587")
                    }}
                  >
                    <SelectTrigger id="security" className="w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starttls">STARTTLS</SelectItem>
                      <SelectItem value="ssl_tls">SSL/TLS</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeoutSeconds">Timeout (seconds)</Label>
                  <Input
                    id="timeoutSeconds"
                    type="number"
                    value={form.timeoutSeconds}
                    onChange={(e) => updateField("timeoutSeconds", e.target.value)}
                    placeholder="30"
                  />
                </div>
              </section>

              <section className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Authentication</p>
                    <p className="text-xs text-muted-foreground">Enable SMTP auth with username and password.</p>
                  </div>
                  <Switch
                    checked={form.authRequired}
                    onCheckedChange={(checked) => updateField("authRequired", checked)}
                    aria-label="Authentication switch"
                  />
                </div>

                {form.authRequired && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(e) => updateField("username", e.target.value)}
                        placeholder="smtp-user"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        placeholder="********"
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="text-sm font-medium">Allow self-signed certificates</p>
                  <p className="text-xs text-muted-foreground">
                    Keep disabled in production unless your SMTP provider requires it.
                  </p>
                </div>
                <Switch
                  checked={form.allowSelfSignedCerts}
                  onCheckedChange={(checked) => updateField("allowSelfSignedCerts", checked)}
                  aria-label="Allow self-signed certificates switch"
                />
              </section>

              {errors.length > 0 && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  <p className="mb-2 font-medium">Fix the following before saving:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/login")}>
                  Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={() => saveConfiguration(false)}>
                  Save only
                </Button>
                <Button type="button" onClick={() => saveConfiguration(true)}>
                  Save and open workspace
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4" />
                  Endpoint Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg bg-muted/60 p-3 font-mono text-xs break-all">{smtpUrlPreview}</div>
                <p className="text-xs text-muted-foreground">
                  Security: <strong>{form.security.toUpperCase()}</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4" />
                  Sender
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  {form.fromName || "No sender name"} {"<"}
                  {form.fromEmail || "no-email@example.com"}
                  {">"}
                </p>
                <p className="text-xs text-muted-foreground">Reply-to: {form.replyTo || "Not set"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusKind === "idle" && (
                  <p className="text-sm text-muted-foreground">Fill the form, then save your SMTP configuration.</p>
                )}
                {statusKind === "error" && <p className="text-sm text-destructive">{statusMessage}</p>}
                {statusKind === "success" && (
                  <p className="inline-flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {statusMessage}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmtpConfigPage
