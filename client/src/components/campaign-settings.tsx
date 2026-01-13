import { type ChangeEvent } from "react"

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
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"


type CampaignSettingsCardProps = {
  recipientsText: string
  setRecipientsText: (v: string) => void
  recipientsCount: number
  applyRecipientsFromText: () => void
  handleRecipientsFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
  format: "md" | "html" | "txt"
  variablesCount: number
  rateLimit: number
  sentCount: number
  signatures: File[]
  handleSignatureUpload: (e: ChangeEvent<HTMLInputElement>) => void
  addVariable: () => void
  updateVariable: (i: number, field: "key" | "label", value: string) => void
  removeVariable: (i: number) => void
  variables: { key: string; label: string }[]
  apiBaseUrl: string
  setApiBaseUrl: (v: string) => void
  apiSendRoute: string
  setApiSendRoute: (v: string) => void
  sendUrl: string
  setRateLimit: (v: number) => void
}

export function CampaignSettingsCard({
  recipientsText,
  setRecipientsText,
  recipientsCount,
  applyRecipientsFromText,
  handleRecipientsFileUpload,
  format,
  variablesCount,
  rateLimit,
  sentCount,
  signatures,
  handleSignatureUpload,
  addVariable,
  updateVariable,
  removeVariable,
  variables,
  apiBaseUrl,
  setApiBaseUrl,
  apiSendRoute,
  setApiSendRoute,
  sendUrl,
  setRateLimit,
}: CampaignSettingsCardProps) {
  return (
    <Card className="flex min-h-0 flex-col w-[clamp(260px,26vw,380px)] shrink-0">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">Campaign Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto pt-6">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recipients</Label>
            {recipientsCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {recipientsCount}
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
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Campaign Stats</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Format</div>
              <div className="font-semibold text-sm">{format.toUpperCase()}</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Variables</div>
              <div className="font-semibold text-sm">{variablesCount}</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Rate Limit</div>
              <div className="font-semibold text-sm">{rateLimit}s</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Progress</div>
              <div className="font-semibold text-sm">
                {sentCount}/{recipientsCount}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <div className="mt-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                Advanced Settings
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[420px] space-y-4" align="end">
              <section className="space-y-2 w-full">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Select mail account</Label>
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
                        <div className="text-xs text-muted-foreground">No variables yet. Click "Add variable".</div>
                      )}
                    </div>
                  </div>
                </ScrollArea>

                <Button type="button" size="sm" variant="outline" className="w-full bg-transparent" onClick={addVariable}>
                  + Add variable
                </Button>
              </section>

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

              <section className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">API Configuration</Label>

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

              <section className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Rate limit (seconds between emails)</Label>
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
  )
}

