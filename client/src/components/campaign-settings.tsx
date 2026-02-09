import { type ChangeEvent } from "react"

/*import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"*/

//import { ScrollArea } from "../components/ui/scroll-area"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
//import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
//import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"


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
  /**signatures,
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
  setRateLimit,**/
}: CampaignSettingsCardProps) {
  return (
    <Card className="flex min-h-0 flex-col w-[clamp(260px,26vw,380px)] shrink-0">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold">Campaign Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto">
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
      </CardContent>
    </Card>
  )
}

