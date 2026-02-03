import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Field, FieldLabel } from "../components/ui/field";
import { Input } from "../components/ui/input";

import microsoftIcon from "../assets/icons8-microsoft-96.png";
import googleIcon from "../assets/icons8-google-96.png";

type Provider = "other";

function Login() {
  const navigate = useNavigate();
  const [expandedProvider, setExpandedProvider] = useState<Provider | null>(null);

  const toggleProvider = () => {
    setExpandedProvider("other");
  };

  const goBack = () => {
    setExpandedProvider(null);
  };

  const handleLogin = () => {
    navigate("/home");
  };

  const renderCredentials = (p: Provider) => {
    if (expandedProvider !== p) return null;
    return (
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-3 text-sm font-medium text-center">Configure prodiver</div>

        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor={`Protocol`}>Email</FieldLabel>
            <Input id={`email-${p}`} type="email" placeholder="you@example.com" />
          </Field>

          <Field>
            <FieldLabel htmlFor={`password`}>Password</FieldLabel>
            <Input id={`password-${p}`} type="password" placeholder="••••••••" />
          </Field>

          <Button type="button" className="w-full" onClick={handleLogin}>
            Continue
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        {expandedProvider ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted"
              aria-label="Back"
              title="Back"
            >
              <span className="text-lg leading-none">←</span>
            </button>

            <div className="flex-1 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Login</h2>
              <p className="text-sm text-muted-foreground">
                Other provider
              </p>
            </div>

            {/* spacer to keep title perfectly centered */}
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
            <>
              {renderCredentials(expandedProvider)}
            </>
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
                <br />
              </div>
              <div className="flex justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  Log with your own provider.
                </p>
              </div>

              <div className="bg-background p-2 ">
                  <div className="space-y-4">
                    <Field>
                      <FieldLabel htmlFor={`email`}>Email</FieldLabel>
                      <Input id={`email`} type="email" placeholder="you@example.com" />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`password`}>Password</FieldLabel>
                      <Input id={`password`} type="password" placeholder="••••••••" />
                    </Field>

                    <Button type="button" className="w-full mt-5" onClick={() => toggleProvider()}>
                      Continue
                    </Button>
                  </div>
             </div>
             

              <p className="px-6 text-center text-xs text-muted-foreground">
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
  );
}

export default Login;
