import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../components/ui/button"
import { Field, FieldLabel } from "../components/ui/field"
import { Input } from "../components/ui/input"

import microsoftIcon from "../assets/icons8-microsoft-96.png"
import googleIcon from "../assets/icons8-google-96.png"

type Provider = "other"

function Login() {
  const navigate = useNavigate()
  const [expandedProvider, setExpandedProvider] = useState<Provider | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountName, setAccountName] = useState("")

  const openCustomProvider = () => {
    setExpandedProvider("other")
    if (!accountName.trim() && email.trim()) {
      const inferredName = email.split("@")[0]?.replace(/[._-]/g, " ").trim()
      if (inferredName) setAccountName(inferredName)
    }
  }

  const goBack = () => {
    setExpandedProvider(null)
  }

  const goToSmtpConfig = () => {
    navigate("/smtp-config", {
      state: {
        email: email.trim(),
        accountName: accountName.trim() || email.split("@")[0]?.trim() || "",
      },
    })
  }

  const renderCredentials = (provider: Provider) => {
    if (expandedProvider !== provider) return null

    return (
      <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="account_name">Account name</FieldLabel>
            <Input
              id="account_name"
              type="text"
              placeholder="Work account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="smtp_email">Email</FieldLabel>
            <Input
              id="smtp_email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            Next step: configure SMTP host, port, security mode, and authentication.
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={goToSmtpConfig}
            disabled={!email.trim()}
          >
            Open SMTP configuration
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center overflow-y-auto bg-background px-4 py-6 text-foreground sm:items-center sm:py-10">
      <div className="my-auto w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
        {expandedProvider ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
              aria-label="Back"
              title="Back"
            >
              <span className="text-lg leading-none">{"<"}</span>
            </button>

            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Configure provider</h2>
            </div>

            <div className="h-9 w-9" />
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Connect to Maily</h2>
            <p className="text-sm text-muted-foreground">Choose your email provider to get started.</p>
          </div>
        )}

        <div className="space-y-4">
          {expandedProvider ? (
            <>{renderCredentials(expandedProvider)}</>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Continue with</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="relative flex w-full items-center justify-center rounded-full border border-border bg-background py-6 text-base font-medium shadow-sm hover:bg-muted"
              >
                <img src={microsoftIcon} alt="Microsoft" className="h-7 w-7" />
                <span>Microsoft</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="relative flex w-full items-center justify-center rounded-full border border-border bg-background py-6 text-base font-medium shadow-sm hover:bg-muted"
              >
                <img src={googleIcon} alt="Google" className="h-7 w-7" />
                <span>Google</span>
              </Button>

              <div className="flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="flex justify-center">
                <p className="text-sm text-muted-foreground text-center">Log in with your own provider.</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
                <div className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>

                  <Button
                    type="button"
                    className="mt-2 w-full"
                    onClick={openCustomProvider}
                    disabled={!email.trim() || !password.trim()}
                  >
                    Continue
                  </Button>
                </div>
              </div>

              <p className="px-2 text-center text-xs text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline underline-offset-2">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
