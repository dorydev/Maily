import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"

type MailPreviewProps = {
  subject: string
  body: string
  format: "md" | "html" | "txt"
  recipientEmail?: string
}

export function MailPreview({ subject, body, format, recipientEmail }: MailPreviewProps) {
  const renderBody = () => {
    if (format === "html") {
      return (
        <div dangerouslySetInnerHTML={{ __html: body || "<p class='text-muted-foreground text-sm'>Empty body</p>" }} />
      )
    }

    if (format === "md") {
      // Simple markdown preview (you could use a library like react-markdown)
      const formatted = body.split("\n").map((line, i) => {
        if (line.startsWith("# "))
          return (
            <h1 key={i} className="text-2xl font-bold mb-2">
              {line.slice(2)}
            </h1>
          )
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-xl font-semibold mb-2">
              {line.slice(3)}
            </h2>
          )
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <p key={i} className="font-bold mb-1">
              {line.slice(2, -2)}
            </p>
          )
        return (
          <p key={i} className="mb-1">
            {line || <br />}
          </p>
        )
      })

      return <div className="space-y-1">{formatted}</div>
    }

    // Plain text
    return <pre className="whitespace-pre-wrap font-sans text-sm">{body || "Empty body"}</pre>
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Email Preview</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            {format.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Email header simulation */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                  M
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">Maily Sender</span>
                    <Badge variant="secondary" className="text-xs">
                      via Maily
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">to {recipientEmail || "recipient@example.com"}</div>
                </div>
              </div>

              <Separator />

              {/* Subject line */}
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {subject || <span className="text-muted-foreground">No subject</span>}
                </h2>
              </div>
            </div>

            {/* Email body */}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {body ? (
                renderBody()
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Start typing to see preview...
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
