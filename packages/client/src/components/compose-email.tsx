"use client"

import { useState } from "react"
import { PageHeader } from "./page-header"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Send, Paperclip, Eye, Code, Type, Bold, Italic, Link2, List, Image } from "lucide-react"

export function ComposeEmailCard() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  return (
    <>

      <div className="p-6 lg:p-8 flex flex-col gap-6 min-h-0 flex-1">

        {/* Email Body */}
        <Card className="border-border">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center p-6">
                <Label htmlFor="subject" className="sm:w-20 text-sm font-medium text-foreground shrink-0">
                  Sujet :
                </Label>
                <div className="flex-1">
                  <Input
                    id="subject"
                    placeholder="Sujet de votre email"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-card"
                  />
                </div>
              </div>
          <Tabs defaultValue="visual" className="w-full">
            <div className="flex items-center justify-between px-4 pt-4 pb-0">
              <TabsList className="bg-muted">
                <TabsTrigger value="visual" className="gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  Editeur
                </TabsTrigger>
                <TabsTrigger value="html" className="gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Apercu
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Bold">
                  <Bold className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Italic">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Link">
                  <Link2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="List">
                  <List className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Image">
                  <Image className="w-4 h-4" />
                </button>
              </div>
            </div>

            <CardContent className="p-4">
              <TabsContent value="visual" className="mt-0">
                <Textarea
                  placeholder="Redigez le contenu de votre email ici..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-80 bg-card resize-none text-sm leading-relaxed"
                />
              </TabsContent>
              <TabsContent value="html" className="mt-0">
                <Textarea
                  placeholder="<html>&#10;  <body>&#10;    <h1>Votre contenu HTML</h1>&#10;  </body>&#10;</html>"
                  className="min-h-80 bg-card resize-none font-mono text-sm leading-relaxed"
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <div className="min-h-80 rounded-md border border-border bg-card p-6">
                  {body ? (
                    <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{body}</div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {"L'apercu de votre email apparaitra ici..."}
                    </p>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Attachments & Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" className="gap-2 text-muted-foreground">
            <Paperclip className="w-4 h-4" />
            Joindre un fichier
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">Sauvegarder brouillon</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Send className="w-4 h-4" />
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
