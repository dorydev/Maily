import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate("/home"); // change "/home" to the route you want
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Connect to Maily
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose your email provider to get started.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Continue with
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
            onClick={handleLogin}
          >
            <span>Microsoft Outlook</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
          >
            <span>Google Mail</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex w-full items-center justify-center gap-2"
          >
            <span>Other</span>
          </Button>

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
        </div>
      </div>
    </div>
  );
}

export default Login;
