import {  useRef, useState, type ChangeEvent} from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"

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


import fontIcon from "../assets/icons8-font-90.svg";
import fileIcon from "../assets/icons8-add-file-100.svg";
import linkIcon from "../assets/icons8-add-link-100.svg";

type MaskIconProps = {
  src: string;
  className?: string;
};

function MaskIcon({ src, className }: MaskIconProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}



function Home() {

  //const [composeMode, setComposeMode] = useState<"manual" | "upload">("manual");
  //const [sidebarDraft, setSidebarDraft] = useState("");
  //const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

// Recipients (one mail per recipient, no CC)
  type Recipient = { email: string; data: Record<string, string> };
  const [recipientsText, setRecipientsText] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([]);
    
  const [rateLimit, setRateLimit] = useState<number>(1.0);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [apiSendRoute, setApiSendRoute] = useState("");
  const [variables, setVariables] = useState<{ key: string; label: string }[]>([
    { key: "$prenom", label: "Prenom" },
  ]);
  const [signatures, setSignatures] = useState<File[]>([]);


  // Sending progress
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [sendError, setSendError] = useState<string | null>(null);

  const addVariable = () =>
    setVariables((v) => [...v, { key: "", label: "" }]);

  const updateVariable = (i: number, field: "key" | "label", value: string) =>
    setVariables((v) =>
      v.map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      )
    );

  const removeVariable = (i: number) =>
    setVariables((v) => v.filter((_, idx) => idx !== i));

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setSignatures((prev) => [...prev, ...files]);
  };



  // Parse recipients from textarea:
  // - one email per line, OR
  // - CSV-like with ';' or ',' and optional header line.
  const parseRecipientsFromText = (text: string): Recipient[] => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return [];

    const sep = lines.some((l) => l.includes(";"))
      ? ";"
      : lines.some((l) => l.includes(","))
        ? ","
        : null;

    const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

    if (!sep) {
      return lines
        .filter(isEmail)
        .map((email) => ({ email, data: {} }));
    }

    const rows = lines.map((l) => l.split(sep).map((x) => x.trim()));
    const first = rows[0] ?? [];
    const looksLikeHeader = first.some((cell) => cell && !isEmail(cell));

    const headers = looksLikeHeader
      ? first
      : ["email", ...first.slice(1).map((_, i) => `col${i + 1}`)];

    const startIdx = looksLikeHeader ? 1 : 0;
    const out: Recipient[] = [];

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i] ?? [];
      const rec: Recipient = { email: "", data: {} };

      headers.forEach((h, idx) => {
        const key = (h || "").toLowerCase();
        const val = row[idx] ?? "";
        if (key === "email" || key === "mail") rec.email = val;
        else if (key) rec.data[key] = val;
      });

      if (rec.email && isEmail(rec.email)) out.push(rec);
    }

    return out;
  };

  const applyRecipientsFromText = () => {
    const parsed = parseRecipientsFromText(recipientsText);
    setRecipients(parsed);
    setSentCount(0);
    setSendError(null);
  };

  const handleRecipientsFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setRecipientsText(text);
    e.target.value = "";
  };

  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [format, setFormat] = useState<"md" | "html" | "txt">("md");


   const insertAtCursor = (token: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const renderTemplate = (tpl: string, rec: Recipient) => {
    return tpl.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, (m) => {
      const key = m.slice(1).toLowerCase();
      if (key === "email") return rec.email;
      return rec.data[key] ?? m;
    });
  };


  const normalizedApiBase = apiBaseUrl.trim().replace(/\/+$/, "");
  const normalizedSendRoute = apiSendRoute.trim().startsWith("/")
    ? apiSendRoute.trim()
    : `/${apiSendRoute.trim()}`;
  const sendUrl =
    normalizedApiBase && apiSendRoute.trim()
      ? `${normalizedApiBase}${normalizedSendRoute}`
      : "";



  const handleSend = async () => {
    if (isSending) return;
    setSendError(null);

    if (!sendUrl) {
      setSendError("API not configured (Base URL + Send route).");
      return;
    }

    if (recipients.length === 0) {
      setSendError("No recipients. Paste a list or upload a CSV/TXT, then click Apply.");
      return;
    }

    setIsSending(true);
    setSentCount(0);

    try {
      for (let i = 0; i < recipients.length; i++) {
        const rec = recipients[i];
        const subjectRendered = renderTemplate(subject, rec);
        const bodyRendered = renderTemplate(body, rec);

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
        });

        setSentCount(i + 1);

        const delayMs = Math.max(0, Number.isFinite(rateLimit) ? rateLimit : 0) * 1000;
        if (i < recipients.length - 1 && delayMs > 0) await sleep(delayMs);
      }
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSending(false);
    }
  };

  
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SidebarProvider>
        <AppSidebar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 p-6">
        <SidebarTrigger />

        {/* Left: prompt area */}
        <Card className="flex flex-1 flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground font-bold text-xl">
              New Mail :
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <Input
              placeholder="Object"
              className="h-9 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Textarea
              ref={bodyRef}
              className="flex-1 min-h-[320px] resize-none border-0 bg-background px-0 py-0 text-sm"
              placeholder="Write your mail here ..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {/* Actions (moved inside the editor card) */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <Button size="sm" variant="outline">
                ⟲
              </Button>
               {/* Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Format chooser */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" aria-label="Format">
                            <MaskIcon src={fontIcon} className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[220px] space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Format
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "md" ? "secondary" : "outline"}
                              onClick={() => setFormat("md")}
                            >
                              MD
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "html" ? "secondary" : "outline"}
                              onClick={() => setFormat("html")}
                            >
                              HTML
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={format === "txt" ? "secondary" : "outline"}
                              onClick={() => setFormat("txt")}
                            >
                              TXT
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Current: <span className="text-foreground font-medium">{format.toUpperCase()}</span>
                          </p>
                        </PopoverContent>
                      </Popover>

                      {/* Attachments placeholder */}
                      <Button type="button" variant="ghost" size="icon" aria-label="Attachments">
                        <MaskIcon src={fileIcon} className="h-5 w-5" />
                      </Button>

                      {/* Insert variable */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" aria-label="Insert variable">
                            <MaskIcon src={linkIcon} className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[260px] space-y-2">
                          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                            Insert variable
                          </Label>

                          {variables.filter((v) => v.key.trim() && v.label.trim()).length === 0 ? (
                            <div className="text-xs text-muted-foreground">
                              No variables configured in Settings.
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
                                    className="justify-between"
                                    onClick={() => insertAtCursor(v.key)}
                                  >
                                    <span className="font-mono">{v.key}</span>
                                    <span className="text-xs text-muted-foreground">{v.label}</span>
                                  </Button>
                                ))}
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {sentCount}/{recipients.length}
                </Badge>
                <Button type="button" size="sm" variant="outline">
                  Preview
                </Button>
                <Button size="sm" onClick={handleSend} disabled={isSending}>
                  {isSending ? "Sending…" : "Submit"}
                </Button>
              </div>
            </div>

            {sendError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                {sendError}
              </div>
            )}
          </CardContent>
        </Card>
         {/* Right: controls */}
        <Card className="flex w-[280px] flex-col">
          <CardTitle className="flex items-center border-b border-border text-muted-foreground font-bold text-lg">
            <div className="ml-4 mb-4">Informations</div>
          </CardTitle>
          <CardContent className="flex flex-1 flex-col gap-6 pt-6 align-middle items-center justify-center">
            {/* RECIPIENTS */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Recipients (no CC)
                  </Label>

                  <Textarea
                    value={recipientsText}
                    onChange={(e) => setRecipientsText(e.target.value)}
                    placeholder={"Paste emails (one per line)\nOR CSV-like: email;prenom;nom"}
                    className="min-h-[120px] resize-none text-sm"
                  />

                  <div className="flex items-center justify-between gap-2">
                    <Button type="button" size="sm" variant="secondary" onClick={applyRecipientsFromText}>
                      Apply
                    </Button>

                    <Button asChild type="button" size="sm" variant="outline">
                      <label className="cursor-pointer">
                        Upload CSV/TXT
                        <input
                          type="file"
                          accept=".csv,.txt,text/csv,text/plain"
                          className="hidden"
                          onChange={handleRecipientsFileUpload}
                        />
                      </label>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    One API call per recipient → unique mail per person (no CC).
                  </p>
                  <div className="flex items-center">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground mr-1">
                      Mails count
                    </Label>
                    <Badge variant="outline">{recipients.length} mails</Badge>
                  </div>
                  <div className="flex items-center">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Format
                    </Label>
                    <Badge variant="outline" className="ml-1">
                      {format.toUpperCase()}
                    </Badge>
                  </div>
                </section>

            <div className="align-bottom mt-auto">
              <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[420px] space-y-4">
              {/* MAIL SELECTOR */}
                <section className="space-y-2 w-full">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Select mail account
                  </Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
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
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Variables
                  </Label>

                  <ScrollArea className="h-14 w-full rounded-md border">
                    <div className="p-3 pr-4 pb-4">
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
                            No variables yet. Click “Add variable”.
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollArea>

                  <Button size="sm" variant="outline" onClick={addVariable}>
                    + Add variable
                  </Button>
                </section>
                {/* RATE LIMIT */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Rate limit
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={rateLimit}
                    onChange={(e) => setRateLimit(parseFloat(e.target.value))}
                    className="h-8"
                    placeholder="Seconds between mails"
                  />
                </section>

                {/* API */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    API
                  </Label>
                  <Input
                    className="h-8"
                    placeholder="Base URL (https://api.example.com)"
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                  />
                  <Input
                    className="h-8"
                    placeholder="Send route (/mail/send)"
                    value={apiSendRoute}
                    onChange={(e) => setApiSendRoute(e.target.value)}
                  />
                  {sendUrl ? (
                    <div className="rounded-md border border-border p-3 text-xs">
                      <div className="text-muted-foreground">Send URL</div>
                      <div className="mt-1 break-all text-foreground">{sendUrl}</div>
                    </div>
                  ) : (
                    <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                      Configure Base URL and Send route to enable sending.
                    </div>
                  )}
                </section>

                {/* SIGNATURES */}
                <section className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Signatures
                  </Label>

                  <Button asChild size="sm" variant="outline">
                    <label className="cursor-pointer">
                      Upload signatures
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleSignatureUpload}
                      />
                    </label>
                  </Button>

                  {signatures.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {signatures.map((f, i) => (
                        <li key={i}>{f.name}</li>
                      ))}
                    </ul>
                  )}
                </section>
                <section className="border-border border-t pt-4">
                  <div className="mx-auto grid w-full max-w-[360px] grid-cols-2 gap-3 py-2">
                    <Button className="h-11 w-full" size="sm" variant="secondary">
                      Add Account +
                    </Button>
                    <Button className="h-11 w-full" size="sm" variant="destructive">
                      Log Out
                    </Button>
                  </div>
                </section>
              </PopoverContent>
            </Popover>
            </div>
          </CardContent>
        </Card>
      </main>
      </SidebarProvider>
    </div>
  );
}

export default Home;

