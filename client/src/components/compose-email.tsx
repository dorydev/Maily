

import { Button } from "../components/ui/button"
import { ButtonGroup } from "./ui/button-group"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
//import { Switch } from "../components/ui/switch";

import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"

import { MailPreview } from "../components/mail-preview"

import fontIcon from "../assets/icons8-font-90.svg"
import fileIcon from "../assets/icons8-add-file-100.svg"
import linkIcon from "../assets/icons8-add-link-100.svg"
import { MaskIcon } from "../components/mask-icon"

type ComposeEmailCardProps = {
  subject: string
  setSubject: (v: string) => void
  body: string
  setBody: (v: string) => void
  format: "md" | "html" | "txt"
  setFormat: (v: "md" | "html" | "txt") => void
  variables: { key: string; label: string }[]
  insertAtCursor: (token: string) => void
  showPreview: boolean
  setShowPreview: (v: boolean) => void
  recipientsPreviewEmail?: string
  isSending: boolean
  recipientsCount: number
  handleSend: () => void
  handleStopSending: () => void
  sendError: string | null
  bodyRef: React.RefObject<HTMLTextAreaElement | null>
}

export function ComposeEmailCard({
  subject,
  setSubject,
  body,
  setBody,
  format,
  setFormat,
  variables,
  insertAtCursor,
  showPreview,
  setShowPreview,
  recipientsPreviewEmail,
  isSending,
  recipientsCount,
  handleSend,
  sendError,
  bodyRef,
}: ComposeEmailCardProps) {
  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base font-semibold">Compose Email</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
            <Label htmlFor="body" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Message Body
            </Label>
            <Textarea
              id="body"
              ref={bodyRef}
              className="flex-1 min-h-0 resize-none text-sm"
              placeholder="Write your email message here... Use variables like $prenom"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
     <ButtonGroup>
                <Popover open={showPreview} onOpenChange={setShowPreview}>
                 
                  <PopoverTrigger asChild>
                    
                      <Button type="button" size="sm" variant={showPreview ? "secondary" : "outline"}>
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                  </PopoverTrigger>
                  
                  <PopoverContent className="w-[min(560px,85vw)] h-[70vh] overflow-auto" align="end">
                    <div className="[&_p]:my-0 [&_h1]:my-0 [&_h2]:my-0 [&_ul]:my-0 [&_ol]:my-0">
                      <MailPreview
                        subject={subject}
                        body={body}
                        format={format}
                        recipientEmail={recipientsPreviewEmail}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <Button type="button" size="sm">
                  v
                </Button>
                </ButtonGroup>

                <Button size="sm" onClick={handleSend} disabled={isSending || recipientsCount === 0}>
                  {isSending ? "Sending..." : "Send Campaign"}
                </Button>
              </div>

              <Button type="button" variant="ghost" size="sm" className="h-9 gap-2">
                <MaskIcon src={fontIcon} className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      type="button"
                      size="sm"
                      variant={format === "txt" ? "secondary" : "outline"}
                      className="flex-1"
                    >
                    {format.toUpperCase()}
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

              <Button type="button" variant="ghost" size="sm" className="h-9" disabled>
                <MaskIcon src={fileIcon} className="h-4 w-4" />
              </Button>

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
          </div>

          {sendError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <strong>Error:</strong> {sendError}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
